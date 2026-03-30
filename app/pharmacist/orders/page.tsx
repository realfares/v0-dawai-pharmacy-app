import { redirect } from "next/navigation"
import { getCurrentUser } from "@/app/actions/auth"
import { PharmacistNav } from "@/components/pharmacist-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getAllOrdersForPharmacist, updateOrderStatusAction } from "@/app/actions/pharmacist"
import { db } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Package, CheckCircle, Clock, XCircle, Truck } from "lucide-react"

export default async function PharmacistOrdersPage() {
  const user = await getCurrentUser()

  if (!user || user.role !== "Pharmacist") {
    redirect("/login")
  }

  const orders = await getAllOrdersForPharmacist()

  return (
    <div className="min-h-screen bg-background">
      <PharmacistNav userName={user.fullName} />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Order Management</h1>
          <p className="text-muted-foreground">Process and track customer orders</p>
        </div>

        {orders.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No orders yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const customer = db.findUserById(order.customerId)
              return (
                <Card key={order.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          Order #{order.id.slice(-8)}
                          {order.status === "Completed" ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : order.status === "Cancelled" ? (
                            <XCircle className="h-5 w-5 text-red-500" />
                          ) : order.status === "Processing" ? (
                            <Truck className="h-5 w-5 text-blue-500" />
                          ) : (
                            <Clock className="h-5 w-5 text-yellow-500" />
                          )}
                        </CardTitle>
                        <CardDescription>
                          <span className="font-medium">{customer?.fullName || "Unknown Customer"}</span> •{" "}
                          {new Date(order.orderDate).toLocaleString()}
                        </CardDescription>
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
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">Order Items:</p>
                          {order.items.map((item, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                              <div>
                                <p className="font-medium text-sm text-foreground">{item.medicineName}</p>
                                <p className="text-xs text-muted-foreground">Quantity: {item.quantity}</p>
                              </div>
                              <p className="font-semibold text-sm text-foreground">
                                ${(item.price * item.quantity).toFixed(2)}
                              </p>
                            </div>
                          ))}
                        </div>
                        <div className="pt-2 border-t">
                          <div className="flex justify-between items-center">
                            <span className="font-semibold text-foreground">Total Amount:</span>
                            <span className="text-xl font-bold text-foreground">${order.totalAmount.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Customer Contact:</p>
                          <p className="text-sm font-medium text-foreground">{customer?.phone || "N/A"}</p>
                          <p className="text-sm text-foreground">{customer?.email || "N/A"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Delivery Address:</p>
                          <p className="text-sm font-medium text-foreground">{order.deliveryAddress}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Payment Method:</p>
                          <p className="text-sm font-medium text-foreground">{order.paymentMethod}</p>
                        </div>
                        {order.status !== "Completed" && order.status !== "Cancelled" && (
                          <form action={updateOrderStatusAction} className="space-y-2 pt-2">
                            <input type="hidden" name="orderId" value={order.id} />
                            <p className="text-sm font-medium text-foreground">Update Status:</p>
                            <div className="flex gap-2">
                              {order.status === "Pending" && (
                                <Button type="submit" name="status" value="Processing" size="sm" className="flex-1">
                                  <Truck className="h-4 w-4 mr-1" />
                                  Process
                                </Button>
                              )}
                              {(order.status === "Pending" || order.status === "Processing") && (
                                <Button
                                  type="submit"
                                  name="status"
                                  value="Completed"
                                  size="sm"
                                  className="flex-1 bg-green-600 hover:bg-green-700"
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Complete
                                </Button>
                              )}
                              <Button
                                type="submit"
                                name="status"
                                value="Cancelled"
                                size="sm"
                                variant="destructive"
                                className="flex-1"
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Cancel
                              </Button>
                            </div>
                          </form>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
