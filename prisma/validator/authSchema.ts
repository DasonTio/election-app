import {z} from "zod"

const registerSchema = z.object({
    id: z.string().length(16),
    email: z.string().email(),
    name: z.string().min(1),
    password: z.string().min(6),
    birthDate: z.date(),
    address: z.string().min(1),
    role: z.enum(['user', 'admin', 'employee']).optional(),
    gender: z.enum(['male', 'female']),
    phoneNumber: z.string().min(12).max(15),
    ward: z.string().min(1),
    subDistrict: z.string().min(1),
    city: z.string().min(1),
    regency: z.string().min(1),
    province: z.string().min(1),
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6)
})

export {
    registerSchema,
    loginSchema
}