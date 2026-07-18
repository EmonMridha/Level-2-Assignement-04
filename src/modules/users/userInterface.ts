export interface IUser {
    name: string;
    email: string;
    password: string;
    phone?: string;
    profilePhoto?: string;
    role?: "TENANT" | "LANDLORD" | "ADMIN";
    status?: "ACTIVE" | "BLOCKED";
}
