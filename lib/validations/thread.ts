import * as z from "zod";

export const ThreadValidation = z.object({
	thread: z.string().min(1, {
        message: "Minimum 1 character required for the new thread"
    }),
    accountId: z.string().min(1),
});

export const CommentValidation = z.object({
	thread: z.string().min(1, {
        message: "Minimum 1 character required for the new thread"
    }),
});
