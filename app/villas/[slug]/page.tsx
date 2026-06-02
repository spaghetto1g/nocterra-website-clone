import { supabase } from "@/lib/supabase"
import VillaClient from "./VillaClient"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function VillaPage({ params }: any) {
  const resolvedParams = await Promise.resolve(params)
  const slug = resolvedParams.slug

  const { data: villa } = await supabase
    .from("villas")
    .select("*")
    .eq("slug", slug)
    .eq("status", "active")
    .maybeSingle()

  if (!villa) {
    return (
      <div className="text-white p-10">
        Villa not found
      </div>
    )
  }

  return <VillaClient villa={villa} />
}
