import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Design from './pages/Design';
import ProductionForms from './pages/ProductionForms';
import Home from './pages/Home';
import Inventory from './pages/Inventory'; // Ensure this import is correct
import NotFound from './pages/NotFound';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <NotFound />,
  },
  {
    path: "/design",
    element: <Design />,
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
