/* eslint-disable camelcase */

import mongoose from "mongoose";
const {
  createTransaction,
  updateMerchItems,
} = require("@/app/lib/actions/transaction.action");
const { NextResponse } = require("next/server");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

async function POST(request) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err) {
    return NextResponse.json({ message: "Webhook error", error: err.message });
  }
  // Get the ID and type
  const eventType = event.type;
  if (eventType === "checkout.session.completed") {
    const { id, amount_total, metadata } = event.data.object;
    const line_items = await stripe.checkout.sessions.listLineItems(id, {
      expand: ["data.price.product"],
    });
    const lineData = line_items.data;
    const cartItemData = [];
    const merchItemsBought = [];
    for (let i = 0; i < lineData.length; i++) {
      const itemMetaData = lineData[i].price.product.metadata;
      if (itemMetaData.type == "menu") {
        const ingredients = itemMetaData.ingredients;
        const ingredientIdArray = ingredients
          .split(",")
          .map((item) => new mongoose.Types.ObjectId(item));
        cartItemData.push({
          ingredients: ingredientIdArray,
          name: itemMetaData.name,
          quantity: lineData[i].quantity,
          type: "menu",
        });
      } else if (itemMetaData.type == "merch") {
        cartItemData.push({
          size: itemMetaData.size,
          name: itemMetaData.name,
          quantity: lineData[i].quantity,
          type: "merch",
        });
        merchItemsBought.push({
          size: itemMetaData.size,
          quantity: lineData[i].quantity,
          name: itemMetaData.name,
        });
      }
    }
    const session = await stripe.checkout.sessions.retrieve(id);

    const transaction = {
      createdAt: new Date(),
      stripeId: id,
      amount: amount_total ? amount_total : 0,
      cartItems: cartItemData,
      pickUpTime: metadata ? metadata.pickUpTime : "",
      completed: false,
      name: session.customer_details.name,
      email: session.customer_details.email,
    };
    const newTransaction = await createTransaction(transaction);
    await updateMerchItems(merchItemsBought);

    return NextResponse.json({ message: "OK", transaction: newTransaction });
  }
  return new Response("", { status: 200 });
}

module.exports = { POST };
