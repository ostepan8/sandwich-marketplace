"use client"

import React, { useEffect, useState } from 'react';
import { useCart } from '../../context/CartContext';
import { CartContextType } from '@/constants/types';
import { subtitle, title } from '@/components/primitives';
import { Button, Checkbox, CheckboxGroup, Input, Select, SelectItem } from '@nextui-org/react';
import { CartTab } from '@/components/cart-tab';
import { loadStripe } from '@stripe/stripe-js';
import { checkoutTransaction } from '../lib/actions/transaction.action';


type Props = {
    pickUpTime: string
}
const Cart = () => {
    const [pickUpTime, setPickUpTime] = useState("")
    useEffect(() => {
        loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
    }, []);

    const { cartItems, removeFromCart, updateQuantity }: CartContextType = useCart();
    const totalPrice = cartItems.reduce((total, item) => {
        const basePrice = typeof item.menuItem?.basePrice === 'number' ? item.menuItem.basePrice : 0;
        const quantity = typeof item.quantity === 'number' ? item.quantity : 0;

        return total + basePrice * quantity;
    }, 0);


    const handleCheckout = async ({ pickUpTime }: Props) => {
        const transcation = {
            createdAt: new Date(),
            stripeId: '',
            amount: totalPrice,
            cartItems: cartItems,
            pickUpTime: pickUpTime,
            completed: false
        }
        checkoutTransaction(transcation)
    };
    const times: string[] = [];
    for (let hour = 17; hour <= 19; hour++) { // 24-hour format for hours 5 PM to 7 PM
        for (let minute = 0; minute < 60; minute += 15) { // Every 15 minutes
            // Convert 24-hour time to 12-hour format
            const hour12 = hour > 12 ? hour - 12 : hour;
            const timeString = `${hour12}:${minute.toString().padStart(2, '0')} PM`;

            // Only add times up to 7:00 PM
            if (!(hour === 19 && minute > 0)) {
                times.push(timeString);
            }
        }
    }
    const easternTime = new Date().toLocaleString("en-US", { timeZone: "America/New_York" });
    const easternDate = new Date(easternTime);

    // Extract hours from the Eastern Time
    const hours = easternDate.getHours();

    // Check if the time is between 5 PM (17) and 7 PM (19) inclusive
    const isBetween5and7 = hours >= 17 && hours < 19;

    return (
        <div>
            {cartItems.length === 0 ? (
                <h1 className={title()}>Your cart is empty.</h1>
            ) : (
                <>
                    <div className='w-full justify-center flex'>
                        <h1 className={title()}>Your cart</h1>
                    </div>
                    {cartItems.map((item) => (
                        item.menuItem ? (
                            <CartTab key={item.menuItem._id.toString()} item={item} />
                        ) : (
                            null
                        )
                    ))}
                </>
            )}
            <div className='my-8 w-full flex justify-center items-center flex-col'>
                {cartItems.length > 0 && <div className="w-full">


                    <div className="flex justify-center items-center space-x-4 w-1/2 ml-auto mr-auto"> {/* This line ensures horizontal layout and spacing */}

                        <CheckboxGroup onChange={() => setPickUpTime("Now")} isDisabled={!isBetween5and7} label="Choose Pick Up Time" orientation="horizontal" color="secondary"
                            defaultValue={[isBetween5and7 ? "now" : "input"]}>
                            <Checkbox value="now">Now</Checkbox>
                        </CheckboxGroup>

                        <Select onChange={(event) => setPickUpTime(times.filter(item => item === event.target.value)[0])} value="input" label="Only open 5pm-7pm)">
                            {times.map((time) => (
                                <SelectItem key={time} value={time}>{time}</SelectItem>
                            ))}
                        </Select>
                    </div>
                </div>}
                {cartItems.length > 0 && <Button onClick={() => handleCheckout({ pickUpTime })} className='mt-4 p-16 rounded-3xl w-1/2'> {/* Adjusted margins and paddings as needed */}
                    <div>
                        <div><h1 className={title({ size: "sm" })}>Proceed to Checkout</h1></div>
                        <div><h1 className={title({ size: "sm" })}>{totalPrice}$</h1></div>
                    </div>
                </Button>}
            </div>

        </div>
    );
};

export default Cart;
