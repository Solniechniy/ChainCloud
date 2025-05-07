import { BrowserRouter, Routes, Route } from "react-router";
import App from "@/pages/App";
import { Dashboard } from "./pages/Dashboard";
import { SolanaProvider } from "@/providers/SolanaProvider";
import { ProtectedRoute } from "./components/ProtectedRoute";

export const Pages = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route element={<SolanaProvider />}>
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};