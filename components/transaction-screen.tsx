import { DatabaseTransaction } from '@/constants/types';
import React from 'react';
import { title } from './primitives';
import { Card, CardBody, CardHeader } from '@nextui-org/react';

type TransactionProps = {
    data: DatabaseTransaction[];
};

const TransactionScreen = ({ data }: TransactionProps) => {
    const currencyFormatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });
    console.log(data[0])

    const dateFormatter = new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        month: 'long',
        day: 'numeric',
        hour12: true,
    });

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
                                <li key={itemIndex} className='list-disc ml-4'>
                                    {item.name} - Quantity: {item.quantity}
                                </li>
                            ))}
                        </ul>
                    </CardBody>
                </Card>
            ))}
        </div>
    );
};

export default TransactionScreen;

