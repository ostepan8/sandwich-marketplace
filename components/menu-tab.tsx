import { Button, Card, CardHeader, Input, Switch } from "@nextui-org/react";
import { useState } from "react";
import { CartContextType, Ingredient, MenuItem } from "@/constants/types"; // Correct import paths as necessary
import { subtitle, title } from "@/components/primitives";
import { useCart } from "@/context/CartContext";
import { changeMenuItemAvailability, deleteMenuItem, updateMenuItemPrice } from "@/app/lib/actions/menu.actions";
import IngredientText from "./ingredient-text";

type Props = {
    data: MenuItem,
    display: Boolean,
    unavailableIngredients: Ingredient[]
    removeMenuItemById?: (s: string) => void
}

export default function MenuTab({ data, display = true, unavailableIngredients, removeMenuItemById }: Props) {
    const { addToCart }: CartContextType = useCart();
    const [isLoading, setIsLoading] = useState(false)
    const [added, setAdded] = useState(false)
    const [available, setAvailable] = useState<boolean>(data.available.valueOf());
    const [price, setPrice] = useState<number>(data.basePrice)
    const [priceInput, setPriceInput] = useState<string>("")

    const handleAvailabilityChange = async (newAvailability: boolean) => {
        setAvailable(newAvailability);
        await changeMenuItemAvailability(data._id.valueOf());
    };

    const handleDeleteMenuItem = async () => {
        setIsLoading(true); // Start loading
        await deleteMenuItem(data._id.valueOf()); // Call the delete function
        removeMenuItemById && removeMenuItemById(data._id.valueOf())
        setIsLoading(false); // Stop loading
        // Optionally, trigger re-fetching of menu items or update local state to reflect the change
    };
    function handleEditPrice(s: String) {
        setPriceInput(s.valueOf())
        const number = parseInt(s.valueOf());
        if (isNaN(number)) {
            return
        }
        setPrice(number)
    }
    async function handleEditNewPrice() {
        const response = await updateMenuItemPrice(data._id.valueOf(), price)
        setPriceInput("")
    }

    // Check if the sandwich has unavailable ingredients
    const unavailableInThisSandwich = data.ingredients
        .filter(ingredient =>
            unavailableIngredients.some(unavailable => unavailable.name === ingredient.name))
        .map(ingredient => ingredient.name);

    return (
        <Card className="w-full border-b py-4 flex flex-col items-center p-8 mb-8">
            <div className="flex md:flex-row flex-col items-center justify-between w-full">
                <div className="flex w-full  flex-row items-center">
                    {display ? <h1 className={title()}>{data.name} - {price.toString()}$</h1> :
                        <div className="flex flex-col sm:flex-row h-full justify-center items-center">
                            <h1 className={`${title()} mr-2`}>{data.name}</h1>
                            <Input
                                value={priceInput}
                                onChange={(e) => handleEditPrice(e.target.value)}
                                className="ml-6 my-4 sm:my-0"
                                label="Current Price"
                                placeholder={price.toString() + "$"} />
                            <Button className="ml-4 mb-4 sm:mb-0"
                                color="primary"
                                variant="solid"
                                onPress={handleEditNewPrice}
                            >Confirm</Button>
                        </div>

                    }
                </div>
                <div className="flex flex-row flex-wrap w-full justify-start">
                    <IngredientText data={data.ingredients} />

                    {unavailableInThisSandwich.length > 0 && (
                        <h1 className={"text-red-500"}>Unavailable Ingredients: {unavailableInThisSandwich.join(', ')}</h1>)}
                </div>
                <div className="flex items-center ml-6 ">
                    <div className="mr-6 justify-center flex flex-col items-center gap-2">
                        <div>
                            <h1 className={subtitle()}>Available</h1>
                        </div>

                        <Switch
                            isReadOnly={display.valueOf()}
                            isSelected={available}
                            onValueChange={(e) => handleAvailabilityChange(e)}
                        />
                    </div>

                    {!display ? <Button onPress={handleDeleteMenuItem}>Delete</Button> :
                        <Button isLoading={isLoading} onPress={async () => {
                            setIsLoading(true); // Turn on loading
                            setTimeout(() => {
                                if (!data.available) {
                                    alert("Item is unavailable")
                                    setIsLoading(false)
                                    return
                                }
                                addToCart(data);
                                setIsLoading(false);
                                setAdded(true)
                                setTimeout(() => {
                                    setAdded(false);
                                }, 400);

                            }, 100);
                        }
                        } color={added ? "success" : "primary"}>
                            {added ? "✔" : "Add to Cart"}
                        </Button>}
                </div>
            </div>

        </Card>
    );
}
