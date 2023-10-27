import { model, Schema, models } from "mongoose";

const userSchema = new Schema({
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
	onboarded: {
		type: Boolean,
		default: false,
	},
	threads: [{ type: Schema.Types.ObjectId, ref: "Thread" }],
	community: [{ type: Schema.Types.ObjectId, ref: "Community" }],
});

const User = models.User || model("User", userSchema);

export default User;