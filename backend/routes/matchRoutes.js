import express from "express";
import { matchOrders } from "../controllers/orderMatchingController.js";

const router = express.Router();

router.post("/match", matchOrders);

export default router;
