import { addProduct } from "../controllers/product.controller.js";
import CustomRouter from "./custom.router.js";

export default class ProductsRouter extends CustomRouter {
    init() {
        this.post("/products", ["USER"], addProduct);
    }
}   
