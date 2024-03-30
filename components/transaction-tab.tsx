"use client"
import { DatabaseTransaction } from '@/constants/types';
import React, { useState } from 'react';
import { Card, Switch } from '@nextui-org/react';
import IngredientText from './ingredient-text';
import { completeTransaction } from '@/app/lib/actions/transaction.action';


type Props = {
    transaction: DatabaseTransaction

}
const OrderTab = ({ transaction }: Props) => {
    const currencyFormatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });

    const dateFormatter = new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour12: true,
    });
    const [completed, setCompleted] = useState(transaction.completed)
    const handleComplete = async (completedBool: boolean) => {
        await completeTransaction(transaction._id, completedBool);
        setCompleted(completedBool)

    };
    return (
        <Card className='w-full max-w-xl px-5 py-3'>

            <div className='flex justify-between items-center'>
                <div>
                    <h2 className='text-lg'>Ordered: {dateFormatter.format(new Date(transaction.createdAt))}</h2>
                    <h2 className='text-lg'>Pick Up Time: {transaction.pickUpTime}</h2>
                </div>
                <div>
                    <h2 className='text-lg'>{currencyFormatter.format(transaction.amount / 100)}</h2>
                </div>
            </div>
            <div className='flex flex-col justify-start w-full my-4'>
                <h1 className='font-bold'>email: {transaction.email}</h1>
                <h1 className='font-bold'>email: {transaction.name}</h1>
            </div>



            <h3 className='text-md font-semibold'>Order Details</h3>
            <ul>
                {transaction.cartItems.map((item, itemIndex) => (
                    <React.Fragment key={itemIndex}>
                        <li className='list-disc ml-4'>
                            {item.name} - Quantity: {item.quantity}
                        </li>
                        <li>
                            <IngredientText data={item.ingredients} />
                        </li>
                    </React.Fragment>
                ))}
            </ul>


            <div className='w-full flex justify-center align-center mt-4'>
                <Switch
                    isSelected={completed}
                    onValueChange={(e) => handleComplete(e)}
                >
                    <h1 className='font-bold'>Completed Order</h1>
                </Switch>
            </div>


        </Card>
    )
}

export default OrderTab
