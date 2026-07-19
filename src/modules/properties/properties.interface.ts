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
}