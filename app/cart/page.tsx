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
        // Assuming EST is UTC-5. This might need adjustment for daylight saving time.
        const estOffset = -5;
        const nowUtc = new Date(new Date().toUTCString());
        const nowEst = new Date(nowUtc.getTime() + estOffset * 3600 * 1000);

        // Initialize times array
        const times = [];
        const openingTime = adjustDateForTime(nowEst, openTime);
        const closingTime = adjustDateForTime(nowEst, closeTime);

        let currentTime = (nowEst > openingTime) ? nowEst : openingTime;
        currentTime = new Date(currentTime.getTime());
        currentTime.setMinutes(Math.ceil(currentTime.getMinutes() / 15) * 15);

        while (true) {
            // Check if adding 15 minutes would go past the closing time
            if (new Date(currentTime.getTime() + 15 * 60000) > closingTime) {
                break;
            }

            times.push(currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }));

            // Stop the loop if the current time is the last 15-minute interval before closing
            if (new Date(currentTime.getTime() + 15 * 60000) >= closingTime) {
                break;
            }

            // Increment by 15 minutes
            currentTime = new Date(currentTime.getTime() + 15 * 60000);
        }

        return times;
    }

    function adjustDateForTime(referenceDate: Date, timeString: string): Date {
        const adjustedDate = new Date(referenceDate);
        const timeDate = convertTimeStringToDate(timeString);
        adjustedDate.setHours(timeDate.getHours(), timeDate.getMinutes(), 0, 0);
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
