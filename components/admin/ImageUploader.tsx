"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"

interface Props {
  onUpload: (url: string) => void
}

export default function ImageUploader({ onUpload }: Props) {
  const [uploading, setUploading] = useState(false)

  async function handleUpload(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    try {
      setUploading(true)

      const file = e.target.files?.[0]

      if (!file) return

      const fileExt = file.name.split(".").pop()
      const fileName = `${Date.now()}.${fileExt}`

      const { error } = await supabase.storage
        .from("villa-media")
        .upload(fileName, file)

      if (error) {
        console.error(error)
        return
      }

      const {
        data: { publicUrl },
      } = supabase.storage
        .from("villa-media")
        .getPublicUrl(fileName)

      onUpload(publicUrl)
    } catch (error) {
      console.error(error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      <input
        type="file"
        onChange={handleUpload}
        className="text-white"
      />

      {uploading && (
        <p className="text-sm text-[#c9a86a]">
          Uploading...
        </p>
      )}
    </div>
  )
}