import { redirect } from "next/navigation"
import { getCurrentUser } from "@/app/actions/auth"
import { CustomerNav } from "@/components/customer-nav"
import { getPharmacists } from "@/app/actions/chat"
import { ChatInterface } from "@/components/chat-interface"

export default async function CustomerChatPage() {
  const user = await getCurrentUser()

  if (!user || user.role !== "Customer") {
    redirect("/login")
  }

  const pharmacists = await getPharmacists()

  return (
    <div className="min-h-screen bg-background">
      <CustomerNav userName={user.fullName} />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Chat with Pharmacist</h1>
          <p className="text-muted-foreground">Get consultation and medication advice</p>
        </div>

        <ChatInterface currentUser={user} otherUsers={pharmacists} />
      </main>
    </div>
  )
}
