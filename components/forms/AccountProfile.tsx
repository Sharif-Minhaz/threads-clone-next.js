"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserValidation } from "@/lib/validations/user";
import Image from "next/image";
import { ChangeEvent, useState } from "react";
import { Textarea } from "../ui/textarea";
import { isBase64Image } from "@/lib/utils";
import { useUploadThing } from "@/lib/uploadthing";
import { updateUser } from "@/lib/actions/user.actions";
import { usePathname, useRouter } from "next/navigation";

interface Props {
	user: {
		id: string;
		objectId: string;
		bio: string;
		username: string;
		name: string;
		image: string;
	};
	btnTitle: string;
}

export default function AccountProfile({ user, btnTitle }: Props) {
    const [files, setFiles] = useState<File[]>([]);
	const { startUpload } = useUploadThing("media");
	const pathname = usePathname();
	const router = useRouter();

	const form = useForm({
		resolver: zodResolver(UserValidation),
		defaultValues: {
			profile_photo: user.image || "",
			bio: user.bio || "",
			name: user.name || "",
			username: user.username || "",
		},
	});

	async function onSubmit(values: z.infer<typeof UserValidation>) {
		const blobs = values.profile_photo;

		const hasImageChanged = isBase64Image(blobs);

		if(hasImageChanged) {
			const imgRes = await startUpload(files);

			if(imgRes && imgRes[0].url) {
				values.profile_photo = imgRes[0].url;
			}
		}

		await updateUser(
			user.id, 
			values.name, 
			values.username, 
			values.bio, 
			values.profile_photo, 
			pathname
		)

		if(pathname === "/profile/edit") {
			router.back();
		} else {
			router.push("/");
		}
	}

    function handleImage (
		e: ChangeEvent<HTMLInputElement>,
		fieldChange: (value: string) => void
	) {
		e.preventDefault();

		const fileReader = new FileReader();

		if (e.target.files && e.target.files.length > 0) {
			const file = e.target.files[0];
			setFiles(Array.from(e.target.files));

			if (!file.type.includes("image")) return;

			fileReader.onload = async (event) => {
				const imageDataUrl = event.target?.result?.toString() || "";
				fieldChange(imageDataUrl);
			};

			fileReader.readAsDataURL(file);
		}
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="space-y-8 flex justify-start flex-col gap-10"
			>
				<FormField
					control={form.control}
					name="profile_photo"
					render={({ field }) => (
						<FormItem className="flex items-center gap-4">
							<FormLabel className="account-form_image-label">
								{field.value ? (
									<Image
										src={field.value}
										priority
										alt="profile photo"
										width={96}
										height={96}
										className="rounded-full object-contain"
									/>
								) : (
									<Image
										src="/assets/profile.svg"
										alt="profile photo"
										width={24}
										height={24}
										className="object-contain"
									/>
								)}
							</FormLabel>
							<FormControl className="flex flex-1 text-base-semibold">
								<Input
									placeholder="Upload a photo"
									className="account-form_image-input text-light-2"
									type="file"
									accept="image/*"
									onChange={(e) => handleImage(e, field.onChange)}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem className="flex gap-3 w-full flex-col">
							<FormLabel className="text-base-semibold text-light-2">Name</FormLabel>
							<FormControl>
								<Input
									{...field}
									type="text"
									placeholder="Name"
									className="account-form_input no-focus"
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="username"
					render={({ field }) => (
						<FormItem className="flex gap-3 w-full flex-col">
							<FormLabel className="text-base-semibold text-light-2">
								Username
							</FormLabel>
							<FormControl>
								<Input
									{...field}
									type="text"
									placeholder="Username"
									className="account-form_input no-focus"
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="bio"
					render={({ field }) => (
						<FormItem className="flex gap-3 w-full flex-col">
							<FormLabel className="text-base-semibold text-light-2">Bio</FormLabel>
							<FormControl>
								<Textarea
									{...field}
									rows={10}
									placeholder="Enter your bio"
									className="account-form_input no-focus"
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button className="bg-primary-500" type="submit">
					Submit
				</Button>
			</form>
		</Form>
	);
}
