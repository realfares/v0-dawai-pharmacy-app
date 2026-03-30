import { redirect } from "next/navigation"
import { getCurrentUser } from "@/app/actions/auth"
import { PharmacistNav } from "@/components/pharmacist-nav"
import { getCustomers } from "@/app/actions/chat"
import { ChatInterface } from "@/components/chat-interface"

export default async function PharmacistChatPage() {
  const user = await getCurrentUser()

  if (!user || user.role !== "Pharmacist") {
    redirect("/login")
  }

  const customers = await getCustomers()

  return (
    <div className="min-h-screen bg-background">
      <PharmacistNav userName={user.fullName} />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Patient Communication</h1>
          <p className="text-muted-foreground">Chat with customers about their medications</p>
        </div>

        <ChatInterface currentUser={user} otherUsers={customers} />
      </main>
    </div>
  )
}
