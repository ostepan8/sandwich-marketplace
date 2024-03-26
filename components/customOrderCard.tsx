import React from "react";
import { Card, CardHeader, CardBody, CardFooter, Avatar, Button } from "@nextui-org/react";
import { MenuItemProps } from "@/constants/types";
import { subtitle, title, } from "./primitives";

export default function CustomOrderCard() {

    const name = "Customize Sandwich"
    const description = "Choose any meat, cheese, toppings, and condiments!"
    return (
        <Card className="w-[100%]">
            <CardHeader className="justify-between">
                <div className="flex">
                    <div className="flex flex-col  items-start justify-center">
                        <h1 className={title()}>{name}</h1>

                    </div>
                </div>
                <div>
                    <h4 className=" text-5xl font-semibold leading-none text-default-600">{"12$"}</h4>
                </div>
            </CardHeader>
            <CardBody className="px-3 py-0 text-small text-default-400">

                {description && (<> <div className="flex flex-col items-start justify-center">
                    <h1 className={title()}>Description</h1>
                </div>
                    <p>
                        {description}
                    </p></>)}
                {/* <div className="flex flex-col items-start justify-center">
                    <h4 className={title()}>Ingredients</h4>
                </div>
                <h2 className={subtitle()}>{ingredientString}</h2> */}

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