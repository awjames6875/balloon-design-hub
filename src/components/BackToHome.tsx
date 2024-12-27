import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"
import { useNavigate } from "react-router-dom"

export const BackToHome = () => {
  const navigate = useNavigate()

  return (
    <Button 
      variant="ghost" 
      className="mb-6 hover:bg-white/60"
      onClick={() => navigate("/")}
    >
      <Home className="h-4 w-4 mr-2" />
      Back to Home
    </Button>
  )
}