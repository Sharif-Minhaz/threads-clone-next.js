import AccountProfile from "@/components/forms/AccountProfile";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";

export default async function page() {
	const user = await currentUser();

	const userInfo = await fetchUser(user?.id || "");

	const userData = {
		id: user?.id,
		objectId: userInfo?._id,
		username: userInfo?.username || user?.username,
		name: userInfo?.name || user?.firstName || "",
		bio: userInfo?.bio || "",
		image: userInfo?.image || user?.imageUrl,
	};

	return (
		<main className="max-auto flex max-w-3xl flex-col px-10 py-20 justify-center">
			<h1 className="head-text">Onboarding</h1>
			<p className="text-base-regular mt-3 text-light-2">
				Complete your profile now to start using threads
			</p>

			<section className="mt-9 bg-dark-2 p-10">
				{/* @ts-ignore */}
				<AccountProfile btnTitle="Continue" user={userData} />
			</section>
		</main>
	);
}
