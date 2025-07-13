import prisma from "../prismaClient.js";
import { decryptWithPrivateKey } from "../utils/decryptUtils.js";
import { runOrderMatching } from "./orderMatchingController.js";

export const addNewBuyerOrder = async (req, res) => {
  try {
    const { encryptedData } = req.body;

    const { buyer_qty, buyer_price } = decryptWithPrivateKey(encryptedData);

    const newOrder = await prisma.buyerOrder.create({
      data: {
        buyer_qty: parseInt(buyer_qty),
        buyer_price: parseInt(buyer_price),
      },
    });
    await runOrderMatching();

    console.log("addNewBuyer Saved to DB:", newOrder);
    res.status(201).json(newOrder);
  } catch (error) {
    console.error("Error adding buyer order:", error);

    res.status(500).json({ error: "Failed to add buyer order" });
  }
};

export const getAllBuyerOrders = async (req, res) => {
  try {
    const buyers = await prisma.buyerOrder.findMany();
    console.log("Pending Buyers Order Found:", buyers.length, "orders");
    res.json(buyers);
  } catch (err) {
    console.error("Buyers order Error:", err.message);
    res.status(500).json({ error: "Failed to get buyer orders" });
  }
};

export const addNewSellerOrder = async (req, res) => {
  try {
    const { encryptedData } = req.body;

    const { seller_qty, seller_price } = decryptWithPrivateKey(encryptedData);

    const newOrder = await prisma.sellerOrder.create({
      data: {
        seller_qty: parseInt(seller_qty),
        seller_price: parseFloat(seller_price),
      },
    });

    await runOrderMatching();
    console.log("addNewSeller Saved to DB:", newOrder);
    console.log("Seller Order Created:", newOrder);
    res.status(201).json(newOrder);
  } catch (error) {
    console.error("Error adding seller order:", error);
    res.status(500).json({ error: "Failed to add seller order" });
  }
};

export const getAllSellerOrders = async (req, res) => {
  try {
    const sellers = await prisma.sellerOrder.findMany({
      where: { isCompleted: false },
      orderBy: { createdAt: "asc" },
    });
    console.log("Pending Sellers Order Found:", sellers.length, "orders");
    res.json(sellers);
  } catch (error) {
    console.error("Seller order Error:", error.message);
    res.status(500).json({ error: "Failed to get seller orders" });
  }
};

export const getAllCompletedOrders = async (req, res) => {
  try {
    const completed = await prisma.completedOrder.findMany({
      orderBy: { createdAt: "desc" },
    });
    console.log("Completed Orders Found:", completed.length, "orders");
    res.json(completed);
  } catch (error) {
    console.error("Completed orders Error:", error.message);
    res.status(500).json({ error: "Failed to get completed orders" });
  }
};
