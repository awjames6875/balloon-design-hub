import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { Toaster } from "@/components/ui/sonner"
import { useEffect, useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import Index from "@/pages/Index"
import NewDesign from "@/pages/NewDesign"
import ProductionForms from "@/pages/ProductionForms"
import Inventory from "@/pages/Inventory"
import { CreateProject } from "@/pages/CreateProject"
import Auth from "@/pages/Auth"

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  useEffect(() => {
    // Check initial auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Show nothing while checking auth state
  if (isAuthenticated === null) {
    return null
  }

  return (
    <Router>
      <Routes>
        <Route 
          path="/auth" 
          element={isAuthenticated ? <Navigate to="/" /> : <Auth />} 
        />
        <Route 
          path="/" 
          element={isAuthenticated ? <Index /> : <Navigate to="/auth" />} 
        />
        <Route 
          path="/new-design" 
          element={isAuthenticated ? <NewDesign /> : <Navigate to="/auth" />} 
        />
        <Route 
          path="/production-forms" 
          element={isAuthenticated ? <ProductionForms /> : <Navigate to="/auth" />} 
        />
        <Route 
          path="/inventory" 
          element={isAuthenticated ? <Inventory /> : <Navigate to="/auth" />} 
        />
        <Route 
          path="/create-project" 
          element={isAuthenticated ? <CreateProject /> : <Navigate to="/auth" />} 
        />
      </Routes>
      <Toaster />
    </Router>
  )
}

export default App