import { redirect } from "next/navigation"
import { getCurrentUser } from "@/app/actions/auth"
import { AdminNav } from "@/components/admin-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getAllMedicines, createMedicine, updateMedicine } from "@/app/actions/admin"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Pill, Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default async function AdminMedicinesPage() {
  const user = await getCurrentUser()

  if (!user || user.role !== "Admin") {
    redirect("/login")
  }

  const medicines = await getAllMedicines()

  return (
    <div className="min-h-screen bg-background">
      <AdminNav userName={user.fullName} />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Medicine Inventory</h1>
            <p className="text-muted-foreground">Manage medicine stock and pricing</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Medicine
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Medicine</DialogTitle>
                <DialogDescription>Add a new medicine to the inventory</DialogDescription>
              </DialogHeader>
              <form action={createMedicine} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Medicine Name</Label>
                  <Input id="name" name="name" placeholder="e.g., Paracetamol 500mg" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input id="category" name="category" placeholder="e.g., Pain Relief" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="manufacturer">Manufacturer</Label>
                  <Input id="manufacturer" name="manufacturer" placeholder="e.g., PharmaCorp" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price ($)</Label>
                    <Input id="price" name="price" type="number" step="0.01" min="0" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stockQuantity">Stock Quantity</Label>
                    <Input id="stockQuantity" name="stockQuantity" type="number" min="0" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" name="description" placeholder="Medicine description..." required />
                </div>
                <Button type="submit" className="w-full">
                  Add Medicine
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Pill className="h-5 w-5" />
              All Medicines ({medicines.length})
            </CardTitle>
            <CardDescription>Complete medicine inventory</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {medicines.map((medicine) => (
                <div key={medicine.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-foreground">{medicine.name}</h3>
                      <p className="text-sm text-muted-foreground">{medicine.category}</p>
                    </div>
                    <span
                      className={`text-xs font-medium px-3 py-1 rounded-full ${
                        medicine.stockQuantity < 20
                          ? "bg-red-100 text-red-700"
                          : medicine.stockQuantity < 50
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"
                      }`}
                    >
                      {medicine.stockQuantity} in stock
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{medicine.description}</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Manufacturer</p>
                      <p className="text-sm font-medium text-foreground">{medicine.manufacturer}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Price</p>
                      <p className="text-sm font-medium text-foreground">${medicine.price.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Stock</p>
                      <p className="text-sm font-medium text-foreground">{medicine.stockQuantity} units</p>
                    </div>
                    <div className="flex items-end">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline" className="w-full bg-transparent">
                            Update Stock
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Update {medicine.name}</DialogTitle>
                            <DialogDescription>Update stock quantity and price</DialogDescription>
                          </DialogHeader>
                          <form action={updateMedicine} className="space-y-4">
                            <input type="hidden" name="medicineId" value={medicine.id} />
                            <div className="space-y-2">
                              <Label htmlFor={`stock-${medicine.id}`}>Stock Quantity</Label>
                              <Input
                                id={`stock-${medicine.id}`}
                                name="stockQuantity"
                                type="number"
                                min="0"
                                defaultValue={medicine.stockQuantity}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor={`price-${medicine.id}`}>Price ($)</Label>
                              <Input
                                id={`price-${medicine.id}`}
                                name="price"
                                type="number"
                                step="0.01"
                                min="0"
                                defaultValue={medicine.price}
                                required
                              />
                            </div>
                            <Button type="submit" className="w-full">
                              Update Medicine
                            </Button>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
