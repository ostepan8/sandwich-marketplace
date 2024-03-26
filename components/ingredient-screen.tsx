
"use client"
import { subtitle, title } from "@/components/primitives";
import { Dispatch, SetStateAction, useState, } from "react";
import { Card, CardHeader, CardBody, CardFooter, Input, Button, SelectItem, Select, CircularProgress } from "@nextui-org/react";
import { INGREDIENT_DATA, INGREDIENT_TYPES } from "@/constants";
import { MenuAndIngredientProps, Ingredient, MenuItem } from "@/constants/types";
import IngredientTab from "@/components/ingredient-tab";
import { siteConfig } from "@/config/site";
import { insertIngredient } from "@/app/lib/actions/ingredient.actions";

type Props = {
    data: Ingredient[];
    setIngredientData: Dispatch<SetStateAction<Ingredient[]>>;
}

export default function IngredientScreen({ data, setIngredientData, }: Props) {
    const [ingredient, setIngredient] = useState<String | null>(null)
    const [type, setType] = useState<String | null>(null);
    const [inserting, setInserting] = useState(false)
    const addIngredientToDatabase = async () => {
        if (type == null || ingredient == null) {
            return;
        }
        setInserting(true); // Start the inserting process
        try {
            const newIngredient = await insertIngredient({ name: ingredient, type });

            setIngredientData(previousIngredientData => {
                // Assuming newIngredient is the newly added ingredient returned from the API
                // And that previousIngredientData is an array of existing ingredients
                return [newIngredient, ...previousIngredientData];
            });
        } catch (error) {
            alert(`Failed to add ingredient: ${ingredient}`); // Or handle the error in a more user-friendly way
        } finally {
            setInserting(false); // Finish the inserting process
        }
    };
    return (
        <div >
            < Card className=" w-[100%] border-spacing-3  p-6" >
                <CardHeader className="justify-between">
                    <div className="flex">
                        <div className="flex flex-col  items-start justify-center">
                            <h1 className={title()}>{INGREDIENT_DATA.title}</h1>
                        </div>
                    </div>
                </CardHeader>
                <CardBody className="px-3 ">

                    {INGREDIENT_DATA.description && (<div className="flex flex-col items-start justify-center">
                        <h1 className={subtitle()}>{INGREDIENT_DATA.description}</h1>
                    </div>
                    )}
                    <div className="flex flex-1 flex-row h-1/6">
                        <div className="flex flex-1 flex-row h-1/6">
                            <Input
                                onChange={(e) => setIngredient(e.target.value)}
                                variant="underlined"
                                className="h-full flex-grow" // Make the input field flexible to take up available space
                                size="lg"
                                placeholder="turkey, lettuce, tomato, etc"
                                type="form"
                                label="Add more ingredients!"

                            />
                            <div className="flex flex-row h-full items-center ml-4">
                                <div className="flex w-72">
                                    <Select
                                        onChange={(e) => setType(e.target.value)}
                                        variant="underlined"
                                        size="lg"
                                        label="Select a type"
                                        className="max-w-xs"
                                    >
                                        {INGREDIENT_TYPES.map((type: String) => (
                                            <SelectItem key={type.toString()} value={type.toString()}>
                                                {type}
                                            </SelectItem>
                                        ))}
                                    </Select>
                                </div>
                                <Button onPress={addIngredientToDatabase} color={'primary'} className="ml-4">
                                    <div className="p-4">
                                        {!inserting ? "Add" : <CircularProgress size="sm" />}
                                    </div>

                                </Button>
                            </div>
                        </div>
                    </div>
                </CardBody>
                <CardFooter className="w-full justify-between flex-col">
                    {data.map((ingredient: Ingredient) =>
                        <IngredientTab
                            key={ingredient._id.valueOf()}
                            removeIngredient={(id) => setIngredientData(currentIngredients =>
                                currentIngredients.filter(ingredient => ingredient._id !== id)
                            )}
                            data={ingredient}
                        />
                    )}
                </CardFooter>
            </Card >
        </div >
    );
}
