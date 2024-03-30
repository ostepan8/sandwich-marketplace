"use client"

import React, { useEffect, useState } from 'react';
import { useCart } from '../../context/CartContext';
import { CartContextType } from '@/constants/types';
import { subtitle, title } from '@/components/primitives';
import { Button, Checkbox, CheckboxGroup, Input, Select, SelectItem } from '@nextui-org/react';
import { CartTab } from '@/components/cart-tab';
import { loadStripe } from '@stripe/stripe-js';
import { checkoutTransaction } from '../lib/actions/transaction.action';
import { getCurrentSettings } from '../lib/actions/settings.actions';


const Cart = () => {

    const [pickUpTime, setPickUpTime] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [added, setAdded] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [openTime, setOpenTime] = useState<string>("")
    const [closeTime, setCloseTime] = useState<string>("")
    useEffect(() => {
        loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
        async function helper() {
            const currentSettings = await getCurrentSettings()
            setOpenTime(currentSettings.openTime)
            setCloseTime(currentSettings.closeTime)
        }
        helper()
    }, []);
    function convertTimeStringToDate(timeString: string) {
        const [time, period] = timeString.split(' ');
        let [hours, minutes] = time.split(':').map(Number);

        // Adjust hours for PM times
        if (period === 'PM' && hours < 12) hours += 12;
        if (period === 'AM' && hours === 12) hours = 0; // Midnight adjustment

        const date = new Date();
        date.setHours(hours, minutes, 0, 0);
        return date;
    }
    const openDateTime = convertTimeStringToDate(openTime);
    const closeDateTime = convertTimeStringToDate(closeTime);
    const now = new Date();

    const isOpen = (now >= openDateTime && now <= closeDateTime);

    const { cartItems, removeFromCart, clearCart }: CartContextType = useCart();
    const totalPrice = cartItems.reduce((total, item) => {
        const basePrice = typeof item.menuItem?.basePrice === 'number' ? item.menuItem.basePrice : 0;
        const quantity = typeof item.quantity === 'number' ? item.quantity : 0;

        return total + basePrice * quantity;
    }, 0);


    const handleCheckout = async () => {
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


    function generateTimeIntervals(openTime: string, closeTime: string) {
        const estOffset = -5; // Adjust for Eastern Standard Time; consider daylight saving time as needed.
        const now = new Date();
        // Ensure we're working with EST by adjusting from UTC.
        const nowEst = new Date(now.getTime() + (now.getTimezoneOffset() * 60000) + (estOffset * 3600000));

        const times = []; // This will store our time intervals.
        // Convert the open and close times to Date objects on the current EST date.
        const openingTime = adjustDateForTime(nowEst, openTime);
        const closingTime = adjustDateForTime(nowEst, closeTime);

        // Start from the later of now or the opening time.
        let currentTime = new Date(Math.max(nowEst, openingTime));
        // Round up to the next 15-minute mark. This avoids infinite loops by ensuring we always advance.
        currentTime.setMinutes(Math.ceil(currentTime.getMinutes() / 15) * 15, 0, 0);

        while (currentTime < closingTime) {
            // Before adding the time, ensure we're not adding a slot that's too late.
            if (new Date(currentTime.getTime() + 15 * 60000) > closingTime) {
                break;
            }

            times.push(currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }));

            // Increment by 15 minutes for the next iteration.
            currentTime = new Date(currentTime.getTime() + 15 * 60000);
        }

        return times;
    }

    function adjustDateForTime(referenceDate: Date, timeString: string): Date {
        // The convertTimeStringToDate function needs to properly adjust the reference date's time.
        const [time, period] = timeString.split(' ');
        let [hours, minutes] = time.split(':').map(Number);

        if (period === 'PM' && hours < 12) hours += 12;
        if (period === 'AM' && hours === 12) hours = 0;

        const adjustedDate = new Date(referenceDate);
        adjustedDate.setHours(hours, minutes, 0, 0);
        return adjustedDate;
    }


    const times = generateTimeIntervals(openTime, closeTime)






    return (
        <div className='flex flex-1 flex-col p-8'>
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
                    <div className="flex justify-center items-center space-x-4 w-[80%] sm:w-1/2 ml-auto mr-auto"> {/* This line ensures horizontal layout and spacing */}
                        <CheckboxGroup onChange={() => setPickUpTime("Now")} isDisabled={!isOpen} label="Choose Pick Up Time" orientation="horizontal" color="secondary"
                            defaultValue={[isOpen ? "now" : "input"]}>
                            <Checkbox value="now">Now</Checkbox>
                        </CheckboxGroup>

                        <Select onChange={(event) => setPickUpTime(times.filter(item => item === event.target.value)[0])} value="input" label={`Only open ${openTime} - ${closeTime} EST`}>
                            {times.map((time) => (
                                <SelectItem key={time} value={time}>{time}</SelectItem>
                            ))}
                        </Select>
                    </div>
                </div>}
                {cartItems.length > 0 && <Button color={added ? "success" : "primary"}
                    onClick={() => {
                        if (pickUpTime == "") {
                            setErrorMessage("Select a time to pick up your food.")
                            return
                        }
                        setIsLoading(true); // Turn on loading
                        setTimeout(() => {
                            handleCheckout();
                            setIsLoading(false);
                            setAdded(true)
                            setTimeout(() => {
                                setAdded(false);
                            }, 400);

                        }, 100);


                    }} className='mt-4 p-16 rounded-3xl w-1/2'> {/* Adjusted margins and paddings as needed */}
                    <div>
                        <div><h1 className="text-md lg:text-xl">Proceed to Checkout</h1></div>
                        <div><h1 className={"text-md lg:text-xl"}>{totalPrice}$</h1></div>
                    </div>
                </Button>}
                {errorMessage && <div>
                    <h1 className={"text-red-500"}>{errorMessage}</h1>
                </div>}
            </div>

        </div>
    );
};

export default Cart;
