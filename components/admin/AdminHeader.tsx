type AdminHeaderProps = {
  user?: {
    email?: string
  } | null
}

export function AdminHeader({ user }: AdminHeaderProps) {
  return (
    <header className="h-20 border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-xl flex items-center justify-between px-6 lg:px-10">
      <div>
        <h1 className="text-white text-2xl font-light tracking-[0.2em]">
          NOCTERRA ADMIN
        </h1>

        <p className="text-white/40 text-sm mt-1">
          Luxury Villa Management System
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-white text-sm">
            {user?.email || "Admin"}
          </p>

          <p className="text-white/40 text-xs">
            Authenticated Session
          </p>
        </div>

        <div className="w-11 h-11 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white">
          N
        </div>
      </div>
    </header>
  )
}