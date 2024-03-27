"use client"
import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardBody, CardFooter, Avatar, Button, Select, SelectItem, CheckboxGroup, Checkbox } from "@nextui-org/react";
import { Ingredient, MenuItem, MenuItemProps } from "@/constants/types";
import { subtitle, title, } from "./primitives";
import { INGREDIENT_TYPES } from "@/constants";
import { getMenuAndIngredientData } from "@/app/lib/actions/menu.actions";
type MenuAndIngredientData = {
    ingredientData: Ingredient[],
    menuData: MenuItem[]
}
export default function CustomOrderCard() {
    const [breadItems, setBreadItems] = useState<Ingredient[]>([]);
    const [cheeseItems, setCheeseItems] = useState<Ingredient[]>([]);
    const [meatItems, setMeatItems] = useState<Ingredient[]>([]);
    const [toppingItems, setToppingItems] = useState<Ingredient[]>([]);
    const [sauceItems, setSauceItems] = useState<Ingredient[]>([]);
    const name = "Customize Sandwich"
    const [newSandwichData, setNewSandwichData] = useState({
        name: '',
        description: '',
        basePrice: 0,
        available: true,
        _id: '',
        ingredients: []
    })
    const [newSandwichIngredients, setNewSandwichIngredients] = useState<Ingredient[]>([]);
    const handleIngredientChange = (selectedIngredient: Ingredient) => {
        setNewSandwichIngredients((currentIngredients) => {
            // Check if the ingredient is already selected
            const isAlreadySelected = currentIngredients.some(ingredient => ingredient.name === selectedIngredient.name);
            if (isAlreadySelected) {
                // Remove the ingredient if it's already selected
                return currentIngredients.filter(ingredient => ingredient.name !== selectedIngredient.name);
            } else {
                // Add the ingredient if it's not already selected
                return [...currentIngredients, selectedIngredient];
            }
        });
    };
    async function getIngredientData() {
        const { menuData, ingredientData }: MenuAndIngredientData = await getMenuAndIngredientData();
        const tempBreadItems: Ingredient[] = [];
        const tempCheeseItems: Ingredient[] = [];
        const tempMeatItems: Ingredient[] = [];
        const tempToppingItems: Ingredient[] = [];
        const tempSauceItems: Ingredient[] = [];
        ingredientData.forEach((ingredient) => {
            switch (ingredient.type) {
                case "Bread":
                    tempBreadItems.push(ingredient);
                    break;
                case "Cheese":
                    tempCheeseItems.push(ingredient);
                    break;
                case "Meat":
                    tempMeatItems.push(ingredient);
                    break;
                case "Topping":
                    tempToppingItems.push(ingredient);
                    break;
                case "Sauce":
                    tempSauceItems.push(ingredient);
                    break;

            }
        });
        setBreadItems(tempBreadItems);
        setCheeseItems(tempCheeseItems);
        setMeatItems(tempMeatItems);
        setToppingItems(tempToppingItems);
        setSauceItems(tempSauceItems);
    }

    useEffect(() => {
        getIngredientData()
    }, []);

    return (
        <Card className="w-[100%]">
            <CardHeader className="justify-between">
                <div className="flex">
                    <div className="flex flex-col  items-start justify-center">
                        <h1 className={title()}>{name}</h1>

                    </div>
                </div>
                <div>
                    <h4 className={title()}>{"12$"}</h4>
                </div>
            </CardHeader>
            <CardBody className="px-3 py-0 text-small text-default-400">
                <div className="flex flex-col md:flex-row md:flex-wrap md:justify-between h-full">
                    {INGREDIENT_TYPES.map((type: String) => (
                        (type === "Bread") ?
                            <div key={type.valueOf()} className="flex-1 min-w-[200px] max-w-xs md:max-w-none py-4 px-2 md:px-4">
                                <Select
                                    onChange={(e) => console.log(e.target.value)}
                                    variant="underlined"
                                    size="lg"
                                    label="Select bread type"
                                >
                                    {(type === "Bread" ? breadItems : type === "Cheese" ? cheeseItems : type === "Meal" ? meatItems : type === "Topping" ? toppingItems : sauceItems).map((ingredient: Ingredient) => (
                                        <SelectItem key={ingredient.name.toString()} value={ingredient.name.toString()}>
                                            {ingredient.name}
                                        </SelectItem>
                                    ))}
                                </Select>
                            </div>
                            :
                            <div className="flex-1 min-w-[280px] py-4 px-2 md:px-4" key={type.valueOf()}>
                                <CheckboxGroup size="lg" label={`Select ${type}(s)`}>
                                    {(type === "Bread" ? breadItems : type === "Cheese" ? cheeseItems : type === "Meat" ? meatItems : type === "Topping" ? toppingItems : sauceItems).map((ingredient) => (
                                        <Checkbox
                                            key={ingredient.name.toString()}
                                            value={ingredient.name.toString()}
                                            onChange={() => handleIngredientChange(ingredient)}
                                            checked={newSandwichIngredients.some(item => item.name === ingredient.name)}
                                        >
                                            {ingredient.name}
                                        </Checkbox>
                                    ))}
                                </CheckboxGroup>
                            </div>
                    ))}
                </div>

            </CardBody>
            <CardFooter className="gap-3 w-full justify-between">
                <div className="flex flex-1 justify-center">
                    <Button color="primary" size="lg">
                        Start Customizing
                    </Button>
                </div>
            </CardFooter>
        </Card>
    )
}