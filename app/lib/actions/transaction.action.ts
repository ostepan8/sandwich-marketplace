"use server";

import { redirect } from "next/navigation";
import Stripe from "stripe";
import { handleError } from "./admin.actions";
import { connectToDatabase } from "../database/mongoose";
import Transaction from "../database/models/transaction.model";
import {
  CartItem,
  DatabaseTransaction,
  GetAllDataToReturn,
  Ingredient,
  ITransaction,
  MenuItem,
} from "@/constants/types";
import IngredientDatabase from "../database/models/ingredient.model";
import MenuItemDatabase from "../database/models/menuitem.model";

export async function checkoutTransaction(transaction: ITransaction) {
  type LineItem = Stripe.Checkout.SessionCreateParams.LineItem;
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const cartItems: CartItem[] = transaction.cartItems; // Assuming cartItems is an array of CartItem
  const lineItems: LineItem[] = [];

  for (let item of cartItems) {
    const lineItem: LineItem = {
      quantity: item.quantity,
      price_data: {
        currency: "usd",
        unit_amount: item.menuItem ? item.menuItem?.basePrice * 100 : undefined,
        product_data: {
          description: item.menuItem?.ingredients
            .map((item) => item.name)
            .join(", "),
          name: item.menuItem?.name.valueOf() || "",
          metadata: {
            name: item.menuItem?.name.valueOf() || "",
            ingredients: item.menuItem
              ? item.menuItem.ingredients.map((item) => item._id).join()
              : "",
          },
        },
      },
    };
    lineItems.push(lineItem);
  }

  const session = await stripe.checkout.sessions.create({
    line_items: lineItems,
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
// Assuming GetAllDataToReturn, MenuItem, Ingredient, and DatabaseTransaction are defined appropriately

export async function getAllData(): Promise<GetAllDataToReturn> {
  try {
    await connectToDatabase();
    const transactions: DatabaseTransaction[] = await Transaction.find({})
      .sort({ completed: 1 })
      .populate("cartItems.ingredients")
      .lean();

    const menuData: MenuItem[] = await MenuItemDatabase.find()
      .populate("ingredients")
      .lean();
    const ingredientData: Ingredient[] = await IngredientDatabase.find().lean();
    return { menuData, ingredientData, transactions };
  } catch (error) {
    handleError(error);
    return { menuData: [], ingredientData: [], transactions: [] };
  }
}
