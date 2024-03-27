"use server";

import { redirect } from "next/navigation";
import Stripe from "stripe";
import { handleError } from "./admin.actions";
import { connectToDatabase } from "../database/mongoose";
import Transaction from "../database/models/transaction.model";
import { CartItem, ITransaction } from "@/constants/types";
import Ingredient from "../database/models/ingredient.model";
import MenuItem from "../database/models/menuitem.model";

export async function checkoutTransaction(transaction: ITransaction) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  function createLineItem(item: CartItem) {
    const name: string = item.menuItem
      ? item.menuItem.name.valueOf()
      : item.customDetails
      ? item.customDetails.name
      : "name";
    const itemAmount: number = item.menuItem
      ? item.menuItem.basePrice * 100
      : item.customDetails
      ? item.customDetails.price * 100
      : 0;
    return {
      price_data: {
        currency: "usd",
        unit_amount: itemAmount,
        product_data: {
          name: name,
        },
      },
      quantity: item.quantity,
    };
  }
  const session = await stripe.checkout.sessions.create({
    line_items: transaction.cartItems.map((item) => createLineItem(item)),
    metadata: {
      pickUpTime: transaction.pickUpTime,
    },
    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/summary`,
    cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/cart`,
  });

  redirect(session.url!);
}

export async function createTransaction(transaction: ITransaction) {
  try {
    await connectToDatabase();
    // Create a new transaction with a buyerId
    const newTransaction = await Transaction.create(transaction);
    return JSON.parse(JSON.stringify(newTransaction));
  } catch (error) {
    handleError(error);
  }
}
export async function getTransactions() {
  // Removed parameter as it seems unused based on provided context
  try {
    await connectToDatabase();
    // Create a new transaction with a buyerId
    const transactions = await Transaction.find({}).sort({ completed: 1 }); // Sorting by 'completed': false values first
    return JSON.parse(JSON.stringify(transactions));
  } catch (error) {
    handleError(error);
  }
}
export async function getAllData() {
  try {
    await connectToDatabase();
    // Create a new transaction with a buyerId
    const transactions = await Transaction.find({}).sort({ completed: 1 }); // Sorting by 'completed': false values first
    const menuData = await MenuItem.find().populate("ingredients");
    const ingredientData = await Ingredient.find();
    return JSON.parse(
      JSON.stringify({ menuData, ingredientData, transactions })
    );
  } catch (error) {
    handleError(error);
  }
}
