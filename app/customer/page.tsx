import { redirect } from "next/navigation"
import { getCurrentUser } from "@/app/actions/auth"
import { CustomerNav } from "@/components/customer-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getCustomerPrescriptions, getCustomerOrders } from "@/app/actions/customer"
import { db } from "@/lib/db"
import { Upload, ShoppingBag, Pill, CheckCircle, Clock, XCircle, Package } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function CustomerDashboard() {
  const user = await getCurrentUser()

  if (!user || user.role !== "Customer") {
    redirect("/login")
  }

  const prescriptions = await getCustomerPrescriptions()
  const orders = await getCustomerOrders()
  const medicines = db.getAllMedicines()

  const pendingPrescriptions = prescriptions.filter((p) => p.status === "Pending").length
  const activeOrders = orders.filter((o) => o.status === "Processing" || o.status === "Pending").length

  return (
    <div className="min-h-screen bg-background">
      <CustomerNav userName={user.fullName} />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back, {user.fullName}</h1>
          <p className="text-muted-foreground">Manage your prescriptions and orders from your dashboard</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Prescriptions</CardTitle>
              <Upload className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{prescriptions.length}</div>
              <p className="text-xs text-muted-foreground">{pendingPrescriptions} pending review</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Orders</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{activeOrders}</div>
              <p className="text-xs text-muted-foreground">Currently processing</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{orders.length}</div>
              <p className="text-xs text-muted-foreground">All time orders</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Available Medicines</CardTitle>
              <Pill className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{medicines.length}</div>
              <p className="text-xs text-muted-foreground">In stock medicines</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Prescriptions */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Prescriptions</CardTitle>
              <CardDescription>Your uploaded prescription status</CardDescription>
            </CardHeader>
            <CardContent>
              {prescriptions.length === 0 ? (
                <div className="text-center py-8">
                  <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">No prescriptions uploaded yet</p>
                  <Button asChild>
                    <Link href="/customer/prescriptions">Upload Prescription</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {prescriptions.slice(0, 3).map((prescription) => (
                    <div key={prescription.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-2 w-2 rounded-full ${
                            prescription.status === "Approved"
                              ? "bg-green-500"
                              : prescription.status === "Rejected"
                                ? "bg-red-500"
                                : "bg-yellow-500"
                          }`}
                        />
                        <div>
                          <p className="text-sm font-medium">Prescription #{prescription.id.slice(-6)}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(prescription.uploadDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
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
                  ))}
                  <Button variant="outline" className="w-full bg-transparent" asChild>
                    <Link href="/customer/prescriptions">View All</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Track your medication orders</CardDescription>
            </CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">No orders placed yet</p>
                  <Button asChild>
                    <Link href="/customer/medicines">Browse Medicines</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.slice(0, 3).map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {order.status === "Completed" ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : order.status === "Cancelled" ? (
                          <XCircle className="h-5 w-5 text-red-500" />
                        ) : (
                          <Clock className="h-5 w-5 text-yellow-500" />
                        )}
                        <div>
                          <p className="text-sm font-medium">Order #{order.id.slice(-6)}</p>
                          <p className="text-xs text-muted-foreground">${order.totalAmount.toFixed(2)}</p>
                        </div>
                      </div>
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded ${
                          order.status === "Completed"
                            ? "bg-green-100 text-green-700"
                            : order.status === "Cancelled"
                              ? "bg-red-100 text-red-700"
                              : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full bg-transparent" asChild>
                    <Link href="/customer/orders">View All</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
