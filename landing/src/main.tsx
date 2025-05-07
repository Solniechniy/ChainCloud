import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { Pages } from "@/routes.tsx";

import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Pages />
  </StrictMode>
);
