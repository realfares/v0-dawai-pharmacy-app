import { redirect } from "next/navigation"
import { getCurrentUser } from "@/app/actions/auth"
import { CustomerNav } from "@/components/customer-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { db } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createOrder } from "@/app/actions/customer"
import { Pill, Package } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default async function MedicinesPage() {
  const user = await getCurrentUser()

  if (!user || user.role !== "Customer") {
    redirect("/login")
  }

  const medicines = db.getAllMedicines()

  return (
    <div className="min-h-screen bg-background">
      <CustomerNav userName={user.fullName} />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Browse Medicines</h1>
          <p className="text-muted-foreground">View available medications and place orders</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {medicines.map((medicine) => (
            <Card key={medicine.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Pill className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{medicine.name}</CardTitle>
                      <CardDescription className="text-xs">{medicine.category}</CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{medicine.description}</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Manufacturer:</span>
                    <span className="font-medium text-foreground">{medicine.manufacturer}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Stock:</span>
                    <span
                      className={`font-medium ${medicine.stockQuantity > 10 ? "text-green-600" : "text-yellow-600"}`}
                    >
                      {medicine.stockQuantity} available
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className="text-2xl font-bold text-foreground">${medicine.price.toFixed(2)}</span>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" disabled={medicine.stockQuantity === 0}>
                          <Package className="h-4 w-4 mr-2" />
                          Order
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Order {medicine.name}</DialogTitle>
                          <DialogDescription>Fill in the details to place your order</DialogDescription>
                        </DialogHeader>
                        <form action={createOrder} className="space-y-4">
                          <input type="hidden" name="medicineId" value={medicine.id} />
                          <div className="space-y-2">
                            <Label htmlFor="quantity">Quantity</Label>
                            <Input
                              id="quantity"
                              name="quantity"
                              type="number"
                              min="1"
                              max={medicine.stockQuantity}
                              defaultValue="1"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="deliveryAddress">Delivery Address</Label>
                            <Input
                              id="deliveryAddress"
                              name="deliveryAddress"
                              type="text"
                              defaultValue={user.address}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="paymentMethod">Payment Method</Label>
                            <select
                              id="paymentMethod"
                              name="paymentMethod"
                              className="w-full h-10 px-3 rounded-md border border-input bg-background"
                              required
                            >
                              <option value="Credit Card">Credit Card</option>
                              <option value="Cash on Delivery">Cash on Delivery</option>
                              <option value="Online Banking">Online Banking</option>
                            </select>
                          </div>
                          <Button type="submit" className="w-full">
                            Place Order
                          </Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
