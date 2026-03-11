import { z } from 'zod';
import { AssetCategory, AssetStatus, AssetCondition } from '@/types';

export const assetSchema = z.object({
  name: z.string().min(1, 'Asset Name is required').max(255, 'Name cannot exceed 255 characters'),
  category: z.nativeEnum(AssetCategory, {
    errorMap: () => ({ message: 'Asset Category is required' }),
  }),
  status: z.nativeEnum(AssetStatus).optional(),
  description: z.string().max(1000, 'Description cannot exceed 1000 characters').optional(),
  serialNumber: z.string().max(100, 'Serial number too long').optional(),
  location: z.string().max(255, 'Location too long').optional(),
  purchasePrice: z
    .number({
      invalid_type_error: 'Price must be a number',
    })
    .min(0, 'Price cannot be negative')
    .optional()
    .or(z.literal('')),
  condition: z.nativeEnum(AssetCondition).optional(),
  purchaseDate: z.string().optional(),
  notes: z.string().max(2000, 'Notes too long').optional(),
});

export type AssetSchemaInput = z.infer<typeof assetSchema>;
