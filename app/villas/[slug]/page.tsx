import VillaClient from "./VillaClient"
import { getConciergeForVilla } from "@/lib/concierge"
import { getVillaBySlug } from "@/lib/villas"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function VillaPage({ params }: any) {
  const resolvedParams = await Promise.resolve(params)
  const slug = resolvedParams.slug
  const villa = await getVillaBySlug(slug)

  if (!villa) {
    return (
      <div className="text-white p-10">
        Villa not found
      </div>
    )
  }

  const conciergeItems = await getConciergeForVilla(villa)

  return <VillaClient villa={villa} conciergeItems={conciergeItems} />
}
