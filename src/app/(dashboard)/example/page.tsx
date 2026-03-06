import { getExampleData } from "@/lib/queries"
import { ExampleClient } from "@/components/pages/example-client"

export const revalidate = 300

export default async function ExamplePage() {
  const data = await getExampleData()
  return <ExampleClient data={data} />
}
