import SessionsRouter from "./sessions.routes.js";
import { Router } from "express";
const router = Router();
import { ROUTES_PATH } from "../constants/routes_path.js";
import ViewsRouter from "./views.routes.js";
const UserRouter = new SessionsRouter();

router.use(ROUTES_PATH.HOME, ViewsRouter);
router.use(ROUTES_PATH.LOGIN, UserRouter.getRouter()); //iniciar routes, const router = Router();

export default router;
