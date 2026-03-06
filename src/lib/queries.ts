import { createServerClient } from "./supabase"

/**
 * TEMPLATE: Define your data types and query functions here.
 * Each page's server component calls one of these functions.
 *
 * Example interface + query below. Replace with your actual schema.
 */

export interface ExampleRow {
  id: string
  name: string
  category: string
  value: number
  created_at: string
}

export async function getExampleData(): Promise<ExampleRow[]> {
  const client = createServerClient()
  const { data, error } = await client
    .from("example_table")
    .select("*")
    .order("created_at", { ascending: false })
  if (error) throw error
  return data || []
}

/**
 * Paginated query for tables with >1000 rows.
 * PostgREST enforces a max-rows limit; this loops with .range().
 */
export async function getPaginatedData<T>(
  table: string,
  orderCol = "created_at"
): Promise<T[]> {
  const client = createServerClient()
  const allData: T[] = []
  const pageSize = 1000
  let offset = 0

  while (true) {
    const { data, error } = await client
      .from(table)
      .select("*")
      .order(orderCol, { ascending: false })
      .range(offset, offset + pageSize - 1)

    if (error) throw error
    if (!data || data.length === 0) break
    allData.push(...(data as T[]))
    if (data.length < pageSize) break
    offset += pageSize
  }

  return allData
}
