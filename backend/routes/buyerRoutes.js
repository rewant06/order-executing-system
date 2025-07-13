import express from "express";
import {
  addNewBuyerOrder,
  getAllBuyerOrders,
} from "../controllers/orderController.js";

const buyerRouter = express.Router();

buyerRouter.get("/getAllBuyer", getAllBuyerOrders);

buyerRouter.post("/addNewBuyer", addNewBuyerOrder);

export default buyerRouter;
