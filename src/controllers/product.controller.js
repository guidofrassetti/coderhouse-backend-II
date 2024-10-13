import ProductService from "../services/product.services.js";

const productService = new ProductService();

export const addProduct = async (req, res) => {
  try {
    const { name, description, price, stock } = req.body;

    if (!name || !description || !price || !stock) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newProduct = await productService.createProduct({ name, description, price, stock });

    return res.status(201).json({ message: "Product created successfully", product: newProduct });
  } catch (error) {
    return res.status(500).json({ message: "Error creating product", error });
  }
};
