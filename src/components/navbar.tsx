"use client";

import React from "react";
import {
	Grid2x2Plus as Grid2x2PlusIcon,
	Globe as GlobeIcon,
	Layers as LayersIcon,
	UserPlus as UserPlusIcon,
	Users,
	Star,
	FileText,
	Shield,
	RotateCcw,
	Handshake,
	Leaf,
	HelpCircle,
	DollarSign,
	BarChart,
	Plug as PlugIcon,
	Menu as MenuIcon,
	X as XIcon,
} from "lucide-react";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuList,
	NavigationMenuItem,
	NavigationMenuTrigger,
	NavigationMenuLink,
	NavGridCard,
	NavSmallItem,
	NavLargeItem,
	NavItemMobile,
	type NavItemType,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent, SheetClose } from "@/components/ui/sheet";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

// Link data
export const productLinks: NavItemType[] = [
	{ title: "Credit Score Check", href: "/credit-score", description: "Check your credit score instantly for free", icon: BarChart },
	{ title: "Personal Loan", href: "/loans/personal", description: "Get up to ₹40L with minimal documentation", icon: DollarSign },
	{ title: "Home Loan", href: "/loans/home", description: "Finance your dream home at best rates", icon: GlobeIcon },
	{ title: "Credit Cards", href: "/#credit-cards", icon: Shield },
	{ title: "Health Insurance", href: "#", icon: PlugIcon },
	{ title: "Life Insurance", href: "#", icon: LayersIcon },
];

export const companyLinks: NavItemType[] = [
	{ title: "About Us", href: "#", description: "Learn more about our story and team", icon: Users },
	{ title: "Customer Stories", href: "#", description: "See how we’ve helped our clients succeed", icon: Star },
	{ title: "Terms of Service", href: "#", description: "Understand how we operate", icon: FileText },
	{ title: "Privacy Policy", href: "#", description: "How we protect your information", icon: Shield },
	{ title: "Refund Policy", href: "#", description: "Details about refunds and cancellations", icon: RotateCcw },
	{ title: "Partnerships", href: "#", icon: Handshake, description: "Collaborate with us for mutual growth" },
	{ title: "Blog", href: "#", icon: Leaf, description: "Insights, tutorials, and company news" },
	{ title: "Help Center", href: "#", icon: HelpCircle, description: "Find answers to your questions" },
];

import LogoLL from "../images/LogoLL.png";
import Image from "next/image";

export function Navbar() {
	return (
		<div className="relative w-full px-4">
			<div className="bg-background absolute top-5 left-1/2 transform -translate-x-1/2 z-50 h-14 w-full max-w-5xl border px-4 rounded-lg backdrop-blur supports-[backdrop-filter]:bg-background/70">
				<div className="flex h-full items-center justify-between">
					<div className="flex items-center gap-2">
						{/* <Grid2x2PlusIcon className="size-6" /> */}
						{/* <p className="font-mono text-lg font-bold">LendingLeaf</p> */}
						<Image src={LogoLL} alt="LendingLeaf Logo" className="h-8 w-auto" />
					</div>
					<DesktopMenu />
					<div className="flex items-center gap-2">
						<Button size="sm">Get Started</Button>
						<MobileNav />
					</div>
				</div>
			</div>
		</div>
	);
}

function DesktopMenu() {
	return (
		<NavigationMenu className="hidden lg:block">
			<NavigationMenuList>
				<NavigationMenuItem>
					<NavigationMenuTrigger>Product</NavigationMenuTrigger>
					<NavigationMenuContent>
						<div className="grid w-full md:w-4xl md:grid-cols-[1fr_.30fr]">
							<ul className="grid grow gap-4 p-4 md:grid-cols-3 md:border-r">
								{productLinks.slice(0, 3).map((link, idx) => (
									<li key={`product-primary-${idx}-${link.title}`}> 
										<NavGridCard link={link} />
									</li>
								))}
							</ul>
							<ul className="space-y-1 p-4">
								{productLinks.slice(3).map((link, idx) => (
									<li key={`product-secondary-${idx + 3}-${link.title}`}>
										<NavSmallItem item={link} href={link.href} className="gap-x-1" />
									</li>
								))}
							</ul>
						</div>
					</NavigationMenuContent>
				</NavigationMenuItem>
				<NavigationMenuItem>
					<NavigationMenuTrigger>Company</NavigationMenuTrigger>
					<NavigationMenuContent>
						<div className="grid w-full md:w-4xl md:grid-cols-[1fr_.40fr]">
							<ul className="grid grow grid-cols-2 gap-4 p-4 md:border-r">
								{companyLinks.slice(0, 2).map((link, idx) => (
									<li key={`company-grid-${idx}-${link.title}`}>
										<NavGridCard link={link} className="min-h-36" />
									</li>
								))}
								<div className="col-span-2 grid grid-cols-3 gap-x-4">
									{companyLinks.slice(2, 5).map((link, idx) => (
										<li key={`company-large-${idx + 2}-${link.title}`}>
											<NavLargeItem href={link.href} link={link} />
										</li>
									))}
								</div>
							</ul>
							<ul className="space-y-2 p-4">
								{companyLinks.slice(5).map((link, idx) => (
									<li key={`company-rest-${idx + 5}-${link.title}`}>
										<NavLargeItem href={link.href} link={link} />
									</li>
								))}
							</ul>
						</div>
					</NavigationMenuContent>
				</NavigationMenuItem>
				<NavigationMenuItem>
					<NavigationMenuLink className="cursor-pointer">Pricing</NavigationMenuLink>
				</NavigationMenuItem>
			</NavigationMenuList>
		</NavigationMenu>
	);
}

function MobileNav() {
	const sections = [
		{ id: "product", name: "Product", list: productLinks },
		{ id: "company", name: "Company", list: companyLinks },
	];

	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button size="icon" variant="ghost" className="rounded-full lg:hidden">
					<MenuIcon className="size-5" />
				</Button>
			</SheetTrigger>
			<SheetContent className="bg-background/95 supports-[backdrop-filter]:bg-background/80 w-full gap-0 backdrop-blur-lg" showClose={false}>
				<div className="flex h-14 items-center justify-end border-b px-4">
					<SheetClose asChild>
						<Button size="icon" variant="ghost" className="rounded-full">
							<XIcon className="size-5" />
							<span className="sr-only">Close</span>
						</Button>
					</SheetClose>
				</div>
				<div className="grid gap-y-2 overflow-y-auto px-4 pt-5 pb-12">
					<Accordion type="single" collapsible>
						{sections.map((section) => (
							<AccordionItem key={section.id} value={section.id}>
								<AccordionTrigger className="capitalize hover:no-underline">
									{section.id}
								</AccordionTrigger>
								<AccordionContent className="space-y-1">
									<ul className="grid gap-1">
										{section.list.map((link) => (
											<li key={link.href}>
												<SheetClose asChild>
													<NavItemMobile item={link} href={link.href} />
												</SheetClose>
											</li>
										))}
									</ul>
								</AccordionContent>
							</AccordionItem>
						))}
					</Accordion>
				</div>
			</SheetContent>
		</Sheet>
	);
}

export default Navbar;
