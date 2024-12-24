import { Package } from "lucide-react"

export const Logo = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="p-2 bg-primary rounded-full">
        <Package className="w-6 h-6 text-white" />
      </div>
      <span className="text-xl font-semibold">Balloon Design Hub</span>
    </div>
  )
}