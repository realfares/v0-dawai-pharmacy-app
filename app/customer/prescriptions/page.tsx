import { redirect } from "next/navigation"
import { getCurrentUser } from "@/app/actions/auth"
import { CustomerNav } from "@/components/customer-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getCustomerPrescriptions, uploadPrescription } from "@/app/actions/customer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, FileText } from "lucide-react"
import Image from "next/image"

export default async function PrescriptionsPage() {
  const user = await getCurrentUser()

  if (!user || user.role !== "Customer") {
    redirect("/login")
  }

  const prescriptions = await getCustomerPrescriptions()

  return (
    <div className="min-h-screen bg-background">
      <CustomerNav userName={user.fullName} />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">My Prescriptions</h1>
          <p className="text-muted-foreground">Upload and manage your medical prescriptions</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Upload Form */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload Prescription
              </CardTitle>
              <CardDescription>Upload a clear image of your prescription</CardDescription>
            </CardHeader>
            <CardContent>
              <form action={uploadPrescription} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="prescription">Prescription Image</Label>
                  <Input
                    id="prescription"
                    name="prescription"
                    type="file"
                    accept="image/*"
                    required
                    className="cursor-pointer"
                  />
                  <p className="text-xs text-muted-foreground">Accepted formats: JPG, PNG, PDF (Max 5MB)</p>
                </div>
                <Button type="submit" className="w-full">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Prescription
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Prescriptions List */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Uploaded Prescriptions</CardTitle>
              <CardDescription>View status and details of your prescriptions</CardDescription>
            </CardHeader>
            <CardContent>
              {prescriptions.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No prescriptions uploaded yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {prescriptions.map((prescription) => (
                    <div key={prescription.id} className="border rounded-lg p-4">
                      <div className="flex items-start gap-4">
                        <div className="relative h-24 w-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                          <Image
                            src={prescription.imageUrl || "/placeholder.svg"}
                            alt="Prescription"
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-foreground">
                                Prescription #{prescription.id.slice(-8)}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                Uploaded on {new Date(prescription.uploadDate).toLocaleDateString()}
                              </p>
                            </div>
                            <span
                              className={`text-xs font-medium px-3 py-1 rounded-full ${
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
                          {prescription.pharmacistNotes && (
                            <div className="mt-3 p-3 bg-muted rounded-lg">
                              <p className="text-sm font-medium text-foreground mb-1">Pharmacist Notes:</p>
                              <p className="text-sm text-muted-foreground">{prescription.pharmacistNotes}</p>
                              {prescription.reviewDate && (
                                <p className="text-xs text-muted-foreground mt-2">
                                  Reviewed on {new Date(prescription.reviewDate).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
