import { Button, Switch } from "@nextui-org/react";
import { useState } from "react";
import { CartContextType, Ingredient, MenuItem } from "@/constants/types"; // Correct import paths as necessary
import { subtitle, title } from "@/components/primitives";
import { useCart } from "@/context/CartContext";

type Props = {
    data: MenuItem,
    display: Boolean,
    unavailableIngredients: Ingredient[]
}

export default function MenuTab({ data, display = true, unavailableIngredients }: Props) {
    const { addToCart }: CartContextType = useCart();
    const [isLoading, setIsLoading] = useState(false)
    const [added, setAdded] = useState(false)
    const [available, setAvailable] = useState<boolean>(data.available.valueOf());

    // Function to handle availability change
    const handleAvailabilityChange = (newAvailability: boolean) => {
        // Update availability state
        setAvailable(newAvailability);
        // Placeholder for API call to update the database
        console.log(`Updating availability to ${newAvailability} for ${data.name}`);
    };

    // Combine all ingredient names for display
    const ingredientsList = data.ingredients.map(ingredient => ingredient.name).join(', ');

    // Check if the sandwich has unavailable ingredients
    const unavailableInThisSandwich = data.ingredients
        .filter(ingredient =>
            unavailableIngredients.some(unavailable => unavailable.name === ingredient.name))
        .map(ingredient => ingredient.name);

    return (
        <div className="w-full border-b py-4 flex flex-col items-center">
            <div className="flex items-center justify-between w-full">
                <div className="flex flex-row items-center">
                    <h1 className={`${title()} mr-2`}>{data.name}</h1>
                    <div className="flex flex-col justify-center ml-4">
                        <h1 className={subtitle()}>{ingredientsList}</h1>
                        {unavailableInThisSandwich.length > 0 && (
                            <h1 className={"text-red-500"}>Unavailable Ingredients: {unavailableInThisSandwich.join(', ')}</h1>)}
                    </div>
                </div>

                <div className="flex items-center ml-6">
                    <div className="mr-6">
                        <h1 className={subtitle()}>Available</h1>
                        <Switch
                            isReadOnly={display.valueOf()}
                            isSelected={available}
                            onValueChange={(e) => handleAvailabilityChange(e)}
                            className="mr-2" // Add some space between the Switch and the Button
                        />
                    </div>
                    {!display ? <Button>Delete</Button> :
                        <Button isLoading={isLoading} onPress={async () => {
                            setIsLoading(true); // Turn on loading
                            setTimeout(() => {
                                addToCart(data);
                                setIsLoading(false);
                                setAdded(true)
                                setTimeout(() => {
                                    setAdded(false);
                                }, 250);

                            }, 100);
                        }
                        } color={added ? "success" : "primary"}>
                            {added ? "✔" : data.basePrice.toString() + "$"}
                        </Button>}
                </div>
            </div>
            <div className="w-full pt-4">
                <p className="text-left">{data.description}</p>
            </div>
        </div>
    );
}
