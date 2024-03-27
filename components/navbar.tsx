"use client"
import React from "react";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenu, NavbarMenuItem, Link, Button } from "@nextui-org/react";
import { siteConfig } from "@/config/site";


export default function App() {
	const [isMenuOpen, setIsMenuOpen] = React.useState(false);

	const menuItems = [
		"Profile",
		"Dashboard",
		"Activity",
		"Analytics",
		"System",
		"Deployments",
		"My Settings",
		"Team Settings",
		"Help & Feedback",
		"Log Out",
	];

	return (
		<Navbar onMenuOpenChange={setIsMenuOpen} >
			<NavbarContent className="hidden sm:flex gap-4 w-full" justify="center">
				{siteConfig.navItems.map((item) => (
					<NavbarItem key={item.href}>
						<Link
							color="foreground" href={item.href}>

							{item.label}
						</Link>
					</NavbarItem>
				))}
			</NavbarContent>
			<NavbarContent>
				<NavbarMenuToggle
					aria-label={isMenuOpen ? "Close menu" : "Open menu"}
					className="sm:hidden"
				/>
			</NavbarContent>
			<NavbarMenu>
				{menuItems.map((item, index) => (
					<NavbarMenuItem key={`${item}-${index}`}>
						<Link
							color={
								index === 2 ? "primary" : index === menuItems.length - 1 ? "danger" : "foreground"
							}
							className="w-full"
							href="#"
							size="lg"
						>
							{item}
						</Link>
					</NavbarMenuItem>
				))}
			</NavbarMenu>
		</Navbar>
	);
}

// "use client"
// import {
// 	Navbar as NextUINavbar,
// 	NavbarContent,
// 	NavbarMenu,
// 	NavbarMenuToggle,
// 	NavbarBrand,
// 	NavbarItem,
// 	NavbarMenuItem,
// } from "@nextui-org/navbar";
// import { Link } from "@nextui-org/link";
// import React from "react";
// import { link as linkStyles } from "@nextui-org/theme";
// import { siteConfig } from "@/config/site";
// import NextLink from "next/link";
// import clsx from "clsx";
// import { Logo } from "@/components/icons";
// import { title } from "./primitives";
// import Photo from "../public/di-pasquale-logo.png"
// import Image from "next/image";

// export const Navbar = () => {
// 	const [showingNavBar, setShowingNavBar] = React.useState(false)

// 	return (
// 		<NextUINavbar>
// 			<NavbarContent className="w-full bg-purple-500" >
// 				<NavbarBrand as="li" className="gap-3 ">
// 					<NextLink className="flex justify-start items-center gap-1 bg-red-500" href="/">
// 						<Image alt="logo" src={Photo} width={50} height={50}></Image>
// 						<p className="font-bold text-inherit">{siteConfig.name}</p>
// 					</NextLink>
// 				</NavbarBrand>
// 				<div className="flex flex-1 justify-center pr-64">
// 					<ul className="hidden gap-4 xl:flex">
// 						{siteConfig.navItems.map((item) => (
// 							<NavbarItem key={item.href}>
// 								<NextLink
// 									className={clsx(
// 										linkStyles({ color: "foreground", size: 'lg' }),
// 										"data-[active=true]:text-primary data-[active=true]:font-large"
// 									)}
// 									color="foreground"
// 									href={item.href}
// 								>
// 									{item.label}
// 								</NextLink>
// 							</NavbarItem>
// 						))}
// 					</ul>
// 				</div>

// 			</NavbarContent >
// 		</NextUINavbar>
// 		// <NextUINavbar isMenuOpen={showingNavBar} onMenuOpenChange={() => setShowingNavBar(!showingNavBar)} maxWidth="full" position="sticky">
// 		// <NavbarContent className="w-full" >
// 		// 	<NavbarBrand as="li" className="gap-3 ">
// 		// 		<NextLink className="flex justify-start items-center gap-1 bg-red-500" href="/">
// 		// 			<Image alt="logo" src={Photo} width={50} height={50}></Image>
// 		// 			<p className="font-bold text-inherit">{siteConfig.name}</p>
// 		// 		</NextLink>
// 		// 	</NavbarBrand>
// 		// 	<div className="flex justify-center w-full pr-64">
// 		// 		<ul className="hidden gap-4 xl:flex">
// 		// 			{siteConfig.navItems.map((item) => (
// 		// 				<NavbarItem key={item.href}>
// 		// 					<NextLink
// 		// 						className={clsx(
// 		// 							linkStyles({ color: "foreground", size: 'lg' }),
// 		// 							"data-[active=true]:text-primary data-[active=true]:font-large"
// 		// 						)}
// 		// 						color="foreground"
// 		// 						href={item.href}
// 		// 					>
// 		// 						{item.label}
// 		// 					</NextLink>
// 		// 				</NavbarItem>
// 		// 			))}
// 		// 		</ul>
// 		// 	</div>

// 		// </NavbarContent >

// 		// 	<NavbarContent className="xs:flex xl:hidden basis-1 pl-4" justify="end">
// 		// 		<NavbarMenuToggle />
// 		// 	</NavbarContent>

// 		// 	<NavbarMenu>
// 		// 		<div className="mx-4 mt-2 flex flex-col gap-2">
// 		// 			{siteConfig.navItems.map((item, index) => (
// 		// 				<NavbarMenuItem key={`${item.label}-${index}`} className={"w-full justify-end flex my-4 py-6"}>
// 		// 					<Link
// 		// 						color="primary"
// 		// 						href={`${item.href}`}
// 		// 						size="lg"
// 		// 						onPress={() => setShowingNavBar(false)}
// 		// 					>
// 		// 						<h1 className={title() + "my-10"}>
// 		// 							{item.label}
// 		// 						</h1>

// 		// 					</Link>
// 		// 				</NavbarMenuItem>
// 		// 			))}
// 		// 		</div>
// 		// 	</NavbarMenu>
// 		// </NextUINavbar >
// 	);
// };
