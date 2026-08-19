import { z } from 'zod';

export const passwordValidation = z
  .string()
  .min(8, 'Password must be at least 8 characters long')
  .max(100, 'Password cannot exceed 100 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

export const signupSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Name is required')
      .min(2, 'Name must be at least 2 characters long')
      .max(50, 'Name cannot exceed 50 characters')
      .trim(),
  
    username: z
      .string()
      .min(1, 'Username is required')
      .min(3, 'Username must be at least 3 characters long')
      .max(30, 'Username cannot exceed 30 characters')
      .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')
      .trim()
      .toLowerCase(),
  
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Invalid email address format')
      .trim()
      .toLowerCase(),
  
    password: passwordValidation,
  
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
  
    path: ['confirmPassword'],
  });



export const loginSchema = z.object({
  loginIdentifier: z
    .string()
    .trim()
    .min(1, 'Email or Username is required')
    .min(3, 'Identifier must be at least 3 characters long'),

  password: z
    .string()
    .min(1, 'Password is required'),
});



export const agentInputSchema = z.object({
  prompt:z
  .string()
  .min(1,'Prompt is required')
  .max(10_000,'Prompt cannot exceed 10,000 characters')
  .trim(),

  sessionId:z.
  string()
  .uuid('sessionId must be a valid UUID')
  .optional(),


  context:z
  .array(z.string())
  .max(20,'Cannot inlcude more than 20 context items')
  .optional(),

  maxDurationSeconds:z
  .number()
  .int()
  .min(5)
  .max(120)
  .default(60),
})

export type AgentInput    = z.infer<typeof agentInputSchema>
export type SignupInput   = z.infer<typeof signupSchema>;
export type SigninInput   = z.infer<typeof loginSchema>;
export type PasswordInput = z.infer<typeof passwordValidation>;
