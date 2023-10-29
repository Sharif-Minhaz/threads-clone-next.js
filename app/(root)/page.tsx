import ThreadCard from "@/components/cards/ThreadCard";
import { fetchThreads } from "@/lib/actions/thread.actions";
import { currentUser } from "@clerk/nextjs";

export default async function Home() {
	const result = await fetchThreads(1, 10);
	const user = await currentUser();

	return (
		<>
			<h1 className="head-text text-left">Home</h1>
			<section className="flex flex-col gap-10 mt-9">
				{!result?.threads.length ? (
					<p className="no-result">No threads found</p>
				) : (
					<>
						{result.threads.map((thread) => (
							<ThreadCard
								key={thread._id}
								id={thread._id?.toString()}
								currentUserId={user?.id || ""}
								parentId={thread.parentId}
								content={thread.text}
								author={thread.author}
								// community={thread.community}
								createdAt={thread.createdAt}
								comments={thread.children}
							/>
						))}
					</>
				)}
			</section>
		</>
	);
}
