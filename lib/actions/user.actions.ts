"use server";

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import Thread from "../models/thread.model";
import { connectToDB } from "../mongoose";

export async function updateUser(
	userId: string,
	name: string,
	username: string,
	bio: string,
	image: string,
	path: string
): Promise<void> {
	try {
		connectToDB();

		await User.findOneAndUpdate(
			{ id: userId },
			{
				name,
				username: username.toLocaleLowerCase(),
				image,
				bio,
				onboarded: true,
			},
			{ upsert: true }
		);

		if (path === "/profile/edit") {
			revalidatePath(path);
		}
	} catch (error: any) {
		throw new Error(`Failed to update/create user ${error.message}`);
	}
}

export async function fetchUser(userId: string) {
	try {
		connectToDB();

		return await User.findOne({id: userId})
		// .populate({
		// 	path: "communities",
		// 	model: "Community"
		// })
	} catch (error: any) {
		throw new Error(`Failed to fetch user ${error.message}`)
	}
}

export async function fetchUserPosts(userId: string) {
	try {
		connectToDB();

		const threads = await User.findOne({ id: userId }).populate({
			path: "threads",
			model: Thread,
			populate: [
				// {
				// 	path: "community",
				// 	model: Community,
				// 	select: "name id image _id", // Select the "name" and "_id" fields from the "Community" model
				// },
				{
					path: "children",
					model: Thread,
					populate: {
						path: "author",
						model: User,
						select: "name image id", // Select the "name" and "_id" fields from the "User" model
					},
				},
			],
		});
		return threads; 
	} catch (error: any) {
		throw new Error(`Failed to fetch user's posts ${error.message}`);
	}
}