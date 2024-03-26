
"use client"
import { subtitle, title } from "@/components/primitives";
import { Dispatch, SetStateAction, useState, } from "react";
import { Card, CardHeader, CardBody, CardFooter, Input, Button, SelectItem, Select, CircularProgress } from "@nextui-org/react";
import { INGREDIENT_DATA, INGREDIENT_TYPES } from "@/constants";
import { MenuAndIngredientProps, Ingredient, MenuItem } from "@/constants/types";
import IngredientTab from "@/components/ingredient-tab";
import { siteConfig } from "@/config/site";

type Props = {
    data: Ingredient[];
    setIngredientData: Dispatch<SetStateAction<Ingredient[]>>;
}

export default function IngredientScreen({ data, setIngredientData, }: Props) {
    const [ingredient, setIngredient] = useState<String | null>(null)
    const [type, setType] = useState<String | null>(null);
    const [inserting, setInserting] = useState(false)
    const addIngredientToDatabase = async () => {
        try {
            setInserting(true)
            const response = await fetch(siteConfig.api + "insert-ingredient", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: ingredient, type }),
            });

            if (response.ok) {
                const data = await response.json();
                setIngredientData(previousIngredientData => {
                    if (data && Array.isArray(previousIngredientData)) {
                        return [data, ...previousIngredientData];
                    }
                    return previousIngredientData; // If conditions are not met, return the previous state.
                });


            } else {
                throw new Error()
            }
        } catch (error) {
            alert(ingredient)
        } finally {
            setInserting(false)
        }

    }
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
                            removeIngredient={(_id) => alert(_id)}
                            data={ingredient}
                        />
                    )}
                </CardFooter>
            </Card >
        </div >
    );
}
