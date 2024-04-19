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
    const [times, setTimes] = useState<string[]>([])
    const { cartItems, removeFromCart, clearCart }: CartContextType = useCart();
    useEffect(() => {
        loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
        async function helper() {
            const currentSettings = await getCurrentSettings();
            setOpenTime(currentSettings.openTime);
            setCloseTime(currentSettings.closeTime);
        }

        helper();
    }, []);

    useEffect(() => {
        const times2 = generateTimeIntervals(openTime, closeTime);
        setTimes(times2);
    }, [openTime, closeTime]);
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

    const totalPrice = cartItems.reduce((total, item) => {
        // Determine the base price based on the type of item
        const basePrice = item.menuItem
            ? (typeof item.menuItem.basePrice === 'number' ? item.menuItem.basePrice : 0)
            : (item.merchItem && typeof item.merchItem?.basePrice === 'number' ? item.merchItem.basePrice : 0);

        // Ensure the quantity is a number
        const quantity = typeof item.quantity === 'number' ? item.quantity : 0;

        // Calculate subtotal for the current item and add to the total
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
    function generateTimeIntervals(startTime: string, endTime: string): string[] {
        const intervals: string[] = [];

        const parseTime = (time: string): Date => {
            const [hour, minute, period] = time.split(/:|\s/);
            const date = new Date();
            const parsedHour = parseInt(hour);
            const parsedMinute = parseInt(minute);
            let parsedPeriod = period ? period.toUpperCase() : 'AM';

            if (parsedPeriod === 'PM' && parsedHour !== 12) {
                date.setHours(parsedHour + 12);
            } else if (parsedPeriod === 'AM' && parsedHour === 12) {
                date.setHours(0);
            } else {
                date.setHours(parsedHour);
            }

            date.setMinutes(parsedMinute);
            return date;
        };

        const formatTime = (date: Date): string => {
            const hour = date.getHours();
            const minute = date.getMinutes();
            const period = hour >= 12 ? 'PM' : 'AM';
            const formattedHour = hour % 12 || 12;
            const formattedMinute = minute < 10 ? '0' + minute : minute;
            return `${formattedHour}:${formattedMinute} ${period}`;
        };

        const start = parseTime(startTime);
        let end = parseTime(endTime);

        // If end time is earlier than start time, assume it's the next day
        if (end <= start) {
            end.setDate(end.getDate() + 1);
        }

        let current = start;
        while (current < end) {
            intervals.push(formatTime(current));
            current = new Date(current.getTime() + 15 * 60000); // Add 15 minutes
        }

        return intervals;
    }


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
                        item.menuItem || item.merchItem ? (
                            <CartTab key={item.menuItem?._id.toString() || item.merchItem?._id} item={item} />
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
