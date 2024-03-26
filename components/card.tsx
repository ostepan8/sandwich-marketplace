import React from "react";
import { Card, CardHeader, CardBody, CardFooter, Avatar, Button } from "@nextui-org/react";
import { MenuItemProps } from "@/constants/types";
import { subtitle, title, } from "./primitives";

export default function CustomCard({
    data
}: MenuItemProps) {
    const { name, ingredients, description, basePrice, available } = data
    const [isFollowed, setIsFollowed] = React.useState(false);
    const ingredientString = ingredients.map(obj => obj.name).join(', ');

    const unavailableIngredients = ingredients.filter(item => !item.available).map(item => item.name);


    return (
        <Card className="w-[100%]">
            <CardHeader className="justify-between">
                <div className="flex">
                    <div className="flex flex-col  items-start justify-center">
                        <h1 className={title()}>{name}</h1>

                    </div>
                </div>
                <div>
                    <h4 className=" text-5xl font-semibold leading-none text-default-600">{basePrice + "$"}</h4>
                </div>
            </CardHeader>
            <CardBody className="px-3 py-0 text-small text-default-400">

                {description && (<> <div className="flex flex-col items-start justify-center">
                    <h1 className={title()}>Description</h1>
                </div>
                    <p>
                        {description}
                    </p></>)}
                <div className="flex flex-col items-start justify-center">
                    <h4 className={title()}>Ingredients</h4>
                </div>
                <h2 className={subtitle()}>{ingredientString}</h2>

            </CardBody>
            <CardFooter className="gap-3 w-full justify-between">
                <div className="flex gap-1">
                    <Button color="primary" size="lg">
                        Add To Cart
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
}
