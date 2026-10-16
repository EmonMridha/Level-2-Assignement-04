export interface IProperty {
    title: string;
    description: string;
    address: string;
    city: string;
    rent: number;
    bedrooms: number;
    bathrooms: number;
    amenities: string[];
    categoryId: string;
    images: IPropertyImageInput[]; // <-- add this
}

export interface IPropertyImageInput {
    url: string;
    publicId?: string;
}

export interface IUpdateProperty {
    title?: string;
    description?: string;
    address?: string;
    city?: string;

    rent?: number;
    bedrooms?: number;
    bathrooms?: number;

    amenities?: string[];
    isAvailable?: boolean;

    categoryId?: string;
}