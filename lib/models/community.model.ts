import { model, Schema, models } from "mongoose";

const communitySchema = new Schema({
	
});

const Community = models.Community || model("Community", communitySchema);

export default Community;