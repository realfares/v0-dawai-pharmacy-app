import { redirect } from "next/navigation"
import { getCurrentUser } from "@/app/actions/auth"
import { AdminNav } from "@/components/admin-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getAllUsers, getAllMedicines, getAllOrdersForAdmin, getAllPrescriptionsForAdmin } from "@/app/actions/admin"
import { Users, Pill, ShoppingBag, FileCheck, TrendingUp, AlertCircle, DollarSign } from "lucide-react"

export default async function AdminDashboard() {
  const user = await getCurrentUser()

  if (!user || user.role !== "Admin") {
    redirect("/login")
  }

  const allUsers = await getAllUsers()
  const medicines = await getAllMedicines()
  const orders = await getAllOrdersForAdmin()
  const prescriptions = await getAllPrescriptionsForAdmin()

  const totalRevenue = orders.filter((o) => o.status === "Completed").reduce((sum, order) => sum + order.totalAmount, 0)

  const pendingOrders = orders.filter((o) => o.status === "Pending" || o.status === "Processing").length
  const lowStockMedicines = medicines.filter((m) => m.stockQuantity < 20).length
  const pendingPrescriptions = prescriptions.filter((p) => p.status === "Pending").length

  const customers = allUsers.filter((u) => u.role === "Customer").length
  const pharmacists = allUsers.filter((u) => u.role === "Pharmacist").length

  return (
    <div className="min-h-screen bg-background">
      <AdminNav userName={user.fullName} />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Complete overview of Dawai pharmacy system</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{allUsers.length}</div>
              <p className="text-xs text-muted-foreground">
                {customers} customers • {pharmacists} pharmacists
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">${totalRevenue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">From completed orders</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Orders</CardTitle>
              <ShoppingBag className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{pendingOrders}</div>
              <p className="text-xs text-muted-foreground">Pending/Processing</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Medicines</CardTitle>
              <Pill className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{medicines.length}</div>
              <p className="text-xs text-muted-foreground">{lowStockMedicines} low stock items</p>
            </CardContent>
          </Card>
        </div>

        {/* Alerts and Quick Stats */}
        <div className="grid gap-6 lg:grid-cols-2 mb-8">
          {/* System Alerts */}
          <Card className={lowStockMedicines > 0 || pendingPrescriptions > 0 ? "border-yellow-200 bg-yellow-50" : ""}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-700">
                <AlertCircle className="h-5 w-5" />
                System Alerts
              </CardTitle>
              <CardDescription className="text-yellow-600">Items requiring attention</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {lowStockMedicines > 0 && (
                <div className="p-3 bg-white rounded-lg">
                  <p className="font-medium text-foreground">{lowStockMedicines} Low Stock Medicines</p>
                  <p className="text-sm text-muted-foreground">Immediate restocking required</p>
                </div>
              )}
              {pendingPrescriptions > 0 && (
                <div className="p-3 bg-white rounded-lg">
                  <p className="font-medium text-foreground">{pendingPrescriptions} Pending Prescriptions</p>
                  <p className="text-sm text-muted-foreground">Awaiting pharmacist review</p>
                </div>
              )}
              {pendingOrders > 0 && (
                <div className="p-3 bg-white rounded-lg">
                  <p className="font-medium text-foreground">{pendingOrders} Active Orders</p>
                  <p className="text-sm text-muted-foreground">In progress or pending</p>
                </div>
              )}
              {lowStockMedicines === 0 && pendingPrescriptions === 0 && pendingOrders === 0 && (
                <div className="text-center py-4">
                  <p className="text-muted-foreground">All systems running smoothly</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                System Statistics
              </CardTitle>
              <CardDescription>Overview of system usage</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <FileCheck className="h-5 w-5 text-primary" />
                  <span className="font-medium text-foreground">Total Prescriptions</span>
                </div>
                <span className="text-xl font-bold text-foreground">{prescriptions.length}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <ShoppingBag className="h-5 w-5 text-secondary" />
                  <span className="font-medium text-foreground">Total Orders</span>
                </div>
                <span className="text-xl font-bold text-foreground">{orders.length}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <Pill className="h-5 w-5 text-accent" />
                  <span className="font-medium text-foreground">Medicine Inventory</span>
                </div>
                <span className="text-xl font-bold text-foreground">
                  {medicines.reduce((sum, m) => sum + m.stockQuantity, 0)} units
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Status Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Order Status Breakdown</CardTitle>
            <CardDescription>Current order distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 border rounded-lg text-center">
                <p className="text-2xl font-bold text-yellow-600">
                  {orders.filter((o) => o.status === "Pending").length}
                </p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
              <div className="p-4 border rounded-lg text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {orders.filter((o) => o.status === "Processing").length}
                </p>
                <p className="text-sm text-muted-foreground">Processing</p>
              </div>
              <div className="p-4 border rounded-lg text-center">
                <p className="text-2xl font-bold text-green-600">
                  {orders.filter((o) => o.status === "Completed").length}
                </p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
              <div className="p-4 border rounded-lg text-center">
                <p className="text-2xl font-bold text-red-600">
                  {orders.filter((o) => o.status === "Cancelled").length}
                </p>
                <p className="text-sm text-muted-foreground">Cancelled</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
