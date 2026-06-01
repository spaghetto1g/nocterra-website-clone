export default function AdminMediaPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-light text-white mb-2">Media Library</h1>
        <p className="text-white/40 text-sm">Manage your property images and videos</p>
      </div>

      {/* Coming Soon */}
      <div className="bg-[#0f0f0f] border border-white/5 rounded-xl py-24 text-center">
        <div className="w-16 h-16 rounded-full bg-[#c9a962]/10 flex items-center justify-center mx-auto mb-6">
          <span className="text-[#c9a962] text-2xl">📷</span>
        </div>
        <h2 className="text-xl font-light text-white mb-2">Coming Soon</h2>
        <p className="text-white/40 text-sm max-w-md mx-auto">
          The media library will allow you to upload, organize, and manage all your 
          property images, cinematic videos, and 360° tour assets in one place.
        </p>
      </div>
    </div>
  )
}
