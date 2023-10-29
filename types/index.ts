import { SortOrder } from "mongoose";

export interface UserValidation {
	profile_photo: string;
	bio: string;
	name: string;
	username: string;
}

export interface FetchUserParams {
	userId: string;
	pageNumber?: number;
	searchString?: string;
	pageSize?: number;
	sortBy?: SortOrder;
}