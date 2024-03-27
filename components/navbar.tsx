"use client"
import React from "react";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenu, NavbarMenuItem, Link, Button } from "@nextui-org/react";
import { siteConfig } from "@/config/site";


export default function App() {
	const [isMenuOpen, setIsMenuOpen] = React.useState(false);

	const menuItems = [
		"Home",
		"Menu",
		"Cart",
		"Merch",
	];

	const handleMenuItemClick = () => {
		setIsMenuOpen(false);
	};
	return (
		<Navbar isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen} >
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
							className="w-full"
							href={item.toLowerCase() === "home" ? "/" : `/${item.toLowerCase()}`}
							onClick={handleMenuItemClick} // Close the menu on click
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
