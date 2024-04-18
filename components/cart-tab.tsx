import React, { useState } from 'react';
import { CartItem } from '@/constants/types';
import { subtitle, title } from '@/components/primitives';
import { Button, Select, SelectItem } from '@nextui-org/react';
import { useCart } from '@/context/CartContext';

interface Props {
    item: CartItem,
}

export const CartTab = ({ item }: Props) => {
    const { removeFromCart, updateQuantity } = useCart();
    const [loading, setLoading] = useState(false);
    const [quantity, setQuantity] = useState<number>(item.quantity);
    const [completed, setCompleted] = useState(false);

    const handleDeleteItem = () => {
        setLoading(true);
        setTimeout(() => {
            const itemId = item.menuItem?._id || item.merchItem?._id || "";
            removeFromCart(itemId.toString());
            setLoading(false);
            setCompleted(true);
            setTimeout(() => setCompleted(false), 250);
        }, 100);
    };

    const handleQuantityChange = (number: number) => {
        setQuantity(number);
        const itemId = item.menuItem?._id || item.merchItem?._id || "";
        updateQuantity(itemId.toString(), number);
    };

    // Determine which item type is present and extract the necessary information
    const isMenuItem = Boolean(item.menuItem);
    const itemName = isMenuItem ? item.menuItem?.name : item.merchItem?.name;
    const itemDescription = isMenuItem ? item.menuItem?.description : item.merchItem?.description;
    const itemPrice = isMenuItem ? item.menuItem?.basePrice : item.merchItem?.basePrice;
    const itemIngredients = isMenuItem ? item.menuItem?.ingredients.map(ingredient => ingredient.name).join(', ') : null;

    return (
        <div className="w-full border-b py-4 flex flex-col items-center overflow-hidden p-8">
            <div className="flex flex-col sm:flex-row items-center justify-between w-full">
                <div className="flex flex-row items-start">
                    <h1 className={`${title()} whitespace-nowrap`}>{itemName || ""}</h1>
                </div>
                <div className="flex items-center flex-col sm:flex-row ml-4 w-full">
                    {itemIngredients && (
                        <div className='mx-4 flex-1 flex'>
                            <h1 className={subtitle()}>{itemIngredients}</h1>
                        </div>
                    )}
                    <Select
                        onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
                        selectedKeys={[quantity.toString()]} // Ensure this is a string array and matches the option values
                        label="Quantity"
                        className="max-w-xs mr-4"
                    >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((number) => (
                            <SelectItem key={number} value={number.toString()}>
                                {number.toString()}
                            </SelectItem>
                        ))}
                    </Select>

                    <div className="mr-0 sm:mr-6">
                        <h1 className={subtitle()}>{(itemPrice || 0) * quantity}$</h1>
                    </div>
                    <div>
                        <Button isLoading={loading} onPress={handleDeleteItem} color={completed ? "success" : "danger"}>X</Button>
                    </div>
                </div>
            </div>
            <div className="w-full pt-4">
                <p className="text-left">{itemDescription}</p>
            </div>
        </div>
    );
};
