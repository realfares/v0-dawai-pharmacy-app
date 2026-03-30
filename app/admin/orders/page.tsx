import { redirect } from "next/navigation"
import { getCurrentUser } from "@/app/actions/auth"
import { AdminNav } from "@/components/admin-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getAllOrdersForAdmin } from "@/app/actions/admin"
import { db } from "@/lib/db"
import { ShoppingBag, CheckCircle, Clock, XCircle, Truck } from "lucide-react"

export default async function AdminOrdersPage() {
  const user = await getCurrentUser()

  if (!user || user.role !== "Admin") {
    redirect("/login")
  }

  const orders = await getAllOrdersForAdmin()

  return (
    <div className="min-h-screen bg-background">
      <AdminNav userName={user.fullName} />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Order Management</h1>
          <p className="text-muted-foreground">View and monitor all customer orders</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              All Orders ({orders.length})
            </CardTitle>
            <CardDescription>Complete order history</CardDescription>
          </CardHeader>
          <CardContent>
            {orders.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No orders yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => {
                  const customer = db.findUserById(order.customerId)
                  return (
                    <div key={order.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-foreground">Order #{order.id.slice(-8)}</h3>
                            {order.status === "Completed" ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : order.status === "Cancelled" ? (
                              <XCircle className="h-4 w-4 text-red-500" />
                            ) : order.status === "Processing" ? (
                              <Truck className="h-4 w-4 text-blue-500" />
                            ) : (
                              <Clock className="h-4 w-4 text-yellow-500" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Customer: {customer?.fullName || "Unknown"} • {new Date(order.orderDate).toLocaleString()}
                          </p>
                        </div>
                        <span
                          className={`text-sm font-medium px-3 py-1 rounded-full ${
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
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-foreground mb-2">Order Items:</p>
                          <div className="space-y-1">
                            {order.items.map((item, index) => (
                              <div key={index} className="flex justify-between text-sm p-2 bg-muted rounded">
                                <span className="text-foreground">
                                  {item.medicineName} x {item.quantity}
                                </span>
                                <span className="font-medium text-foreground">
                                  ${(item.price * item.quantity).toFixed(2)}
                                </span>
                              </div>
                            ))}
                          </div>
                          <div className="mt-2 pt-2 border-t flex justify-between">
                            <span className="font-semibold text-foreground">Total:</span>
                            <span className="text-lg font-bold text-foreground">${order.totalAmount.toFixed(2)}</span>
                          </div>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div>
                            <p className="text-muted-foreground">Customer Contact:</p>
                            <p className="text-foreground">{customer?.phone || "N/A"}</p>
                            <p className="text-foreground">{customer?.email || "N/A"}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Delivery Address:</p>
                            <p className="text-foreground">{order.deliveryAddress}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Payment Method:</p>
                            <p className="text-foreground">{order.paymentMethod}</p>
                          </div>
                        </div>
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
