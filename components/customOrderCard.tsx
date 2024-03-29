"use client"
import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardBody, CardFooter, Avatar, Button, Select, SelectItem, CheckboxGroup, Checkbox } from "@nextui-org/react";
import { Ingredient, MenuItem, MenuItemProps } from "@/constants/types";
import { subtitle, title, } from "./primitives";
import { INGREDIENT_TYPES } from "@/constants";
import { getMenuAndIngredientData } from "@/app/lib/actions/menu.actions";
import { useCart } from "@/context/CartContext";
type MenuAndIngredientData = {
    ingredientData: Ingredient[],
    menuData: MenuItem[]
}
export default function CustomOrderCard() {
    const { addToCart } = useCart()
    const [added, setAdded] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [breadItems, setBreadItems] = useState<Ingredient[]>([]);
    const [cheeseItems, setCheeseItems] = useState<Ingredient[]>([]);
    const [meatItems, setMeatItems] = useState<Ingredient[]>([]);
    const [toppingItems, setToppingItems] = useState<Ingredient[]>([]);
    const [sauceItems, setSauceItems] = useState<Ingredient[]>([]);
    const name = "Customize Sandwich"
    const [newSandwichData, setNewSandwichData] = useState({
        name: 'Custom Sandwich',
        basePrice: 12,
        available: true,
        _id: '',
        ingredients: []
    })
    const [newSandwichIngredients, setNewSandwichIngredients] = useState<Ingredient[]>([]);


    const handleIngredientChange = (selectedIngredient: Ingredient) => {
        setNewSandwichIngredients((currentIngredients) => {
            // Check if the ingredient is already selected
            const isAlreadySelected = currentIngredients.some(ingredient => ingredient._id === selectedIngredient._id);

            let updatedIngredients;

            if (isAlreadySelected) {
                // Remove the ingredient if it's already selected
                updatedIngredients = currentIngredients.filter(ingredient => ingredient._id !== selectedIngredient._id);
            } else {
                // Add the ingredient if it's not already selected
                updatedIngredients = [...currentIngredients, selectedIngredient];
            }

            // Update the base price based on the selected ingredients
            updateBasePrice(updatedIngredients);

            return updatedIngredients;
        });
    };
    type CategoryLimits = {
        [category: string]: {
            limit: number;
            extraCharge: number;
        };
    };
    const categoryLimits: CategoryLimits = {
        'Meat': { limit: 2, extraCharge: 2 }, // $2.00 extra for each additional meat beyond 2
        'Topping': { limit: 3, extraCharge: 0.50 }, // $0.50 extra for each additional topping beyond 3
        'Sauce': { limit: 3, extraCharge: 0.50 } // $0.50 extra for each additional sauce beyond 3
    };
    const updateBasePrice = (updatedIngredients: Ingredient[]) => {
        // Start with the initial base price
        let newBasePrice = 12;

        // Define the limits and extra charges for each category


        // Tally the ingredients in each category
        const categoryCounts = updatedIngredients.reduce<{ [key: string]: number }>((counts, ingredient) => {
            const typeKey = ingredient.type as string; // Ensure type is treated as a string
            counts[typeKey] = (counts[typeKey] || 0) + 1;
            return counts;
        }, {});

        // Calculate extra charges based on the category limits and counts
        Object.entries(categoryCounts).forEach(([type, count]) => {
            const { limit, extraCharge } = categoryLimits[type] || { limit: 0, extraCharge: 0 };
            if (count > limit) {
                newBasePrice += (count - limit) * extraCharge;
            }
        });

        // Update the new sandwich data with the new base price
        setNewSandwichData(prevData => ({
            ...prevData,
            basePrice: newBasePrice
        }));
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
                    <h4 className={title()}>{newSandwichData.basePrice}$</h4>
                </div>
            </CardHeader>
            <CardBody className="px-3 py-0 text-small text-default-400">
                <div className="flex flex-col md:flex-row md:flex-wrap md:justify-between h-full">
                    {INGREDIENT_TYPES.map((type: String) => (
                        (type === "Bread") ?
                            <div key={type.valueOf()} className="flex-1 min-w-[200px] max-w-xs md:max-w-none py-4 px-2 md:px-4">
                                <Select
                                    onChange={(event) => handleIngredientChange(breadItems.filter(item => item.name === event.target.value)[0])}
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
                                <CheckboxGroup
                                    size="lg"
                                    label={
                                        type === "Cheese" ?
                                            `Select Cheese Items` :
                                            `Select ${type}(s) - ${categoryLimits[type.valueOf()]?.limit} for free, $${categoryLimits[type.valueOf()]?.extraCharge.toFixed(2)} each after that (Selected: ${newSandwichIngredients.filter(item => item.type === type).length}/${categoryLimits[type.valueOf()]?.limit})`
                                    }
                                >

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
                    <Button isLoading={isLoading} onPress={async () => {

                        setIsLoading(true); // Turn on loading
                        setTimeout(() => {
                            addToCart({ ...newSandwichData, ingredients: newSandwichIngredients });
                            setIsLoading(false);
                            setAdded(true)
                            setTimeout(() => {
                                setAdded(false);
                            }, 400);

                        }, 100);
                    }
                    } color={added ? "success" : "primary"}>
                        {added ? "✔" : "Add to Cart"}
                    </Button>
                </div>
            </CardFooter>
        </Card>
    )
}