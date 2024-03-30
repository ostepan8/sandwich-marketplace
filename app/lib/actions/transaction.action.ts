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

export async function getAllData(): Promise<GetAllDataToReturn> {
  try {
    await connectToDatabase();
    const transactions: DatabaseTransaction[] = await Transaction.aggregate([
      {
        $lookup: {
          from: "ingredients",
          localField: "cartItems.ingredients",
          foreignField: "_id",
          as: "cartItemsPopulated",
        },
      },
      {
        $addFields: {
          cartItems: {
            $map: {
              input: "$cartItems",
              as: "item",
              in: {
                $mergeObjects: [
                  "$$item",
                  {
                    ingredients: {
                      $filter: {
                        input: "$cartItemsPopulated",
                        as: "ingredient",
                        cond: {
                          $in: ["$$ingredient._id", "$$item.ingredients"],
                        },
                      },
                    },
                  },
                ],
              },
            },
          },
        },
      },
    ]);
    const uncompletedItems = transactions.filter((item) => !item.completed);
    const completedItems = transactions.filter((item) => item.completed);
    const convertTimeToMinutes = (timeString: string) => {
      if (timeString === "Now") {
        return -1; // Special value for "Now" to prioritize it in sorting
      }

      const [time, modifier] = timeString.split(" ");
      let [hours, minutes] = time.split(":").map(Number);

      // Adjust for PM times not being "12", to convert to 24-hour format
      if (modifier === "PM" && hours !== 12) {
        hours += 12;
      } else if (modifier === "AM" && hours === 12) {
        hours = 0; // Adjust for midnight being represented as "12:00 AM"
      }

      // Calculate total minutes from 0:00 to handle sorting accurately
      return hours * 60 + minutes;
    };

    const sortedItems = uncompletedItems.sort((a, b) => {
      const minutesA = convertTimeToMinutes(a.pickUpTime);
      const minutesB = convertTimeToMinutes(b.pickUpTime);
      const createdAtA = new Date(a.createdAt).getTime();
      const createdAtB = new Date(b.createdAt).getTime();

      // Handle both "Now" to sort by createdAt
      if (minutesA === -1 && minutesB === -1) {
        return createdAtA - createdAtB;
      }
      // Prioritize "Now" for item A
      else if (minutesA === -1) {
        return -1;
      }
      // Prioritize "Now" for item B (corrected to return 1)
      else if (minutesB === -1) {
        return 1;
      }

      // Primary comparison by pickUpTime when not "Now"
      if (minutesA !== minutesB) {
        return minutesA - minutesB;
      }

      // Secondary comparison by createdAt when pickUpTime is equal
      return createdAtA - createdAtB;
    });

    const menuData: MenuItem[] = await MenuItemDatabase.find()
      .populate("ingredients")
      .lean();
    const ingredientData: Ingredient[] = await IngredientDatabase.find().lean();
    return {
      menuData,
      ingredientData,
      transactions: [...sortedItems, ...completedItems],
    };
  } catch (error) {
    handleError(error);
    return { menuData: [], ingredientData: [], transactions: [] };
  }
}
export async function completeTransaction(_id: string, bool: boolean) {
  try {
    await connectToDatabase();
    const updatedTransaction = await Transaction.findOneAndUpdate(
      { _id: _id },
      { $set: { completed: bool } },
      { new: true }
    );

    return JSON.parse(JSON.stringify(updatedTransaction));
  } catch (error) {
    handleError(error);
  }
}
export async function handleRemove(_id: string) {
  try {
    await connectToDatabase();
    const deletedTransaction = await Transaction.findOneAndDelete({ _id: _id });
    return JSON.parse(JSON.stringify(deletedTransaction));
  } catch (error) {
    handleError(error);
  }
}
