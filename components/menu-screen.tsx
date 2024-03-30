import { subtitle, title } from "@/components/primitives";
import { Card, CardHeader, CardBody, CardFooter, Input, Button, Select, SelectItem, CircularProgress, CheckboxGroup, Checkbox, } from "@nextui-org/react";
import { Ingredient, MenuItem } from "@/constants/types";
import MenuTab from "@/components/menu-tab";
import { INGREDIENT_TYPES, MENU_DATA } from "@/constants";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { siteConfig } from "@/config/site";
import { insertMenuItem } from "@/app/lib/actions/menu.actions";

export interface IAppProps {
    data: MenuItem[]
    ingredientData: Ingredient[]
    setMenuData: Dispatch<SetStateAction<MenuItem[]>>
}

export default function MenuScreen(props: IAppProps) {
    const { data, ingredientData, setMenuData } = props
    const [breadItems, setBreadItems] = useState<Ingredient[]>([]);
    const [cheeseItems, setCheeseItems] = useState<Ingredient[]>([]);
    const [meatItems, setMeatItems] = useState<Ingredient[]>([]);
    const [toppingItems, setToppingItems] = useState<Ingredient[]>([]);
    const [sauceItems, setSauceItems] = useState<Ingredient[]>([]);
    const [newSandwichIngredients, setNewSandwichIngredients] = useState<Ingredient[]>([]);

    const [errorMessage, setErrorMessage] = useState("")
    const [inserting, setInserting] = useState(false)
    const [newSandwichData, setNewSandwichData] = useState({
        name: '',
        description: '',
        basePrice: 0,
        available: true,
        _id: '',
        ingredients: []
    })

    const removeMenuItemById = (_id: string) => {
        setMenuData(currentMenuData =>
            currentMenuData.filter(item => item._id !== _id)
        );
    };

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
    const validateFormData = () => {
        if (!newSandwichData.name.trim()) {
            return "Please provide a name for the sandwich.";
        }
        if (!newSandwichData.description.trim()) {
            return "Please provide a description for the sandwich.";
        }
        if (newSandwichData.basePrice <= 0) {
            return "Please provide a valid price for the sandwich.";
        }
        if (newSandwichIngredients.length === 0) {
            return "Please select at least one ingredient for the sandwich.";
        }
        // Add any other necessary validations here
        return ""; // Return an empty string if all validations pass
    };

    const addMenuItemToDatabase = async () => {
        setErrorMessage(""); // Clear any previous errors
        setInserting(true); // Indicate that the insert operation is starting

        // Validate form data
        const validationError = validateFormData();
        if (validationError) {
            setErrorMessage(validationError);
            setInserting(false);
            return;
        }

        // Prepare the data for the new menu item
        const ingredientIds = newSandwichIngredients.map(obj => obj._id);
        const newMenuItemData = {
            ...newSandwichData,
            ingredients: ingredientIds,
        };

        // Proceed if validation passes
        try {
            // Directly call the server-side function to insert the new menu item
            const populatedItem = await insertMenuItem({
                name: newMenuItemData.name,
                description: newMenuItemData.description,
                basePrice: newMenuItemData.basePrice,
                ingredientIds: newMenuItemData.ingredients,
                available: newMenuItemData.available
            });

            // Update state with the new menu item data
            setMenuData(previousMenuData => [populatedItem, ...previousMenuData]);
        } catch (error) {
            console.error(error); // Log the error for debugging
            setErrorMessage("An error occurred while adding the menu item. Please try again.");
        } finally {
            setInserting(false); // Reset the inserting indicator
        }
    };


    useEffect(() => {
        if (ingredientData == undefined || ingredientData == null) {
            return
        }
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
    }, [ingredientData]);



    return (
        < Card className=" w-[100%] border-spacing-3 p-6" >

            <CardHeader className="justify-between">
                <div className="flex">
                    <div className="flex flex-col  items-start justify-center">
                        <h1 className={title()}>{MENU_DATA.title}</h1>
                    </div>
                </div>
            </CardHeader>
            <CardBody>
                {MENU_DATA.description && (<> <div className="flex flex-col items-start justify-center">
                    <h1 className={subtitle()}>{MENU_DATA.description}</h1>
                </div>
                </>)}
                <div className="flex-col flex flex-1">
                    <div className="flex flex-col sm:flex-row h-full gap-4 sm:gap-0">
                        <div className="flex-grow mb-4 sm:mb-0">
                            <Input
                                onChange={(e) => setNewSandwichData({ ...newSandwichData, name: e.target.value })}
                                variant="underlined"
                                className="h-full w-full" // Ensure the input field expands to the full width of its container
                                size="lg"
                                placeholder="turkey, lettuce, tomato, etc"
                                type="form"
                                label="Sandwich Name"
                            />
                        </div>
                        <div className="flex-grow flex flex-col md:flex-row">
                            <div className="flex-grow mb-4 md:mb-0 md:ml-6">
                                <Input
                                    onChange={(e) => setNewSandwichData({ ...newSandwichData, description: e.target.value })}
                                    variant="underlined"
                                    className="h-full w-full" // Make the input field flexible to take up available space
                                    size="lg"
                                    placeholder="This is Di-Pasquale's super duper cool sandwich that..."
                                    type="form"
                                    label="Sandwich Description"
                                />
                            </div>
                            <div className="md:ml-6 w-full md:w-auto">
                                <Input
                                    onChange={(e) => setNewSandwichData({ ...newSandwichData, basePrice: parseFloat(e.target.value) || 0 })}
                                    type="number"
                                    label="Price"
                                    placeholder="0.00"
                                    labelPlacement="outside"
                                    startContent={
                                        <div className="pointer-events-none flex items-center">
                                            <span className="text-default-400 text-small">$</span>
                                        </div>
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row md:flex-wrap md:justify-between h-full">
                        {INGREDIENT_TYPES.map((type: String) => (
                            (type === "Bread") ?
                                <div key={type.valueOf()} className="flex-1 min-w-[280px] max-w-xs md:max-w-none py-4 px-2 md:px-4">
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

                    <div className="w-full justify-center flex my-8">
                        <Button onPress={addMenuItemToDatabase} color={'primary'} className="ml-4">
                            <div className="p-4">
                                {!inserting ? "Add" : <CircularProgress size="sm" />}
                            </div>

                        </Button>
                    </div>
                </div>
                <div className="w-full justify-center flex text-red-500">
                    {errorMessage && <p className="error-message">{errorMessage}</p>}
                    {/* The rest of your form */}
                </div>

            </CardBody>
            <CardFooter className="w-full justify-between flex-col">
                {data.map((item2: MenuItem) =>
                    <MenuTab removeMenuItemById={removeMenuItemById} key={item2._id.valueOf()} unavailableIngredients={[]} display={false} data={item2} />
                )}
            </CardFooter>
        </Card>
    );
}
