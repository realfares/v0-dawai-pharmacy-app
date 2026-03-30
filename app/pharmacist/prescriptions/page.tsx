import { redirect } from "next/navigation"
import { getCurrentUser } from "@/app/actions/auth"
import { PharmacistNav } from "@/components/pharmacist-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getPendingPrescriptions, reviewPrescription } from "@/app/actions/pharmacist"
import { db } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FileCheck, CheckCircle, XCircle } from "lucide-react"
import Image from "next/image"

export default async function PharmacistPrescriptionsPage() {
  const user = await getCurrentUser()

  if (!user || user.role !== "Pharmacist") {
    redirect("/login")
  }

  const pendingPrescriptions = await getPendingPrescriptions()
  const allPrescriptions = db.prescriptions

  return (
    <div className="min-h-screen bg-background">
      <PharmacistNav userName={user.fullName} />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Prescription Review</h1>
          <p className="text-muted-foreground">Review and approve customer prescriptions</p>
        </div>

        {/* Pending Prescriptions */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileCheck className="h-5 w-5" />
              Pending Review ({pendingPrescriptions.length})
            </CardTitle>
            <CardDescription>Prescriptions awaiting your approval</CardDescription>
          </CardHeader>
          <CardContent>
            {pendingPrescriptions.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <p className="text-muted-foreground">All prescriptions reviewed</p>
              </div>
            ) : (
              <div className="space-y-6">
                {pendingPrescriptions.map((prescription) => {
                  const customer = db.findUserById(prescription.customerId)
                  return (
                    <div key={prescription.id} className="border rounded-lg p-4">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="font-semibold text-foreground mb-4">Prescription Details</h3>
                          <div className="space-y-3 mb-4">
                            <div>
                              <p className="text-sm text-muted-foreground">Prescription ID</p>
                              <p className="font-medium text-foreground">#{prescription.id}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Customer Name</p>
                              <p className="font-medium text-foreground">{customer?.fullName || "Unknown"}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Contact</p>
                              <p className="font-medium text-foreground">{customer?.phone || "N/A"}</p>
                              <p className="text-sm text-foreground">{customer?.email || "N/A"}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Upload Date</p>
                              <p className="font-medium text-foreground">
                                {new Date(prescription.uploadDate).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <div className="relative h-48 w-full rounded-lg overflow-hidden bg-muted border">
                            <Image
                              src={prescription.imageUrl || "/placeholder.svg"}
                              alt="Prescription"
                              fill
                              className="object-contain"
                              unoptimized
                            />
                          </div>
                        </div>

                        <div>
                          <h3 className="font-semibold text-foreground mb-4">Review Prescription</h3>
                          <form action={reviewPrescription} className="space-y-4">
                            <input type="hidden" name="prescriptionId" value={prescription.id} />
                            <div className="space-y-2">
                              <Label htmlFor={`notes-${prescription.id}`}>Pharmacist Notes</Label>
                              <Textarea
                                id={`notes-${prescription.id}`}
                                name="notes"
                                placeholder="Enter your review notes, recommendations, or concerns..."
                                rows={6}
                                required
                              />
                            </div>
                            <div className="flex gap-3">
                              <Button
                                type="submit"
                                name="status"
                                value="Approved"
                                className="flex-1 bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Approve
                              </Button>
                              <Button
                                type="submit"
                                name="status"
                                value="Rejected"
                                variant="destructive"
                                className="flex-1"
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                Reject
                              </Button>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* All Prescriptions History */}
        <Card>
          <CardHeader>
            <CardTitle>All Prescriptions</CardTitle>
            <CardDescription>Complete prescription history</CardDescription>
          </CardHeader>
          <CardContent>
            {allPrescriptions.length === 0 ? (
              <div className="text-center py-8">
                <FileCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No prescriptions yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {allPrescriptions.map((prescription) => {
                  const customer = db.findUserById(prescription.customerId)
                  const pharmacist = prescription.pharmacistId ? db.findUserById(prescription.pharmacistId) : null
                  return (
                    <div key={prescription.id} className="flex items-start justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-foreground">Prescription #{prescription.id.slice(-8)}</p>
                          <span
                            className={`text-xs font-medium px-2 py-1 rounded ${
                              prescription.status === "Approved"
                                ? "bg-green-100 text-green-700"
                                : prescription.status === "Rejected"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {prescription.status}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">Customer: {customer?.fullName || "Unknown"}</p>
                        <p className="text-xs text-muted-foreground">
                          Uploaded: {new Date(prescription.uploadDate).toLocaleDateString()}
                        </p>
                        {prescription.pharmacistNotes && (
                          <div className="mt-2 p-2 bg-muted rounded text-sm">
                            <p className="text-muted-foreground mb-1">
                              <span className="font-medium">Reviewed by:</span> {pharmacist?.fullName || "Unknown"}
                            </p>
                            <p className="text-foreground">{prescription.pharmacistNotes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
