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

  if (eventType === "checkout.session.completed") {
    const { id, amount_total, metadata } = event.data.object;
    const lineItems = await stripe.checkout.sessions.listLineItems(id);
    console.log(lineItems);
    console.log(lineItems.data);
    const transaction = {
      createdAt: new Date(),
      stripeId: id,
      amount: amount_total ? amount_total : 0,
      cartItems: lineItems.data.map((item) => {
        return {
          menuItem: {
            _id: "",
            name: "",
            description: "",
            ingredients: [],
            available: false,
          },
          quantity: item.quantity,
        };
      }),
      pickUpTime: metadata ? metadata.pickUpTime : "",
      completed: false,
    };

    const newTransaction = await createTransaction(transaction);

    return NextResponse.json({ message: "OK", transaction: newTransaction });
  }

  return new Response("", { status: 200 });
}

module.exports = { POST };