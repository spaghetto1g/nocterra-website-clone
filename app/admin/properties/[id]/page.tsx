import { redirect } from "next/navigation"

type PropertyRedirectPageProps = {
  params: Promise<{ id: string }>
}

export default async function PropertyRedirectPage({ params }: PropertyRedirectPageProps) {
  const { id } = await params
  redirect(`/admin/properties/edit/${id}`)
}
