import { redirect } from "next/navigation"
import { getCurrentUser } from "@/app/actions/auth"
import { AdminNav } from "@/components/admin-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getAllPrescriptionsForAdmin } from "@/app/actions/admin"
import { db } from "@/lib/db"
import { FileCheck } from "lucide-react"

export default async function AdminPrescriptionsPage() {
  const user = await getCurrentUser()

  if (!user || user.role !== "Admin") {
    redirect("/login")
  }

  const prescriptions = await getAllPrescriptionsForAdmin()

  return (
    <div className="min-h-screen bg-background">
      <AdminNav userName={user.fullName} />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Prescription Management</h1>
          <p className="text-muted-foreground">View all prescription submissions and reviews</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileCheck className="h-5 w-5" />
              All Prescriptions ({prescriptions.length})
            </CardTitle>
            <CardDescription>Complete prescription history</CardDescription>
          </CardHeader>
          <CardContent>
            {prescriptions.length === 0 ? (
              <div className="text-center py-12">
                <FileCheck className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No prescriptions yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {prescriptions.map((prescription) => {
                  const customer = db.findUserById(prescription.customerId)
                  const pharmacist = prescription.pharmacistId ? db.findUserById(prescription.pharmacistId) : null
                  return (
                    <div key={prescription.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-foreground">Prescription #{prescription.id.slice(-8)}</h3>
                          <p className="text-sm text-muted-foreground">
                            Customer: {customer?.fullName || "Unknown"} •{" "}
                            {new Date(prescription.uploadDate).toLocaleString()}
                          </p>
                        </div>
                        <span
                          className={`text-sm font-medium px-3 py-1 rounded-full ${
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
                        <div className="p-3 bg-muted rounded-lg">
                          <p className="text-sm font-medium text-foreground mb-1">
                            Reviewed by: {pharmacist?.fullName || "Unknown Pharmacist"}
                          </p>
                          <p className="text-sm text-muted-foreground mb-1">
                            Date: {prescription.reviewDate && new Date(prescription.reviewDate).toLocaleString()}
                          </p>
                          <p className="text-sm text-foreground">Notes: {prescription.pharmacistNotes}</p>
                        </div>
                      )}
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
