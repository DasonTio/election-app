import {z} from "zod"

const votePlaceSchema = z.object({
    description: z.string(),
    address: z.string(),
    latitude: z.number(),
    longitude: z.number(),
})

export default votePlaceSchema