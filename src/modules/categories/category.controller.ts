import { Request, Response } from "express"
import { categoryService } from "./category.service";
import { catchAsync } from "../../utils/catchAsync";

const getAllCategory = catchAsync(async (req: Request, res: Response) => {
    const categories = await categoryService.getAllCategory()

    res.status(200).json({
        success: true,
        message: "Categories retrieved successfully",
        data: categories
    })
})

const createCategory = catchAsync(async (req: Request, res: Response) => {
    // Admin
    const result = await req.body;
    const { name } = result;

    const createCat = await categoryService.createCategory({ name })

    res.status(201).json({
        success: true,
        message: "Category created successfully",
        data: createCat
    })
})

const updateCategory = catchAsync(async (req: Request, res: Response) => {
    // Admin
    const id = req.params.id
    const result = await req.body;
    const { name } = result;
    const updateCat = await categoryService.updateCategory(id as string, { name })

    res.status(200).json({
        success: true,
        message: "Category updated successfully",
        data: updateCat
    })
})

// const deleteCategory = async (req: Request, res: Response) => {
//     // Admin
// }

export const categoryController = {
    getAllCategory,
    createCategory,
    updateCategory,
    // deleteCategory
}