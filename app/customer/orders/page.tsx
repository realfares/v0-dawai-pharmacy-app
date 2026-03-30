import { redirect } from "next/navigation"
import { getCurrentUser } from "@/app/actions/auth"
import { CustomerNav } from "@/components/customer-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getCustomerOrders } from "@/app/actions/customer"
import { Package, CheckCircle, Clock, XCircle, Truck } from "lucide-react"

export default async function OrdersPage() {
  const user = await getCurrentUser()

  if (!user || user.role !== "Customer") {
    redirect("/login")
  }

  const orders = await getCustomerOrders()

  return (
    <div className="min-h-screen bg-background">
      <CustomerNav userName={user.fullName} />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">My Orders</h1>
          <p className="text-muted-foreground">Track and manage your medication orders</p>
        </div>

        {orders.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No orders placed yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
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
                      <CardDescription>Placed on {new Date(order.orderDate).toLocaleDateString()}</CardDescription>
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
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm text-foreground">Order Items:</h4>
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div>
                          <p className="font-medium text-foreground">{item.medicineName}</p>
                          <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                        </div>
                        <p className="font-semibold text-foreground">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Delivery Address:</p>
                      <p className="text-sm font-medium text-foreground">{order.deliveryAddress}</p>
                      <p className="text-sm text-muted-foreground">Payment: {order.paymentMethod}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Total Amount</p>
                      <p className="text-2xl font-bold text-foreground">${order.totalAmount.toFixed(2)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
