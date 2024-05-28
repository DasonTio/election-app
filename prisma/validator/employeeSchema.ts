import {z} from "zod"

const employeeSchema = z.object({
    userId: z.string(),
    divisionId: z.number()
})

export default employeeSchema

