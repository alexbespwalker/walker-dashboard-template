import { redirect } from "next/navigation"
import { DEFAULT_ROUTE } from "@/lib/constants"

export default function Home() {
  redirect(DEFAULT_ROUTE)
}
