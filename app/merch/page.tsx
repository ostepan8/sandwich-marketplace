import React from 'react';
import { title } from "@/components/primitives";

export default function MerchPage() {
	return (
		<div className="min-h-screen w-full  bg-gradient-to-br flex items-center justify-center p-4">
			<div className="text-center">
				<h1 className={`${title()} text-black text-4xl md:text-5xl font-bold mb-8 p-3 rounded-lg bg-opacity-80`}>
					Buy Di-Pasquale Merchandise
				</h1>
				<div className="animate-bounce mt-10">
					<h2 className={`${title()} text-xl md:text-2xl text-black font-semibold`}>
						Coming Soon
					</h2>
				</div>
			</div>
		</div>
	);
}
