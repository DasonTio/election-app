import {z} from "zod"

const registerSchema = z.object({
    id: z.string().length(16),
    email: z.string().email({
        message:"please input your email correctly"
    }),
    name: z.string().min(1),
    password: z.string().min(6,{
        message:"please input your password correctly (min 6 chars)"
    }),
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
    email: z.string().email({
        message:"please input your email correctly"
    }),
    password: z.string().min(6,{
        message:"please input your password correctly (min 6 chars)"
    })
})

export {
    registerSchema,
    loginSchema
}