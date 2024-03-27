/* eslint-disable camelcase */
const { createTransaction } = require("@/app/lib/actions/transaction.action");
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

  // Function to transform line items from the Stripe format to your cart item format
  const transformLineItemsToCartItems = (lineItems) => {
    if (!lineItems) return []; // If lineItems is undefined, return empty array

    // Assuming lineItems.data is the array we need
    return lineItems.data.map((item) => {
      // Here you would map properties of LineItem to fit the CartItem structure
      // Adjust this transformation based on your actual data structures
      return {
        menuItem: {
          _id: item.menuItem ? item.menuItem._id : "",
          name: item.menuItem ? item.menuItem.description : "",
          basePrice: item.menuItem ? item.menuItem.basePrice / 100 : 0, // Assuming Stripe provides amounts in cents
          description: "",
          ingredients: [],
          available: true,
        },
        quantity: item.quantity,
      };
    });
  };

  if (eventType === "checkout.session.completed") {
    const { id, amount_total, metadata, line_items } = event.data.object;
    const transaction = {
      createdAt: new Date(),
      stripeId: id,
      amount: amount_total ? amount_total : 0,
      cartItems: transformLineItemsToCartItems(line_items),
      pickUpTime: metadata ? metadata.pickUpTime : "",
      completed: false,
    };

    const newTransaction = await createTransaction(transaction);

    return NextResponse.json({ message: "OK", transaction: newTransaction });
  }

  return new Response("", { status: 200 });
}

module.exports = { POST };
