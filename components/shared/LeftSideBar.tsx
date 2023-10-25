"use client";

import { sidebarLinks } from "@/constants";
import { SignOutButton, SignedIn } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function LeftSideBar() {
	const router = useRouter();
	const pathname = usePathname();

	return (
		<section className="custom-scrollbar leftsidebar">
			<div className="flex w-full flex-1 flex-col gap-6 px-6">
				{sidebarLinks.map((link) => {
					const isActive =
						pathname.includes(link.route) &&
						(link.route.length > 1 || pathname === link.route);

					return (
						<Link
							className={`leftsidebar_link ${isActive && "bg-primary-500"}`}
							key={link.label}
							href={link.route}
						>
							<Image src={link.imgURL} width={24} height={24} alt={link.label} />
							<span className="text-light-1 max-lg:hidden">{link.label}</span>
						</Link>
					);
				})}
			</div>

			<div className="mt-10 px-6">
				<SignedIn>
					<SignOutButton signOutCallback={() => router.push("/sign-in")}>
						<div className="flex cursor-pointer gap-4 p-4">
							<Image src="/assets/logout.svg" alt="logout" width={24} height={24} />
							<span className="text-light-2 max-lg:hidden">Logout</span>
						</div>
					</SignOutButton>
				</SignedIn>
			</div>
		</section>
	);
}
