import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { AppShell } from "./components/layout/AppShell";
import { CollectionPage } from "./pages/CollectionPage";
import { ContentPage } from "./pages/ContentPage";
import { CartPage } from "./pages/CartPage";
import { AboutPage } from "./pages/AboutPage";
import { AccessoriesPage } from "./pages/AccessoriesPage";
import { ContactPage } from "./pages/ContactPage";
import { BlogPage } from "./pages/BlogPage";
import { headerCategoryLinks, navLinks } from "./data/site";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { ProductPage } from "./pages/ProductPage";
import { SavedItemsPage } from "./pages/SavedItemsPage";
import { SearchPage } from "./pages/SearchPage";
import { SignupPage } from "./pages/SignupPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<HomePage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="saved-items" element={<SavedItemsPage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="signup" element={<SignupPage />} />
          <Route path="blog" element={<BlogPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="accessories" element={<AccessoriesPage />} />
          <Route path="contact" element={<ContactPage />} />
          {navLinks
            .filter(
              (item) =>
                !["/", "/blog", "/about", "/accessories", "/contact"].includes(
                  item.path,
                ),
            )
            .map((item) => (
              <Route
                key={item.path}
                path={item.path.slice(1)}
                element={<ContentPage page={item} />}
              />
            ))}
          {headerCategoryLinks.map((item) => (
            <Route
              key={item.path}
              path={item.path.slice(1)}
              element={<CollectionPage />}
            />
          ))}
          <Route path="products/:productId" element={<ProductPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Router>
  );
}
