"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname } from "next/navigation";
import { CommentValidation } from "@/lib/validations/thread";
import Image from "next/image";
import { addCommentToThread } from "@/lib/actions/thread.actions";

interface Props {
	threadId: string;
	currentUserImg: string;
	currentUserId: string;
}

export default function Comment({ threadId, currentUserImg, currentUserId }: Props) {
	const pathname = usePathname();

	const form = useForm({
		resolver: zodResolver(CommentValidation),
		defaultValues: {
			thread: "",
		},
	});

	const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
		await addCommentToThread(threadId, values.thread, currentUserId, pathname);

		form.reset();
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="comment-form">
				<FormField
					control={form.control}
					name="thread"
					render={({ field }) => (
						<FormItem className="flex gap-3 items-center w-full">
							<Image
								src={currentUserImg}
								alt="Profile image"
								width={48}
								height={48}
								className="object-cover rounded-full"
							/>
							<FormControl className="border-none bg-transparent">
								<Input
									{...field}
									type="text"
									placeholder="comment"
									className="no-focus outline-none text-light-2"
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type="submit" className="comment-form_btn">
					Reply
				</Button>
			</form>
		</Form>
	);
}
