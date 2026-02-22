import z from 'zod'

export const LoginFormSchema = z.object({
  email: z.email(),
  password: z.string().min(1, 'Password is required'),
})
export type LoginFormSchemaType = z.infer<typeof LoginFormSchema>

export const SignupSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters long'),
  email: z.email(),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  postcode: z.string().optional(),
})
export type SignupSchemaType = z.infer<typeof SignupSchema>
