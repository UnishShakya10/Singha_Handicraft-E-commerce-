import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router";

import Nav from "./component/Nav";
import Footer from "./component/Footer";
import About from "./pages/AboutPage";
import Contact from "./pages/Contact";
import Shop from "./pages/Shop";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import NotFound from "./pages/NotFound";
import Orders from "./pages/Orders";
import Profile from "./pages/Profile";
import CartPage from "./pages/CartPage";
import AdminDashboard from "./admin/AdminDashboard";
import LoginPage from "./sign/login/LoginPage";
import SignupPage from "./sign/login/SignupPage";
import PrivateRoute from "./routes/PrivateRoute";
import AdminRoute from "./routes/AdminRoute";

const App = () => {
  const { pathname, hash } = useLocation();

  const isAdminRoute = pathname.startsWith("/admin");
  const isAuthRoute = pathname === "/login" || pathname === "/signup";

  useEffect(() => {
    if (hash) {
      const target = document.getElementById(
        decodeURIComponent(hash.slice(1))
      );

      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }

    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return (
    <>
      {!isAdminRoute && !isAuthRoute && (
        <header className="site-header">
          <Nav />
        </header>
      )}

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/shop/:productId" element={<ProductDetail />} />

          {/* User Protected Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/cart" element={<CartPage />} />
          </Route>

          {/* Admin Protected Route */}
          <Route element={<PrivateRoute />}>
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {!isAdminRoute && !isAuthRoute && <Footer />}
    </>
  );
};

export default App;