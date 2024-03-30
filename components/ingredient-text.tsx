import { Ingredient } from '@/constants/types'
import React from 'react'
import { subtitle } from './primitives'

type IngredientProps = {
    data: Ingredient[]
}
const IngredientText = ({ data }: IngredientProps) => {
    const ingredients = data.sort((a, b) => {
        if (a.type === "Bread") return -1;
        if (b.type === "Bread") return 1;
        return 0;
    }).map(item => item.name);

    return (
        <div className='flex items-center flex-wrap'>
            <span className="font-bold mr-2">Ingredients - <span className="text-gray-700 font-normal">{ingredients.join(", ")}</span></span>
        </div>
    );
};

export default IngredientText
