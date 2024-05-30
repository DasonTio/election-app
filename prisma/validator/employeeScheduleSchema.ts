import {z} from 'zod'

const employeeScheduleSchema = z.object({
    divisionId: z.number().optional().nullable(),
    name: z.string(),
    description: z.string(),
    startAt: z.date(),
    endAt: z.date()
})

export default employeeScheduleSchema