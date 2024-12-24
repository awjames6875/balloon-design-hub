import { Logo } from "./Logo"
import { Button } from "./ui/button"
import { useNavigate, useLocation } from "react-router-dom"
import { LogOut } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"

export const Header = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      navigate("/auth")
      toast.success("Logged out successfully")
    } catch (error) {
      toast.error("Error logging out")
    }
  }

  const navItems = [
    { text: "Home", path: "/" },
    { text: "Design", path: "/new-design" },
    { text: "Inventory", path: "/inventory" },
    { text: "Production", path: "/production-forms" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Logo />
            <nav className="hidden md:block">
              <ul className="flex items-center gap-6">
                {navItems.map((item) => (
                  <li key={item.path}>
                    <Button
                      variant={location.pathname === item.path ? "default" : "ghost"}
                      className="text-sm font-medium transition-colors"
                      onClick={() => navigate(item.path)}
                    >
                      {item.text}
                    </Button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
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
      </div>
    </header>
  )
}