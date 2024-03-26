export type SiteConfig = typeof siteConfig;

export const siteConfig = {
	name: "Di-Pasquale's Sandwiches",
  api:"http://localhost:8080/",
	description: "Fresh and Home-Made Sandwiches",
	navItems: [
		{
			label: "Home",
			href: "/",
		},
	
    {
      label: "Menu",
      href: "/menu",
    },
    {
      label: "Cart",
      href: "/cart",
    },
    {
      label: "Merch",
      href: "/merch",
    }
	],
};
