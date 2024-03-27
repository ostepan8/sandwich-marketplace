import "@/styles/globals.css";
import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import { Providers } from "./providers";
import CustomNavBar from "@/components/navbar";
import { Link } from "@nextui-org/link";
import clsx from "clsx";
import Footer from "@/components/footer";
import { AuthProvider } from "../context/AuthContext"
import { CartProvider } from "@/context/CartContext";

export const metadata: Metadata = {
	title: {
		default: siteConfig.name,
		template: `%s - ${siteConfig.name}`,
	},
	description: siteConfig.description,
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "white" },
	],
	icons: {
		icon: "/favicon.ico",
		shortcut: "/favicon-16x16.png",
		apple: "/apple-touch-icon.png",
	},
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html>
			<head />
			<body>
				<Providers themeProps={{ attribute: "class", defaultTheme: "light" }}>
					<AuthProvider>
						<CartProvider>


							<CustomNavBar />
							<main className="w-full mx-auto pt-16 px-6 flex-grow ">
								{children}
							</main>
							<Footer />
						</CartProvider>
					</AuthProvider>
				</Providers>
			</body>

		</html>
		// <html lang="en" suppressHydrationWarning className="w-full h-full bg-purple-500">
		// 	<head />
		// 	<body
		// 		className={"w-full bg-yellow-500"}
		// 	>
		// 		<Providers themeProps={{ attribute: "class", defaultTheme: "light" }}>
		// 			<AuthProvider>
		// 				<div className="relative flex flex-col w-full">
		// 					<Navbar />
		// 					<main className="w-full mx-auto pt-16 px-6 flex-grow">
		// 						{children}
		// 					</main>
		// 					<Footer />
		// 				</div>
		// 			</AuthProvider>
		// 		</Providers>
		// 	</body>
		// </html>
	);
}
