"use client"
import { useState, useEffect } from 'react';
import { title, } from "@/components/primitives";
import { siteConfig } from "@/config/site";
import { CircularProgress } from "@nextui-org/react";
import { Ingredient, MenuItem } from '@/constants/types';
import CustomOrderCard from '@/components/customOrderCard';
import MenuTab from '@/components/menu-tab';
import { getMenuAndIngredientData } from '../lib/actions/menu.actions';
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
            setLoading(true); // Start loading before the data fetching
            try {
                // Use your function to get the data
                const { menuData, ingredientData }: ApiResponse = await getMenuAndIngredientData();

                // Set the fetched data to your state
                setData(menuData);
                const filteredIngredients = ingredientData.filter(ingredient => !ingredient.available);
                setUnavailableIngredients(filteredIngredients);
            } catch (error) {
                console.error(error); // It's good practice to log the actual error
                setError("There was an error loading the data."); // Set the error message
            } finally {
                setLoading(false); // Stop loading irrespective of the result
            }
        };

        fetchData(); // Execute the function to fetch data
    }, []); // The empty dependency array ensures this effect runs once after the initial render


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
            <div className='mb-10'>
                <CustomOrderCard />
            </div>


            {data.map((item: MenuItem) => {
                return (
                    <MenuTab key={item._id.valueOf()} unavailableIngredients={unavailableIngredients} display={true} data={item} />
                )
            })}
        </div>
    );
}
