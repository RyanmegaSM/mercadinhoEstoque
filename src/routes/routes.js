import { Router } from "express";
import ProductRoutes from "./product.routes.js";
import CategoriesRoutes from "./category.routes.js";
import SuppliersRoutes from "./supplier.routes.js";
import BatchesRoutes from "./batch.routes.js";
import StockMovementRoutes from "./stockMovement.routes.js";
import UsersRoutes from "./user.routes.js";
import AuthRoutes from "./auth.routes.js";
import DashboardRoutes from "./dashboard.routes.js";

const router = Router();

router.use("/auth", AuthRoutes);
router.use("/users", UsersRoutes);
router.use("/products", ProductRoutes);
router.use("/categories", CategoriesRoutes);
router.use("/suppliers", SuppliersRoutes);
router.use("/batches", BatchesRoutes);
router.use("/movement", StockMovementRoutes);
router.use("/dashboard", DashboardRoutes);
export default router;
