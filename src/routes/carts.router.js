import CustomRouter from "./custom.router.js";
import { completePurchase, getCart  } from "../controllers/cart.controller.js";

export default class CartsRouter extends CustomRouter {
    init() {
        this.get("/carts/:cid", ["USER"], getCart);
        this.get('/carts/:cid/purchase', ["USER"], completePurchase);
    }
}   
