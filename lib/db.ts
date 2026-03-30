// In-memory database for pharmacy delivery platform

export interface User {
  id: string
  email: string
  password: string
  name: string
  phone: string
  address: string
  createdAt: Date
}

export interface Pharmacy {
  id: string
  name: string
  description: string
  address: string
  latitude: number
  longitude: number
  rating: number
  deliveryTime: string
  deliveryFee: number
  minimumOrder: number
  imageUrl: string
  isOpen: boolean
  categories: string[]
}

export interface Product {
  id: string
  pharmacyId: string
  name: string
  description: string
  category: string
  price: number
  imageUrl: string
  inStock: boolean
  requiresPrescription: boolean
}

export interface CartItem {
  productId: string
  pharmacyId: string
  quantity: number
}

export interface Order {
  id: string
  userId: string
  pharmacyId: string
  items: OrderItem[]
  totalAmount: number
  deliveryFee: number
  deliveryAddress: string
  status: "pending" | "confirmed" | "preparing" | "out_for_delivery" | "delivered" | "cancelled"
  createdAt: Date
  estimatedDelivery?: Date
}

export interface OrderItem {
  productId: string
  productName: string
  quantity: number
  price: number
}

class Database {
  users: User[] = []
  pharmacies: Pharmacy[] = []
  products: Product[] = []
  carts: Map<string, CartItem[]> = new Map()
  orders: Order[] = []

  constructor() {
    this.seedData()
  }

  private seedData() {
    // Seed users
    this.users = [
      {
        id: "u1",
        email: "demo@example.com",
        password: "demo123",
        name: "Demo User",
        phone: "+1234567890",
        address: "123 Main Street, Downtown",
        createdAt: new Date(),
      },
    ]

    // Seed pharmacies
    this.pharmacies = [
      {
        id: "ph1",
        name: "HealthPlus Pharmacy",
        description: "Your trusted neighborhood pharmacy with 24/7 service",
        address: "456 Health Ave, Medical District",
        latitude: 40.7128,
        longitude: -74.006,
        rating: 4.8,
        deliveryTime: "20-30 min",
        deliveryFee: 2.99,
        minimumOrder: 10,
        imageUrl: "/modern-pharmacy-storefront.png",
        isOpen: true,
        categories: ["Medicines", "Health & Wellness", "Personal Care"],
      },
      {
        id: "ph2",
        name: "MediCare Express",
        description: "Fast delivery of medicines and health products",
        address: "789 Wellness Road, City Center",
        latitude: 40.7282,
        longitude: -73.9942,
        rating: 4.6,
        deliveryTime: "15-25 min",
        deliveryFee: 1.99,
        minimumOrder: 15,
        imageUrl: "/pharmacy-store-exterior.jpg",
        isOpen: true,
        categories: ["Medicines", "Vitamins", "First Aid"],
      },
      {
        id: "ph3",
        name: "Green Cross Pharmacy",
        description: "Organic and natural health products specialist",
        address: "321 Natural Way, Green District",
        latitude: 40.7489,
        longitude: -73.9681,
        rating: 4.9,
        deliveryTime: "25-35 min",
        deliveryFee: 3.49,
        minimumOrder: 20,
        imageUrl: "/green-organic-pharmacy.jpg",
        isOpen: true,
        categories: ["Organic", "Supplements", "Natural Remedies"],
      },
      {
        id: "ph4",
        name: "QuickMeds 24/7",
        description: "Always open for your emergency medicine needs",
        address: "555 Emergency Lane, North Side",
        latitude: 40.7614,
        longitude: -73.9776,
        rating: 4.5,
        deliveryTime: "10-20 min",
        deliveryFee: 4.99,
        minimumOrder: 0,
        imageUrl: "/24-hour-pharmacy.jpg",
        isOpen: true,
        categories: ["Emergency", "Medicines", "Medical Supplies"],
      },
    ]

    // Seed products
    this.products = [
      {
        id: "p1",
        pharmacyId: "ph1",
        name: "Paracetamol 500mg",
        description: "Effective pain relief and fever reducer. Pack of 24 tablets.",
        category: "Pain Relief",
        price: 5.99,
        imageUrl: "/paracetamol-tablets-box.jpg",
        inStock: true,
        requiresPrescription: false,
      },
      {
        id: "p2",
        pharmacyId: "ph1",
        name: "Vitamin D3 1000IU",
        description: "Daily vitamin D supplement for bone health. 60 capsules.",
        category: "Vitamins",
        price: 12.99,
        imageUrl: "/vitamin-d-bottle.jpg",
        inStock: true,
        requiresPrescription: false,
      },
      {
        id: "p3",
        pharmacyId: "ph1",
        name: "Ibuprofen 400mg",
        description: "Anti-inflammatory pain relief. Pack of 20 tablets.",
        category: "Pain Relief",
        price: 7.49,
        imageUrl: "/ibuprofen-tablets.png",
        inStock: true,
        requiresPrescription: false,
      },
      {
        id: "p4",
        pharmacyId: "ph2",
        name: "Amoxicillin 500mg",
        description: "Antibiotic for bacterial infections. Prescription required.",
        category: "Antibiotics",
        price: 18.99,
        imageUrl: "/antibiotic-medicine-box.jpg",
        inStock: true,
        requiresPrescription: true,
      },
      {
        id: "p5",
        pharmacyId: "ph2",
        name: "First Aid Kit",
        description: "Complete emergency first aid kit with bandages and supplies.",
        category: "First Aid",
        price: 24.99,
        imageUrl: "/first-aid-kit.png",
        inStock: true,
        requiresPrescription: false,
      },
      {
        id: "p6",
        pharmacyId: "ph3",
        name: "Organic Multivitamin",
        description: "Plant-based multivitamin with essential nutrients. 30 capsules.",
        category: "Supplements",
        price: 19.99,
        imageUrl: "/organic-multivitamin-bottle.jpg",
        inStock: true,
        requiresPrescription: false,
      },
    ]
  }

  // User methods
  findUserByEmail(email: string): User | undefined {
    return this.users.find((u) => u.email === email)
  }

  findUserById(id: string): User | undefined {
    return this.users.find((u) => u.id === id)
  }

  createUser(user: Omit<User, "id" | "createdAt">): User {
    const newUser: User = {
      ...user,
      id: `u${Date.now()}`,
      createdAt: new Date(),
    }
    this.users.push(newUser)
    return newUser
  }

  // Pharmacy methods
  getAllPharmacies(): Pharmacy[] {
    return this.pharmacies
  }

  getPharmacyById(id: string): Pharmacy | undefined {
    return this.pharmacies.find((p) => p.id === id)
  }

  // Product methods
  getProductsByPharmacy(pharmacyId: string): Product[] {
    return this.products.filter((p) => p.pharmacyId === pharmacyId)
  }

  getProductById(id: string): Product | undefined {
    return this.products.find((p) => p.id === id)
  }

  // Cart methods
  getCart(userId: string): CartItem[] {
    return this.carts.get(userId) || []
  }

  addToCart(userId: string, item: CartItem): void {
    const cart = this.getCart(userId)
    const existingItem = cart.find((i) => i.productId === item.productId)

    if (existingItem) {
      existingItem.quantity += item.quantity
    } else {
      cart.push(item)
    }

    this.carts.set(userId, cart)
  }

  updateCartItemQuantity(userId: string, productId: string, quantity: number): void {
    const cart = this.getCart(userId)
    const item = cart.find((i) => i.productId === productId)

    if (item) {
      if (quantity <= 0) {
        this.carts.set(
          userId,
          cart.filter((i) => i.productId !== productId),
        )
      } else {
        item.quantity = quantity
        this.carts.set(userId, cart)
      }
    }
  }

  clearCart(userId: string): void {
    this.carts.delete(userId)
  }

  // Order methods
  createOrder(order: Omit<Order, "id" | "createdAt">): Order {
    const newOrder: Order = {
      ...order,
      id: `o${Date.now()}`,
      createdAt: new Date(),
    }
    this.orders.push(newOrder)
    return newOrder
  }

  getOrdersByUser(userId: string): Order[] {
    return this.orders.filter((o) => o.userId === userId).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  getOrderById(id: string): Order | undefined {
    return this.orders.find((o) => o.id === id)
  }

  updateOrderStatus(id: string, status: Order["status"]): Order | undefined {
    const order = this.orders.find((o) => o.id === id)
    if (order) {
      order.status = status
      return order
    }
    return undefined
  }
}

export const db = new Database()
