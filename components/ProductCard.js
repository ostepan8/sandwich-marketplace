"use client";
import React, { useState } from "react";
import { Button, Select, SelectItem } from "@nextui-org/react";
import { useCart } from "@/context/CartContext";
import HoodieBack from "../public/merch-images/hoodie-back.png";
import HoodieFront from "../public/merch-images/hoodie-front.png";
import ShirtFront from "../public/merch-images/t-shirt-front.png";
import ShirtBack from "../public/merch-images/shirt-back.png";
import { Image } from "@nextui-org/react";

const ProductCard = ({ item, tShirtLimits, hoodieLimits }) => {
  const small = "small";
  const med = "medium";
  const large = "large";
  const xl = "xl";
  const sizes = [small, med, large, xl];
  const [size, setSize] = useState("small");
  const { addToCart } = useCart();
  const [showFront, setShowFront] = useState(true); // State to toggle between front and back
  const disabledKeys = sizes.filter((sizeKey) => {
    // Ensure type is 'string[]'
    const stock =
      item.imagePath === "hoodie"
        ? hoodieLimits && hoodieLimits[sizeKey]
        : tShirtLimits && tShirtLimits[sizeKey];
    return stock === 0;
  });

  const toggleImage = (number) => {
    if (number == 1) {
      setShowFront(true);
    } else {
      setShowFront(false);
    }
  };

  return (
    <div className="w-full max-w-sm border border-gray-200 shadow-lg mb-4 mx-8 rounded-lg bg-white justify-center items-center flex flex-col">
      <div className="relative w-full h-96 flex justify-center ">
        <Image
          src={
            showFront
              ? item.imagePath === "hoodie"
                ? HoodieFront.src
                : ShirtFront.src
              : item.imagePath === "hoodie"
              ? HoodieBack.src
              : ShirtBack.src
          }
          alt={item.name}
          className="w-full h-96 object-cover transition-opacity duration-500 ease-in-out"
        />
        <Image
          src={
            !showFront
              ? item.imagePath === "hoodie"
                ? HoodieBack.src
                : ShirtBack.src
              : item.imagePath === "hoodie"
              ? HoodieFront.src
              : ShirtFront.src
          }
          alt={item.name}
          className="w-full h-96 object-cover transition-opacity duration-500 ease-in-out absolute top-0 left-0"
        />
      </div>
      <div className="flex flex-row">
        <button
          onClick={() => toggleImage(1)}
          className={`rounded-full w-6 h-6 border mr-1 ${
            showFront ? "bg-blue-500" : "bg-white"
          }`}
        />
        <button
          onClick={() => toggleImage(2)}
          className={`rounded-full w-6 h-6 border ml-1 ${
            !showFront ? "bg-blue-500" : "bg-white"
          }`}
        />
      </div>

      <div className="flex-1 min-w-[280px] max-w-xs md:max-w-none px-2 md:px-4">
        <Select
          onChange={(event) => setSize(event.target.value)}
          variant="underlined"
          size="lg"
          label="Select Size"
          isRequired
          defaultSelectedKeys={["small"]}
          disabledKeys={disabledKeys}
        >
          {sizes.map((sizeKey) => {
            const stock =
              item.imagePath === "hoodie"
                ? hoodieLimits && hoodieLimits[sizeKey]
                : tShirtLimits && tShirtLimits[sizeKey];
            return (
              <SelectItem key={sizeKey.toString()} value={sizeKey.toString()}>
                {`${
                  sizeKey.charAt(0).toUpperCase() + sizeKey.slice(1)
                } - ${stock} left`}
              </SelectItem>
            );
          })}
        </Select>
      </div>

      <div className="p-4">
        <h1 className="text-lg font-bold">{item.name}</h1>
        <p className="text-sm">{item.description}</p>
        <p className="text-md font-semibold">${item.basePrice}</p>
        <Button
          onPress={() =>
            addToCart({
              ...item,
              size: size,
              description: "Size: " + size.toString().toUpperCase(),
            })
          }
          className={`mt-2 p-2 text-white ${
            item.available ? "bg-green-500" : "bg-red-500"
          }`}
          style={{ width: "100%" }}
        >
          {item.available ? "Add to Cart" : "Sold Out"}
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
