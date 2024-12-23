import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Toaster } from "@/components/ui/sonner"
import { Index } from "@/pages/Index"
import { NewDesign } from "@/pages/NewDesign"
import { ProductionForms } from "@/pages/ProductionForms"
import { Inventory } from "@/pages/Inventory"
import { CreateProject } from "@/pages/CreateProject"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/new-design" element={<NewDesign />} />
        <Route path="/production-forms" element={<ProductionForms />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/create-project" element={<CreateProject />} />
      </Routes>
      <Toaster />
    </Router>
  )
}

export default App