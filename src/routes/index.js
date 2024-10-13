import SessionsRouter from "./sessions.routes.js";
import CartsRouter from "./carts.router.js";
import ProductsRouter from "./products.router.js";

import { Router } from "express";
const router = Router();
import { ROUTES_PATH } from "../constants/routes_path.js";
import ViewsRouter from "./views.routes.js";

const UserRouter = new SessionsRouter();
const Carts = new CartsRouter();
const Products = new ProductsRouter();

router.use(ROUTES_PATH.HOME, ViewsRouter);
router.use(ROUTES_PATH.LOGIN, UserRouter.getRouter()); //iniciar routes, const router = Router();
router.use(ROUTES_PATH.REGISTER, UserRouter.getRouter());
router.use(ROUTES_PATH.CART, Carts.getRouter());
router.use(ROUTES_PATH.COMPLETE_PURCHASE, Carts.getRouter());
router.use(ROUTES_PATH.ADD_PRODUCT, Products.getRouter());



export default router;
