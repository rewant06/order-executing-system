import express from "express";
import {
  addNewSellerOrder,
  getAllSellerOrders,
} from "../controllers/orderController.js";

const sellerRouter = express.Router();

sellerRouter.get("/getAllSeller", getAllSellerOrders);

sellerRouter.post("/addNewSeller", addNewSellerOrder);

export default sellerRouter;
