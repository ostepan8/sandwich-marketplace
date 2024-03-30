import { DatabaseTransaction } from '@/constants/types';
import React from 'react';
import { Card, CardBody, CardHeader } from '@nextui-org/react';
import IngredientText from './ingredient-text';

type TransactionProps = {
    data: DatabaseTransaction[];
};

const TransactionScreen = ({ data }: TransactionProps) => {
    const currencyFormatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });

    const dateFormatter = new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        month: 'long',
        day: 'numeric',
        hour12: true,
    });

    if (data.length === 0) {
        return (
            <div className='flex flex-col items-center mt-6 w-full'>
                <h2>There are no orders right now.</h2>
            </div>
        );
    }

    return (
        <div className='flex flex-col items-center mt-6 w-full'>
            {data.map((transaction, index) => (
                <Card key={index} className='mb-4 w-full max-w-xl px-5 py-3'>
                    <CardHeader className='flex justify-between items-center'>
                        <div>
                            <h2 className='text-lg'>Ordered At: {dateFormatter.format(new Date(transaction.createdAt))}</h2>
                            <h2 className='text-lg'>Pick Up Time: {transaction.pickUpTime}</h2>
                        </div>
                        <div>
                            <h2 className='text-lg'>{currencyFormatter.format(transaction.amount / 100)}</h2>
                        </div>
                    </CardHeader>
                    <CardBody>
                        <h3 className='text-md font-semibold mb-2'>Order Details</h3>
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
                    </CardBody>
                </Card>
            ))}
        </div>
    );
};

export default TransactionScreen;
