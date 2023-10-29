"use server";

import { connectToDB } from "../mongoose";
import Thread from "@/lib/models/thread.model";
import User from "@/lib/models/user.model";
import { revalidatePath } from "next/cache";

interface Props {
	text: string;
	author: string;
	communityId: string | null;
	path: string;
}

export async function createThread({ text, author, communityId, path }: Props) {
	try {
		connectToDB();

		const createdThread = await Thread.create({
			text,
			author,
			community: null,
		});

		//update user model
		await User.findByIdAndUpdate(author, {
			$push: { threads: createdThread._id },
		});

		revalidatePath(path);
	} catch (error: any) {
		throw new Error(`Failed to create thread ${error.message}`);
	}
}

export async function fetchThreads(pageNumber = 1, pageSize = 10) {
	try {
		connectToDB();

		const skipAmount = (pageNumber - 1) * pageSize;

		const threads = await Thread.find({ parentId: { $in: [null, undefined] } })
			.sort({
				createdAt: "desc",
			})
			.skip(skipAmount)
			.limit(pageSize)
			.populate({
				path: "author",
				model: User,
			})
			.populate({
				path: "children",
				populate: {
					path: "author",
					model: User,
					select: "_id name parentId image",
				},
			});

		const totalPostCount = await Thread.countDocuments({
			parentId: { $in: [null, undefined] },
		});

		const isNext = totalPostCount > skipAmount + threads.length;
		
		return { threads, isNext };
	} catch (error: any) {
		throw new Error(`Failed to fetch threads ${error.message}`);
	}
}

export async function fetchThreadById(id: string) {
	try {
		connectToDB();

		const thread = await Thread.findById(id)
			.populate({
				path: "author",
				model: User,
				select: "_id id name image",
			}) // Populate the author field with _id and username
			// .populate({
			// 	path: "community",
			// 	model: Community,
			// 	select: "_id id name image",
			// }) // Populate the community field with _id and name
			.populate({
				path: "children", // Populate the children field
				populate: [
					{
						path: "author", // Populate the author field within children
						model: User,
						select: "_id id name parentId image", // Select only _id and username fields of the author
					},
					{
						path: "children", // Populate the children field within children
						model: Thread, // The model of the nested children (assuming it's the same "Thread" model)
						populate: {
							path: "author", // Populate the author field within nested children
							model: User,
							select: "_id id name parentId image", // Select only _id and username fields of the author
						},
					},
				],
			});

		return thread;
	} catch (error: any) {
		throw new Error(`Failed to fetch thread ${error.message}`);
	}
}

export async function addCommentToThread(threadId: string, commentText: string, userId: string, path: string) {
	try {
		connectToDB();

		const originalThread = await Thread.findById(threadId);

		if(!originalThread) throw new Error("Parent thread not found");

		const commentThread = await Thread.create({
			parentId: threadId,
			author: userId,
			text: commentText,
		});

		originalThread.children.push(commentThread._id);
		await originalThread.save();

		revalidatePath(path);

	} catch (error: any) {
		throw new Error(`Failed to add to thread ${error.message}`);
	}
}