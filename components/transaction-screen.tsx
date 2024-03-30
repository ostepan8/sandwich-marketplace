import { DatabaseTransaction } from '@/constants/types';
import React from 'react';
import OrderTab from './transaction-tab';

type TransactionProps = {
    data: DatabaseTransaction[];
    removeTransactionById: (id: string) => void
};

const TransactionScreen = ({ data, removeTransactionById }: TransactionProps) => {


    if (data.length === 0) {
        return (
            <div className='flex flex-col items-center mt-6 w-full'>
                <h2>There are no orders right now.</h2>
            </div>
        );
    }

    return (
        <div className='flex flex-col items-center mt-6 w-full gap-4'>
            {data.map((transaction, index) => (
                <OrderTab removeTransactionById={removeTransactionById} key={index} transaction={transaction} />
            ))}
        </div>
    );
};



export default TransactionScreen;
