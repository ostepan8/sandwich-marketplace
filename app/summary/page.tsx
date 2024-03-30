'use client'
import { subtitle, title } from '@/components/primitives';
import { useCart } from '@/context/CartContext';
import React, { useEffect } from 'react';

const Page = () => {
    const { clearCart, cartItems } = useCart()
    useEffect(() => {
        if (cartItems.length > 0) {
            clearCart()
        }

    }, [])

    return (
        <div className='w-[100vw] h-[60vh] p-8 flex flex-col justify-center items-center'>
            {/* Additional wrapper for horizontal centering */}
            <div className='text-center flex flex-col items-center'>
                <h1 className={title()}>Pick up your order at&nbsp;</h1>
                <h1 className={title({ color: "violet" })}>Dewindt Common Room&nbsp;</h1>
                <h1 className={title()}>
                    it will be ready soon!
                </h1>
            </div>
            <h2 className={subtitle({ class: "mt-4 text-center" })}>
                Thanks for ordering!
            </h2>
        </div>
    );
}

export default Page;
