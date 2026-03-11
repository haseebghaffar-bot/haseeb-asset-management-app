import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
});

export const passwordRules = {
  minLength: (val: string) => val.length >= 8,
  hasUpper: (val: string) => /[A-Z]/.test(val),
  hasLower: (val: string) => /[a-z]/.test(val),
  hasNumber: (val: string) => /[0-9]/.test(val),
  hasSpecial: (val: string) => /[^A-Za-z0-9]/.test(val),
};

export const signUpSchema = z
  .object({
    email: z.string().min(1, 'Email is required').email('Invalid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .refine(passwordRules.hasUpper, 'Must contain at least one uppercase letter')
      .refine(passwordRules.hasLower, 'Must contain at least one lowercase letter')
      .refine(passwordRules.hasNumber, 'Must contain at least one number')
      .refine(passwordRules.hasSpecial, 'Must contain at least one special character'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type SignUpFormData = z.infer<typeof signUpSchema>;

export function calculatePasswordStrength(password: string): number {
  if (!password) return 0;
  let score = 0;
  if (passwordRules.minLength(password)) score++;
  if (passwordRules.hasUpper(password)) score++;
  if (passwordRules.hasNumber(password)) score++;
  if (passwordRules.hasSpecial(password)) score++;
  return score;
}
