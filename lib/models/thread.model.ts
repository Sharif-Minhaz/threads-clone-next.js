import {Schema, model, models} from "mongoose";

const threadSchema = new Schema({
    text: {
        type: String,
        required: true,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    community: {
        type: Schema.Types.ObjectId,
        ref: "Community",
    },
    parentId: String,
    children: [
        {type: Schema.Types.ObjectId, ref: "Thread"}
    ]
}, {
    timestamps: true,
});

const Thread = models.Thread || model("Thread", threadSchema);

export default Thread;