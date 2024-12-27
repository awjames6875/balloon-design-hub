import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Index from "./pages/Index"
import NewDesign from "./pages/NewDesign"
import Inventory from "./pages/Inventory"
import ProductionForms from "./pages/ProductionForms"
import CompletedProjects from "./pages/CompletedProjects"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/new-design" element={<NewDesign />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/production-forms" element={<ProductionForms />} />
        <Route path="/completed-projects" element={<CompletedProjects />} />
      </Routes>
    </Router>
  )
}

export default App