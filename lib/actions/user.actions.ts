"use server";

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
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