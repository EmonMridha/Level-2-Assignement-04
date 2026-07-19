import { prisma } from "../../lib/prisma"

const getAllProperty = async () => {
    const properties = await prisma.property.findMany({
        where: {
            isAvailable: true
        },
        include: {
            landlord: {
                select: {
                    name: true,
                    email: true
                }
            },
            category: true
        }
    })

    return properties
}

const getSingleProperty = async (id: string) => {
    const property = await prisma.property.findUniqueOrThrow({
        where: {
            id: id
        },
        include: {
            landlord: {
                select: {
                    name: true,
                    email: true
                }
            },
            category: true,
            reviews: {
                include: {
                    tenant: {
                        select: {
                            name: true
                        }
                    }
                },
                orderBy: {
                    createdAt: "desc"
                }
            }
        }
    })

    return property
}

export const propertyService = {
    getAllProperty,
    getSingleProperty
}