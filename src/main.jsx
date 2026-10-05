import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { MantineProvider } from "@mantine/core";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import { WishlistProvider } from "./context/WishlistContext.jsx";
import { ProductProvider } from "./context/ProductContext.jsx";
import { theme } from "./theme.js";
import "@mantine/core/styles.css";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <MantineProvider theme={theme} defaultColorScheme="light">
        <AuthProvider>
          <CartProvider>
            <ProductProvider>
              <WishlistProvider>
                <App />
              </WishlistProvider>
            </ProductProvider>
          </CartProvider>
        </AuthProvider>
      </MantineProvider>
    </BrowserRouter>
  </StrictMode>
);
