import { Link } from "@nextui-org/link";
import { button as buttonStyles } from "@nextui-org/theme";
import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";

import Photo from "../public/di-pasquale-img.png"
import Image from "next/image";
import { Button } from "@nextui-org/react";
export default function Home() {
	return (
		<section className="flex flex-col items-center  gap-4 py-8 md:py-10 h-[100vh]">
			<div className="inline-block max-w-lg text-center">
				<Image alt="Logo" src={Photo}></Image>
			</div>

			<div className="flex gap-3">
				<Link href="/menu" >
					<Button className="bg-gradient-to-tr from-[#9d1f2b] to-[#9d1f2b] text-white shadow-lg px-20 inline-block">
						See Menu
					</Button>
				</Link>

			</div>
		</section>
	);
}

