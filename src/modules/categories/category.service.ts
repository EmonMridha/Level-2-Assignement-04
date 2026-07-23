import { prisma } from "../../lib/prisma"

// Public
const getAllCategory = async () => {
    const categories = await prisma.category.findMany()
    return categories
}

// Admin(create category)
const createCategory = async (payload: { name: string }) => {


    if (!payload.name || typeof payload.name !== "string") {
        throw new Error("Category name is required");
    }

    const name = payload.name.trim().toUpperCase();

    if (name === "") {
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
const updateCategory = async (id: string, payload: { name: string }
) => {

    if (!id) {
        throw new Error("Category ID is required");
    }

    if (!payload.name || typeof payload.name !== "string") {
        throw new Error("Category name is required");
    }

    const categoryName = payload.name.trim().toUpperCase();

    if (categoryName === "") {
        throw new Error("Category name is required");
    }


    // Check if category exists
    const category = await prisma.category.findUnique({
        where: { id }
    });

    if (!category) {
        throw new Error("Category not found");
    }

    // Check duplicate name
    const isCategoryExists = await prisma.category.findFirst({
        where: {
            name: categoryName,
            NOT: {
                id
            }
        }
    });

    if (isCategoryExists) {
        throw new Error("Category already exists");
    }

    const updatedCategory = await prisma.category.update({
        where: { id },
        data: {
            name: categoryName
        }
    });

    return updatedCategory;

}

// Admin
const deleteCategory = async (id: string) => {
    const deleteCat = await prisma.category.delete({
        where: {
            id: id
        }
    })
    return deleteCat
}

export const categoryService = {
    getAllCategory,
    createCategory,
    updateCategory,
    deleteCategory
}