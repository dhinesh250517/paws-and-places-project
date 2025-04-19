
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import Index from "./pages/Index";
import Home from "./pages/home";
import AddAnimal from "./pages/AddAnimal";
import AboutUs from "./pages/AboutUs";
import NotFound from "./pages/NotFound";
import Owner from "./pages/Owner";
import AdoptedAnimals from "./pages/AdoptedAnimals";
import DeletedAnimals from "./pages/DeletedAnimals";

// Create a new QueryClient instance
const queryClient = new QueryClient();

const App = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/home" element={<Home />} />
              <Route path="/add" element={<AddAnimal />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/owner" element={<Owner />} />
              <Route path="/adopted" element={<AdoptedAnimals />} />
              <Route path="/deleted" element={<DeletedAnimals />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
