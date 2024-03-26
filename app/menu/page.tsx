"use client"
import { useState, useEffect } from 'react';
import { title, } from "@/components/primitives";
import { siteConfig } from "@/config/site";
import { CircularProgress } from "@nextui-org/react";
import { Ingredient, MenuItem } from '@/constants/types';
import CustomOrderCard from '@/components/customOrderCard';
import MenuTab from '@/components/menu-tab';
interface ApiResponse {
    menuData: MenuItem[];
    ingredientData: Ingredient[];
}
export default function MenuPage() {

    const [data, setData] = useState<MenuItem[]>([]);
    const [unavailableIngredients, setUnavailableIngredients] = useState<Ingredient[]>([])
    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState(""); // Added state for error handling

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(siteConfig.api + "get-menu-and-ingredient-data", {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) { // Check if the response was ok (status in the range 200-299)
                    throw new Error('Network response was not ok');
                }
                const data: ApiResponse = await response.json();
                const { ingredientData } = data
                setData(data.menuData);
                const filteredIngredients = ingredientData.filter(ingredient => !ingredient.available);
                setUnavailableIngredients(filteredIngredients)
                setLoading(false);
            } catch (error) {
                setError("There was an error"); // Set error message
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (isLoading) return (
        <div className='w-screen h-[75vh] flex justify-center items-center'>
            <div className='flex flex-col items-center'>
                <h1 className={title()}>Loading...</h1>
                <CircularProgress />
            </div>
        </div>
    );

    if (error) return <p>Error: {error}</p>; // Display error message if there is an error
    if (!data) return <p>No menu data available</p>; // Updated for clarity

    return (
        <div className='flex-col flex-1 w-full px-10'>
            <div className='my-8'>
                <h1 className={title()}>What would you like?</h1>
            </div>
            <CustomOrderCard />

            {data.map((item: MenuItem) => {
                return (
                    <MenuTab unavailableIngredients={unavailableIngredients} display={true} data={item} />
                )
            })}
        </div>
    );
}
