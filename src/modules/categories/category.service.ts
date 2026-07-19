import { prisma } from "../../lib/prisma"

// Public
const getAllCategory = async () => {
    const categories = await prisma.category.findMany()
    return categories
}

// Admin
const createCategory = async (payload: { name: string }) => {
    const name = payload.name

    if (!name || name.trim() === "") {
        throw new Error("Category name is required");
    }

    const isCategoryExists = await prisma.category.findUnique({
        where: {
            name
        }
    });

    if (isCategoryExists) {
        throw new Error("Category already exists");
    }

    const createCat = await prisma.category.create({
        data: {
            name
        }
    })

    return createCat
}

// Admin
const updateCategory = async (
    id: string,
    payload: { name?: string }
) => {

}

// Admin
const deleteCategory = async (id: string) => {

}

export const categoryService = {
    getAllCategory,
    createCategory,
    updateCategory,
    deleteCategory
}