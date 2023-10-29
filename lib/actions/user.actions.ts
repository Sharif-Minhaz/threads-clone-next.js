"use server";

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import Thread from "../models/thread.model";
import { connectToDB } from "../mongoose";
import { FetchUserParams } from "@/types";
import { FilterQuery } from "mongoose";

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

		return await User.findOne({ id: userId });
		// .populate({
		// 	path: "communities",
		// 	model: "Community"
		// })
	} catch (error: any) {
		throw new Error(`Failed to fetch user ${error.message}`);
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

export async function fetchUsers({
	userId,
	pageNumber = 1,
	searchString = "",
	pageSize = 10,
	sortBy = "desc",
}: FetchUserParams) {
	try {
		connectToDB();

		const skipAmount = (pageNumber - 1) * pageSize;

		const regex = new RegExp(searchString, "i");

		const query: FilterQuery<typeof User> = {
			id: { $ne: userId },
		};

		if (searchString !== "") {
			query.$or = [{ username: { $regex: regex } }, { name: { $regex: regex } }];
		}

		const sortOption = {
			createdAt: sortBy,
		};

		const [users, totalUsersCount] = await Promise.all([
			User.find(query).limit(pageSize).skip(skipAmount).sort(sortOption),
			User.countDocuments(query),
		]);

		const isNext = totalUsersCount > skipAmount + users.length;

		return { users, isNext };
	} catch (error: any) {
		throw new Error(`Failed to fetch user's data ${error.message}`);
	}
}

export async function getActivity(userId: string) {
	try {
		connectToDB();

		const userThreads = await Thread.find({ author: userId });

		// Collect all the child thread ids (replies) from the 'children' field of each user thread
		const childThreadIds = userThreads.reduce((acc, userThread) => {
			return acc.concat(userThread.children);
		}, []);

		const replies = await Thread.find({
			_id: { $in: childThreadIds },
			author: { $ne: userId },
		}).populate({
			path: "author",
			model: User,
			select: "name image _id",
		});

		return replies;
	} catch (error: any) {
		throw new Error(`Failed to fetch activity data ${error.message}`);
	}
}
