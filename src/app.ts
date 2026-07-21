import express, { Application, Request, Response } from "express";
import cookieParser from "cookie-parser"
import cors from 'cors'
import config from "./config";
import { userRoutes } from "./modules/users/user.route";
import { propertyRoutes } from "./modules/properties/properties.routes";
import { categoryRoutes } from "./modules/categories/category.routes";
import { rentalRequestRoutes } from "./modules/rentalRequests/rentalRequest.routes";
import { paymentRoutes } from "./modules/payments/payment.routes";

const app: Application = express();

app.use(cors({
    origin: config.app_url,
    credentials: true,
}))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

app.get("/", async (req: Request, res: Response) => {
    res.send("Hello, world")
})

app.use("/api/auth", userRoutes)
app.use("/api/properties", propertyRoutes)
app.use("/api/categories", categoryRoutes)
app.use("/api/rentalRequests", rentalRequestRoutes)
app.use("/api/payment", paymentRoutes)

export default app;