"use client"
import React, { useState } from 'react';
import { CartItem } from '@/constants/types';
import { subtitle, title } from '@/components/primitives';
import { Button, Select, SelectItem } from '@nextui-org/react';
import { useCart } from '@/context/CartContext';
interface Props {
    item: CartItem,
}

export const CartTab = ({ item }: Props) => {
    const { removeFromCart, updateQuantity } = useCart()
    const [loading, setLoading] = useState(false)
    const [quantity, setQuantity] = useState<Number>(item.quantity)
    const [completed, setCompleted] = useState(false)
    const handleDeleteItem = () => {
        setLoading(true)
        setTimeout(() => {
            removeFromCart(item.menuItem._id.valueOf())
            setLoading(false);
            setCompleted(true)
            setTimeout(() => {
                setCompleted(false)
            }, 250)
        }, 100)

    }
    const handleQuantityChange = (number: Number) => {
        setQuantity(number)
        updateQuantity(item.menuItem._id.valueOf(), number.valueOf())

    }
    const ingredientsList = item.menuItem.ingredients.map(ingredient => ingredient.name).join(', ');

    return <div className="w-full border-b py-4 flex flex-col items-center">
        <div className="flex items-center justify-between w-full">
            <div className="flex flex-row items-center">
                <h1 className={`${title()} mr-2`}>{item.menuItem.name}</h1>
            </div>
            <div className="flex items-center ml-6 w-full ">
                <div className='mx-4 flex-1 flex'>
                    <h1 className={subtitle()}>{ingredientsList.split("")}</h1>
                </div>
                <Select
                    onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
                    selectedKeys={[`${quantity}`]}
                    label="Quantity"
                    className="max-w-xs mr-4"
                >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((number) => (
                        <SelectItem key={number} value={number.toString()}>
                            {number.toString()}
                        </SelectItem>
                    ))}
                </Select>
                <div className="mr-6">
                    <h1 className={subtitle()}>{(item.menuItem.basePrice.valueOf() * item.quantity.valueOf()).toString()}$</h1>
                </div>
                <div>
                    <Button isLoading={loading} onPress={handleDeleteItem} color={completed ? "success" : "danger"}>X</Button>
                </div>
            </div>
        </div>
        <div className="w-full pt-4">
            <p className="text-left">{item.menuItem.description}</p>
        </div>
    </div>

};