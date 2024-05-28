import {z} from "zod"

const employeeDivisionSchema = z.object({
    name: z.string()
})

export default employeeDivisionSchema