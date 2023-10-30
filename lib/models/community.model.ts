import { model, Schema, models } from "mongoose";

const communitySchema = new Schema({
	id: {
		type: String,
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	username: {
		type: String,
		required: true,
		unique: true,
	},
	bio: String,
	image: String,
	createdBy: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	onboarded: {
		type: Boolean,
		default: false,
	},
	threads: [
		{
			type: Schema.Types.ObjectId,
			ref: "Thread",
		},
	],
	members: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

const Community = models.Community || model("Community", communitySchema);

export default Community;
