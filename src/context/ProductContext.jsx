/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { products as initialProducts } from "../data/products";
import { api, fileUrl } from "../lib/api";
import { useAuth } from "./AuthContext";

const ProductContext = createContext(null);

const mapProduct = (product) => ({
  ...product,
  id: product._id || product.id,
  title: product.name || product.title,
  image: fileUrl(product.images?.[0] || product.image),
  categoryId: product.category?._id || product.categoryId || "",
  category: product.category?.name || product.category,
  material: product.material || "Handcrafted",
  collection: product.collection || "new",
  isActive: product.isActive !== false,
});

export const ProductProvider = ({ children }) => {
  const { role } = useAuth();
  const [products, setProducts] = useState(initialProducts);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const [{ data: productData }, { data: categoryData }] = await Promise.all([
          api.get(role === "admin" ? "/products/admin" : "/products"),
          api.get("/category"),
        ]);
        setProducts(productData.map(mapProduct));
        setCategories(categoryData);
      } catch {
        // Keep the bundled catalog available when the API is offline.
      }
    };

    loadProducts();
  }, [role]);

  const addProduct = async (product) => {
    const { data } = await api.post("/products", product);
    const nextProduct = mapProduct(data);
    setProducts((currentProducts) => [nextProduct, ...currentProducts]);
    return nextProduct;
  };

  const updateProduct = useCallback(async (id, product) => {
    const existingProduct = products.find((currentProduct) => currentProduct.id === id);
    const payload = {
      name: existingProduct?.name || existingProduct?.title,
      slug: existingProduct?.slug,
      price: existingProduct?.price,
      stock: existingProduct?.stock,
      images: existingProduct?.images?.length
        ? existingProduct.images
        : existingProduct?.image ? [existingProduct.image] : [],
      category: existingProduct?.categoryId || existingProduct?.category,
      collection: existingProduct?.collection,
      material: existingProduct?.material,
      description: existingProduct?.description,
      origin: existingProduct?.origin,
      finishTime: existingProduct?.finishTime,
      height: existingProduct?.height,
      isActive: existingProduct?.isActive !== false,
      ...product,
    };
    const { data } = await api.put(`/products/${id}`, payload);
    const nextProduct = mapProduct({
      ...existingProduct,
      ...payload,
      ...(data || {}),
      _id: data?._id || id,
      category: data?.category ?? existingProduct?.category ?? payload.category,
    });
    setProducts((currentProducts) => currentProducts.map((currentProduct) => (
      currentProduct.id === id ? nextProduct : currentProduct
    )));
    return nextProduct;
  }, [products]);

  const addCategory = async (category) => {
    const { data } = await api.post("/category/create", category);
    setCategories((currentCategories) => [...currentCategories, data]);
    return data;
  };

  const removeCategory = async (id) => {
    await api.delete(`/category/${id}`);
    setCategories((currentCategories) => currentCategories.filter((category) => category._id !== id));
  };

  const removeProduct = async (id) => {
    await api.delete(`/products/${id}`);
    setProducts((currentProducts) => currentProducts.filter((product) => product.id !== id));
  };

  const uploadImage = async (file) => {
    const body = new FormData();
    body.append("image", file);
    const { data } = await api.post("/products/upload-image", body);
    return fileUrl(data.image);
  };

  const value = useMemo(
    () => ({ products, categories, addProduct, updateProduct, addCategory, removeCategory, removeProduct, uploadImage }),
    [products, categories, updateProduct]
  );

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) throw new Error("useProducts must be used within ProductProvider");
  return context;
};