"use client"
import React, { useState, FormEvent } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
    Elements,
    CardElement,
    useStripe,
    useElements,
    ElementsConsumer,
} from '@stripe/react-stripe-js';
import { useRouter } from 'next/router';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

const CheckoutForm: React.FC = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();

        if (!stripe || !elements) {
            // Stripe.js has not loaded yet. Make sure to disable form submission until Stripe.js has loaded.
            return;
        }

        setLoading(true);

        const cardElement = elements.getElement(CardElement);

        if (cardElement) {
            const result = await stripe.createPaymentMethod({
                type: 'card',
                card: cardElement,
            });

            if (result.error) {
                setError(result.error.message || 'An unknown error occurred');
                setLoading(false);
            } else {
                // Handle successful creation of the PaymentMethod here.
                // You can send result.paymentMethod.id to your server to create a charge, or attach it to a customer.
                console.log(result.paymentMethod.id);
                setLoading(false);
                // Further processing like clearing form, showing success message, etc.
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} >
            <CardElement />
            <button type="submit" disabled={!stripe || loading} >
                Pay
            </button>
            {error && <div >{error}</div>}
        </form>
    );
};

const InjectedCheckoutForm: React.FC = () => (
    <Elements stripe={stripePromise}>
        <ElementsConsumer>
            {({ stripe }) => {
                if (!stripe) {
                    return <div>Loading...</div>;
                }
                return <CheckoutForm />;
            }}
        </ElementsConsumer>
    </Elements>
);

export default InjectedCheckoutForm;
