import { Router } from "express";
import { createCategory, deleteCategory, listCategories, updateCategory } from "../controllers/category.controller";
import { authenticate, requireVerifiedEmail } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { createCategorySchema, updateCategorySchema } from "../validators/category.validators";
import { idParamsSchema } from "../validators/common.validators";

export const categoryRouter = Router();

categoryRouter.use(authenticate, requireVerifiedEmail);
categoryRouter.get("/", listCategories);
categoryRouter.post("/", validate({ body: createCategorySchema }), createCategory);
categoryRouter.patch("/:id", validate({ params: idParamsSchema, body: updateCategorySchema }), updateCategory);
categoryRouter.delete("/:id", validate({ params: idParamsSchema }), deleteCategory);
