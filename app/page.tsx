import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Pill, Clock, ShieldCheck, MapPin } from "lucide-react"
import { getCurrentUser } from "./actions/auth"
import { redirect } from "next/navigation"

export default async function HomePage() {
  const user = await getCurrentUser()

  if (user) {
    redirect("/pharmacies")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
              <Pill className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground">PharmaDash</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Sign Up</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground text-balance leading-tight">
            Medicines Delivered to Your Doorstep
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Browse nearby pharmacies, order medicines and health products, and get them delivered fast
          </p>
          <div className="flex items-center justify-center gap-4 pt-4">
            <Button size="lg" asChild className="h-12 px-8">
              <Link href="/register">Get Started</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="h-12 px-8 bg-transparent">
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-card border border-border rounded-xl p-6 space-y-3">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <MapPin className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">Find Nearby Pharmacies</h3>
            <p className="text-sm text-muted-foreground">
              Discover pharmacies near you with ratings and delivery estimates
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 space-y-3">
            <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center">
              <Clock className="h-6 w-6 text-secondary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">Fast Delivery</h3>
            <p className="text-sm text-muted-foreground">
              Get your medicines delivered quickly with real-time order tracking
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 space-y-3">
            <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
              <ShieldCheck className="h-6 w-6 text-accent" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">Verified Products</h3>
            <p className="text-sm text-muted-foreground">
              All medicines are sourced from licensed and verified pharmacies
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 space-y-3">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Pill className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">Wide Selection</h3>
            <p className="text-sm text-muted-foreground">
              Access thousands of medicines, supplements, and health products
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 border border-border rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">Ready to Order?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            Join thousands of users who trust PharmaDash for their medicine delivery needs
          </p>
          <Button size="lg" asChild className="h-12 px-8">
            <Link href="/register">Create Free Account</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Pill className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-semibold text-foreground">PharmaDash</span>
            </div>
            <p className="text-sm text-muted-foreground">© 2025 PharmaDash. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
