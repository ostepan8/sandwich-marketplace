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

import { changeAvailability } from "@/app/lib/actions/ingredient.actions"; // Import the function

export default function IngredientTab({ data, removeIngredient }: Props) {
    const [available, setAvailable] = useState(data.available);

    const handleAvailabilityChange = async () => {
        try {
            // Call the function to change the availability in the database
            const updatedIngredient = await changeAvailability(data._id.valueOf());
            // Update the local state to reflect the new availability
            setAvailable(updatedIngredient.available);
        } catch (error) {
            console.error('Failed to change ingredient availability:', error);
            // Optionally, inform the user that changing the availability failed
        }
    };

    const deleteIngredientFromDatabase = async () => {
        try {
            await deleteIngredient(data._id.valueOf()); // Make sure this matches how IDs are formatted in your database
            removeIngredient(data._id.valueOf()); // Remove the ingredient from the parent component's state
        } catch (error) {
            console.error('Failed to delete ingredient:', error);
            // Optionally, inform the user that the deletion failed
        }
    };

    return (
        <div className="w-full flex flex-col sm:flex-row py-4">
            <div className="flex-1 flex justify-center items-center ml-auto mr-auto sm:ml-0 sm:mr-0">
                <h1 className={`${title()} text-left`}>{data.name}</h1>
                <h1 className={`${subtitle()} text-left mt-4`}> - {data.type}</h1>
            </div>
            <div className=" flex justify-start sm:justify-center items-center ml-auto mr-auto sm:ml-0 sm:mr-0">
                <div className="pr-6">
                    <h1 className={`${subtitle()} text-left`}>Available</h1>
                    <Switch size={'lg'} isSelected={available.valueOf()} onValueChange={handleAvailabilityChange} />
                </div>
                <Button onPress={deleteIngredientFromDatabase} color={'primary'} className="h-full p-4">Delete</Button>
            </div>
        </div>
    );
}
