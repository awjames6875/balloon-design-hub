import { Logo } from "./Logo"
import { Button } from "./ui/button"
import { useNavigate } from "react-router-dom"
import { LogOut } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"

export const Header = () => {
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      navigate("/auth")
      toast.success("Logged out successfully")
    } catch (error) {
      toast.error("Error logging out")
    }
  }

  return (
    <header className="w-full border-b bg-white/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Logo />
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleLogout}
          className="text-gray-600 hover:text-gray-900"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </header>
  )
}