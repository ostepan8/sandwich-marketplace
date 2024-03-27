import { ITransaction } from '@/constants/types';
import React from 'react';
import { title } from './primitives';
import { Card, CardBody, CardHeader } from '@nextui-org/react';

type TransactionProps = {
    data: ITransaction[];
};

const TransactionScreen = ({ data }: TransactionProps) => {
    const options: Intl.DateTimeFormatOptions = {
        hour: 'numeric',
        minute: 'numeric',
        month: 'long',
        day: 'numeric',
        hour12: true,
    };

    return (
        <div className='w-full justify-center align-center flex mt-6'>
            {data.map((item, index) => {
                // Ensure createdAt is a Date object
                const date = new Date(item.createdAt);
                return (
                    <Card key={index} className='w-1/2 md:w-1/4 mx-10'> {/* Add a key for each item */}
                        <CardHeader className='w-full flex flex-row'>
                            <div>
                                <h1>{new Intl.DateTimeFormat('en-US', options).format(date)}</h1>
                            </div>
                            <div className='ml-auto'>
                                <h1>{item.amount / 100}$</h1>
                            </div>
                        </CardHeader>
                        <div>
                            <h1 className={title()}>{item.pickUpTime}</h1>
                        </div>
                        <CardBody>
                            <h1>Order</h1>
                            {item.cartItems.map((item, index) => {
                                return (
                                    <div key={index}>
                                        <h1>
                                            {index + 1}. {item.menuItem?.name}
                                        </h1>
                                        <h2>
                                            {item.menuItem?.ingredients.join()}
                                        </h2>
                                    </div>
                                )
                            })}


                        </CardBody>
                    </Card>
                );
            })}
        </div>
    );
};

export default TransactionScreen;
