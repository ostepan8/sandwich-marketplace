"use client"

import React, { useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { MenuItem, CartContextType } from '@/constants/types';
import { subtitle, title } from '@/components/primitives';
import { Switch } from '@nextui-org/switch';
import { Button, Select, SelectItem } from '@nextui-org/react';
import { CartTab } from '@/components/cart-tab';
import Link from 'next/link';
interface CartItem {
    menuItem: MenuItem,
}

const Cart = () => {

    const { cartItems, removeFromCart, updateQuantity }: CartContextType = useCart();
    const totalPrice = cartItems.reduce((total, item) => {
        return total + item.menuItem.basePrice.valueOf() * item.quantity.valueOf();
    }, 0);




    return (
        <div>
            {cartItems.length === 0 ? (
                <h1 className={title()}>Your cart is empty.</h1>
            ) : (
                <>
                    <div className='w-full justify-center flex'>
                        <h1 className={title()}>Your cart</h1>
                    </div>
                    {cartItems.map(item => (
                        <CartTab key={item.menuItem._id.valueOf()} item={item} />
                    ))}
                </>
            )}
            <div className='my-8 w-full flex justify-center'>
                <Link href="/order" passHref>
                    <Button className='p-16 rounded-3xl'>
                        <div>
                            <div><h1 className={title({ size: "sm" })}>Proceed to Checkout</h1></div>
                            <div><h1 className={title({ size: "sm" })}>{totalPrice}$</h1></div>
                        </div>
                    </Button>
                </Link>
            </div>
        </div>
    );
};

export default Cart;
