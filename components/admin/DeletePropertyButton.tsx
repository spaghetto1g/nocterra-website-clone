"use client"

import { useState } from "react"
import { Trash2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface DeletePropertyButtonProps {
  propertyId: string
  propertyTitle: string
}

export function DeletePropertyButton({ propertyId, propertyTitle }: DeletePropertyButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleDelete = async () => {
    setLoading(true)
    const { error } = await supabase
      .from("villas")
      .delete()
      .eq("id", propertyId)

    if (!error) {
      router.refresh()
    }
    setLoading(false)
    setShowConfirm(false)
  }

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        className="inline-flex items-center gap-2 px-4 py-2 border border-white/10 text-white/60 text-xs uppercase tracking-wider rounded hover:border-red-500/50 hover:text-red-400 transition-colors"
      >
        <Trash2 className="w-3 h-3" />
        Delete
      </button>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-6">
          <div className="bg-[#0f0f0f] border border-white/10 rounded-xl p-8 max-w-md w-full">
            <h3 className="text-xl font-light text-white mb-4">Delete Property</h3>
            <p className="text-white/50 text-sm mb-6">
              Are you sure you want to delete <span className="text-white">{propertyTitle}</span>? 
              This action cannot be undone.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 px-4 py-3 border border-white/10 text-white/60 text-sm rounded-lg hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="flex-1 px-4 py-3 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
