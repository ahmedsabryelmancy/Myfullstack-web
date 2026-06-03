import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "../ahmed.css";
import "./styles/auth.css";
import "./styles/cart.css";
import "./styles/footer.css";
import "./styles/navigation-pages.css";
import "./styles/page-loader.css";
import "./styles/react-overrides.css";
import "./styles/product-page.css";
import "./styles/search.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);