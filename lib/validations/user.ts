import * as z from "zod"

export const UserValidation = z.object({
    profile_photo: z.string().url().min(1),
    bio: z.string().min(3).max(1000),
    name: z.string().min(3).max(50),
    username: z.string().min(3).max(50),
})