import { redirect } from "next/navigation"
import { getCurrentUser } from "@/app/actions/auth"
import { PharmacistNav } from "@/components/pharmacist-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getPendingPrescriptions, getAllOrdersForPharmacist } from "@/app/actions/pharmacist"
import { db } from "@/lib/db"
import { FileCheck, Clock, CheckCircle, XCircle, Package, AlertCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function PharmacistDashboard() {
  const user = await getCurrentUser()

  if (!user || user.role !== "Pharmacist") {
    redirect("/login")
  }

  const pendingPrescriptions = await getPendingPrescriptions()
  const allOrders = await getAllOrdersForPharmacist()
  const medicines = db.getAllMedicines()

  const pendingOrders = allOrders.filter((o) => o.status === "Pending").length
  const processingOrders = allOrders.filter((o) => o.status === "Processing").length
  const lowStockMedicines = medicines.filter((m) => m.stockQuantity < 20).length

  return (
    <div className="min-h-screen bg-background">
      <PharmacistNav userName={user.fullName} />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Pharmacist Dashboard</h1>
          <p className="text-muted-foreground">Manage prescriptions, orders, and inventory</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending Prescriptions</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{pendingPrescriptions.length}</div>
              <p className="text-xs text-muted-foreground">Awaiting review</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending Orders</CardTitle>
              <Package className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{pendingOrders}</div>
              <p className="text-xs text-muted-foreground">Need processing</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Processing Orders</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{processingOrders}</div>
              <p className="text-xs text-muted-foreground">In progress</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Low Stock Alert</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{lowStockMedicines}</div>
              <p className="text-xs text-muted-foreground">Below 20 units</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Pending Prescriptions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCheck className="h-5 w-5" />
                Pending Prescriptions
              </CardTitle>
              <CardDescription>Prescriptions requiring your review</CardDescription>
            </CardHeader>
            <CardContent>
              {pendingPrescriptions.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <p className="text-muted-foreground">All prescriptions reviewed</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingPrescriptions.slice(0, 3).map((prescription) => {
                    const customer = db.findUserById(prescription.customerId)
                    return (
                      <div key={prescription.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Clock className="h-5 w-5 text-yellow-500" />
                          <div>
                            <p className="text-sm font-medium">Prescription #{prescription.id.slice(-6)}</p>
                            <p className="text-xs text-muted-foreground">
                              From: {customer?.fullName || "Unknown"} •{" "}
                              {new Date(prescription.uploadDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Button size="sm" variant="secondary" asChild>
                          <Link href="/pharmacist/prescriptions">Review</Link>
                        </Button>
                      </div>
                    )
                  })}
                  {pendingPrescriptions.length > 3 && (
                    <Button variant="outline" className="w-full bg-transparent" asChild>
                      <Link href="/pharmacist/prescriptions">View All ({pendingPrescriptions.length})</Link>
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Recent Orders
              </CardTitle>
              <CardDescription>Latest customer orders</CardDescription>
            </CardHeader>
            <CardContent>
              {allOrders.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No orders yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {allOrders.slice(0, 3).map((order) => {
                    const customer = db.findUserById(order.customerId)
                    return (
                      <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          {order.status === "Completed" ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : order.status === "Cancelled" ? (
                            <XCircle className="h-5 w-5 text-red-500" />
                          ) : order.status === "Processing" ? (
                            <Package className="h-5 w-5 text-blue-500" />
                          ) : (
                            <Clock className="h-5 w-5 text-yellow-500" />
                          )}
                          <div>
                            <p className="text-sm font-medium">Order #{order.id.slice(-6)}</p>
                            <p className="text-xs text-muted-foreground">
                              {customer?.fullName || "Unknown"} • ${order.totalAmount.toFixed(2)}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`text-xs font-medium px-2 py-1 rounded ${
                            order.status === "Completed"
                              ? "bg-green-100 text-green-700"
                              : order.status === "Cancelled"
                                ? "bg-red-100 text-red-700"
                                : order.status === "Processing"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                    )
                  })}
                  <Button variant="outline" className="w-full bg-transparent" asChild>
                    <Link href="/pharmacist/orders">View All Orders</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Low Stock Alert */}
        {lowStockMedicines > 0 && (
          <Card className="mt-6 border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-700">
                <AlertCircle className="h-5 w-5" />
                Low Stock Alert
              </CardTitle>
              <CardDescription className="text-red-600">
                {lowStockMedicines} medicine(s) have low stock levels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {medicines
                  .filter((m) => m.stockQuantity < 20)
                  .slice(0, 3)
                  .map((medicine) => (
                    <div key={medicine.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <div>
                        <p className="font-medium text-foreground">{medicine.name}</p>
                        <p className="text-sm text-muted-foreground">{medicine.category}</p>
                      </div>
                      <span className="text-sm font-semibold text-red-600">{medicine.stockQuantity} units left</span>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
