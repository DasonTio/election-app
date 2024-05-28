import {z} from 'zod'

const candidateGroupScheme = z.object({
    startAt: z.date(),
    endAt: z.date(),
    status: z.enum(['active', 'inactive'])
})

export {
    candidateGroupScheme
}