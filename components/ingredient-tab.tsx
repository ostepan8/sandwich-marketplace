"use client"
import { title, subtitle } from "@/components/primitives";
import { siteConfig } from "@/config/site";
import { Ingredient } from "@/constants/types";
import { Switch, Button } from "@nextui-org/react";
import { deleteIngredient } from "@/app/lib/actions/ingredient.actions";
import { useState } from "react";
interface Props {
    data: Ingredient
    removeIngredient: (id: string) => void;
}


export default function IngredientTab({ data, removeIngredient }: Props) {
    const bool = data.available ? true : false
    const [available, setAvailable] = useState(bool)
    const deleteIngredientFromDatabase = async () => {
        deleteIngredient(data._id.valueOf())
    }


    return (
        <div className="w-full flex flex-row py-4">
            <div className="flex-1 flex justify-center items-center">

                <h1 className={`${title()} text-left mr-6`}>{data.name}</h1>
                <h1 className={`${subtitle()} text-left mt-4`}>-{data.type}</h1>

            </div>
            <div className="ml-auto flex justify-center items-center">
                <div className="pr-6">
                    <h1 className={`${subtitle()} text-left`}>Available</h1>
                    <Switch size={'lg'} isSelected={available} onValueChange={setAvailable} />
                </div>

                <Button onPress={deleteIngredientFromDatabase} color={'primary'} className="h-full">Delete</Button>
            </div>
        </div>

    );
}
