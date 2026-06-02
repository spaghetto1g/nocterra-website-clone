import { notFound } from "next/navigation"
import VillaClient from "@/app/villas/[slug]/VillaClient"
import { getVillaByCustomSubdomain } from "@/lib/villas"

export const dynamic = "force-dynamic"
export const revalidate = 0

type SubdomainPageProps = {
  params: Promise<{ subdomain: string }>
}

export default async function SubdomainPage({ params }: SubdomainPageProps) {
  const { subdomain } = await params
  const villa = await getVillaByCustomSubdomain(subdomain)

  if (!villa) {
    notFound()
  }

  return <VillaClient villa={villa} />
}
