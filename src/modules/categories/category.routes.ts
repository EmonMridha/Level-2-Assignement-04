import { Router } from "express";
import { categoryController } from "./category.controller";
import { auth } from "../../middleware/auth";

const router = Router()

router.get('/', categoryController.getAllCategory)// public
router.post("/", auth("ADMIN"), categoryController.createCategory)
router.patch('/:id', auth('ADMIN'), categoryController.updateCategory)
router.delete("/:id", auth('ADMIN'), categoryController.deleteCategory)

export const categoryRoutes = router