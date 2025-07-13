import prisma from "../prismaClient.js";

export const runOrderMatching = async () => {
  return await prisma.$transaction(async (tx) => {
    let buyers = await tx.buyerOrder.findMany({
      where: { isCompleted: false },
      orderBy: { createdAt: "asc" },
    });

    let matches = [];

    for (const buyer of buyers) {
      let buyerQty = buyer.buyer_qty;
      while (buyerQty > 0) {
        const seller = await tx.sellerOrder.findFirst({
          where: {
            isCompleted: false,
            seller_price: { lte: buyer.buyer_price },
          },
          orderBy: [{ seller_price: "asc" }, { createdAt: "asc" }],
        });

        if (!seller) break;

        const matchedQty = Math.min(buyerQty, seller.seller_qty);
        const matchedPrice = seller.seller_price;

        await tx.completedOrder.create({
          data: {
            price: matchedPrice,
            qty: matchedQty,
          },
        });

        buyerQty -= matchedQty;
        const sellerRemaining = seller.seller_qty - matchedQty;

        await tx.sellerOrder.update({
          where: { id: seller.id },
          data: {
            seller_qty: sellerRemaining,
            isCompleted: sellerRemaining === 0,
          },
        });

        matches.push({
          buyerId: buyer.id,
          sellerId: seller.id,
          matchedQty,
          matchedPrice,
        });

        if (buyerQty === 0) break;
      }

      await tx.buyerOrder.update({
        where: { id: buyer.id },
        data: {
          buyer_qty: buyerQty,
          isCompleted: buyerQty === 0,
        },
      });
    }

    return { message: "Batch matching completed", matches };
  });
};

export const matchOrders = async (req, res) => {
  try {
    const result = await runOrderMatching();
    res.json(result);
  } catch (err) {
    console.error("Match Error:", err);
    res
      .status(500)
      .json({ error: "Order matching failed", details: err.message });
  }
};
