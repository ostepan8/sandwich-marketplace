"use client"
import React, { useEffect, useState } from 'react';
import { title } from "@/components/primitives";
import { MenuItem, MenuItemProps, MerchItem, MerchItemProps } from '@/constants/types';
import { getMerchItems } from '../lib/actions/merch.actions';
import { Button, Spinner } from '@nextui-org/react';
import { useCart } from '@/context/CartContext';
import HoodieBack from "../../public/merch-images/hoodie-back.png"
import HoodieFront from "../../public/merch-images/hoodie-front.png"
import ShirtFront from "../../public/merch-images/t-shirt-front.png"
import ShirtBack from "../../public/merch-images/shirt-back.png"
import { Image } from "@nextui-org/react";
export default function MerchPage() {
	const { addToCart, } = useCart();
	const [merchItems, setMerchItems] = useState<MerchItem[]>([])
	const [fetching, setFetching] = useState<Boolean>(false)
	async function getItems() {
		setFetching(true)
		const items: MerchItem[] = await getMerchItems()
		setMerchItems(items)
		setFetching(false)
	}
	useEffect(() => {
		getItems()
	}, [])
	return (

		<div className="min-h-screen w-full  bg-gradient-to-br flex justify-center p-4">
			<div className="text-center w-full">
				<h1 className={`${title()} text-black text-4xl md:text-5xl font-bold mb-8 p-3 rounded-lg bg-opacity-80`}>
					Buy Di-Pasquale Merchandise
				</h1>
				{!fetching ? <div className="w-full  flex flex-wrap mt-10 md:mt-32  justify-center">
					{merchItems.map((item) => (
						<ProductCard item={item} key={item._id} />
					))}
				</div> :
					<div className='mt-[30vh]'>
						<Spinner />
					</div>
				}
			</div>
		</div>
	);
}

const ProductCard = ({ item }: MerchItemProps) => {
	const [size, setSize] = useState("small")
	const { addToCart } = useCart()
	const [showFront, setShowFront] = useState(true); // State to toggle between front and back

	const toggleImage = () => {
		setShowFront(!showFront); // Toggle between true and false
	};

	return (
		<div className="w-full max-w-sm border border-gray-200 shadow-lg mx-8 rounded-lg bg-white justify-center items-center flex flex-col">
			<div className="relative w-full h-96 flex justify-center ">
				<Image
					src={showFront ? item.imagePath === "hoodie" ? HoodieFront.src : ShirtFront.src : item.imagePath === "hoodie" ? HoodieBack.src : ShirtBack.src}
					alt={item.name}
					className="w-full h-96 object-cover transition-opacity duration-500 ease-in-out"
				/>
				<Image
					src={!showFront ? item.imagePath === "hoodie" ? HoodieBack.src : ShirtBack.src : item.imagePath === "hoodie" ? HoodieFront.src : ShirtFront.src}
					alt={item.name}
					className="w-full h-96 object-cover transition-opacity duration-500 ease-in-out absolute top-0 left-0"
				/>
				<div className='absolute z-10 right-0 top-[50%]'>
					<Button onPress={toggleImage} className="mt-2">
						Show {showFront ? 'Back' : 'Front'}
					</Button>
				</div>
			</div>

			<div className="p-4">
				<h1 className="text-lg font-bold">{item.name}</h1>
				<p className="text-sm">{item.description}</p>
				<p className="text-md font-semibold">${item.basePrice}</p>
				<Button onPress={() => addToCart({ ...item, size: size })} className={`mt-2 p-2 text-white ${item.available ? 'bg-green-500' : 'bg-red-500'}`} style={{ width: '100%' }}>
					{item.available ? 'Add to Cart' : 'Sold Out'}
				</Button>

			</div>
		</div>
	);
};