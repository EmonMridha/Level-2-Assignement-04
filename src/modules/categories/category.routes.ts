import { Router } from "express";
import { categoryController } from "./category.controller";

const router = Router()

router.get('/', categoryController.getAllCategory)// public
router.post("/", categoryController.createCategory)
router.patch('/:id', categoryController.updateCategory)
router.delete("/:id", categoryController.deleteCategory)

export const categoryRoutes = router