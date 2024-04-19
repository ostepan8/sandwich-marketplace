"use client"
import React, { useEffect, useState } from 'react';
import { title } from "@/components/primitives";
import { MenuItem, MenuItemProps, MerchItem, MerchItemProps } from '@/constants/types';
import { getMerchItems } from '../lib/actions/merch.actions';
import { Button, Select, SelectItem, Spinner } from '@nextui-org/react';
import { useCart } from '@/context/CartContext';
import ProductCard from "../../components/ProductCard"
import { SizeLimits } from '@/constants/types';
type Props = {
	merchItems: MerchItem[],
	tShirtLimits: SizeLimits,
	hoodieLimits: SizeLimits
}
export default function MerchPage() {
	const { addToCart, } = useCart();
	const [tShirtLimits, setTShirtLimits] = useState<SizeLimits>()
	const [hoodieLimits, setHoodieLimits] = useState<SizeLimits>()

	const [merchItems, setMerchItems] = useState<MerchItem[]>([])
	const [fetching, setFetching] = useState<Boolean>(false)
	async function getItems() {
		setFetching(true)
		const response: Props | undefined = await getMerchItems()
		if (response != undefined) {
			setMerchItems(response.merchItems)
			setTShirtLimits(response.tShirtLimits)
			setHoodieLimits(response.hoodieLimits)
			setFetching(false)
		} else {
			console.log('error')
		}


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
						<ProductCard tShirtLimits={tShirtLimits} hoodieLimits={hoodieLimits} item={item} key={item._id} />
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

