import { ProductModel } from "../models/product.model.js";
import DatabaseDao from "../models/dao.js";

const productDAO = new DatabaseDao(ProductModel);

export default class ProductService {
  async createProduct(req) {
    try {
      const { name, description, price, stock } = req.body;

      if (!name || !description || !price || !stock) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const newProduct = await productDAO.create({ name, description, price, stock });
      return { success: true, product: newProduct };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };
}