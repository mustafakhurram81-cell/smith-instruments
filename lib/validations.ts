import { z } from 'zod';

export const contactSchema = z.object({
  user_name: z.string().min(2, "Name must be at least 2 characters").max(100),
  phone: z.string().optional(),
  user_email: z.string().email("Please enter a valid email address").max(100),
  country: z.string().optional(),
  interest: z.string().min(1, "Please select an area of interest"),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000)
});

export type ContactFormValues = z.infer<typeof contactSchema>;

export const quoteSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Please enter a valid email address").max(100),
  phone: z.string().optional(),
  country: z.string().optional(),
  message: z.string().optional()
});

export type QuoteFormValues = z.infer<typeof quoteSchema>;
