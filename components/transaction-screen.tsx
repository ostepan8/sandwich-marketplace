import { DatabaseTransaction } from '@/constants/types';
import React from 'react';
import { Card, CardBody, CardFooter, CardHeader, Switch } from '@nextui-org/react';
import IngredientText from './ingredient-text';
import OrderTab from './transaction-tab';

type TransactionProps = {
    data: DatabaseTransaction[];
};

const TransactionScreen = ({ data }: TransactionProps) => {


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
                <OrderTab transaction={transaction} index={index} />
            ))}
        </div>
    );
};



export default TransactionScreen;
