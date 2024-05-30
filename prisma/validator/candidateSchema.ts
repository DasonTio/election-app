import {z} from "zod"

const candidateSchema = z.object({
    candidateGroupId: z.number(),
    chiefName: z.string(),
    deputyName: z.string(),
    vision: z.string(),
    mission: z.string(),
    // status: z.enum(["active", "inactive"]),
})

export default candidateSchema