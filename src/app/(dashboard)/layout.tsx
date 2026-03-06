import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Sidebar } from "@/components/dashboard/sidebar"
import { FilterProvider } from "@/hooks/use-filters"
import { PRIMARY } from "@/lib/constants"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()
  if (!session) redirect("/login")

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-auto relative">
        <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
          <div
            className="absolute -top-[200px] -right-[200px] w-[600px] h-[600px] rounded-full blur-[120px]"
            style={{ backgroundColor: `${PRIMARY}05` }}
          />
        </div>
        <main className="relative z-10 p-8">
          <FilterProvider>{children}</FilterProvider>
        </main>
      </div>
    </div>
  )
}
