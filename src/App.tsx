
import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import ProductionForms from './pages/ProductionForms';
import Inventory from './pages/Inventory';
import NotFound from './components/ui/NotFound';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Inventory />,
    errorElement: <NotFound />,
  },
  {
    path: "/production-forms",
    element: <ProductionForms />,
  },
  {
    path: "/inventory",
    element: <Inventory />,
  },
]);

function App() {
  return (
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}

export default App;
