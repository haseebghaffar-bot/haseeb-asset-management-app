export enum AssetCategory {
  Electronics = 'Electronics',
  Furniture = 'Furniture',
  Software = 'Software',
  Other = 'Other',
}

export enum AssetStatus {
  Active = 'Active',
  Inactive = 'Inactive',
  Archived = 'Archived',
  Disposed = 'Disposed',
}

export enum AssetCondition {
  Excellent = 'Excellent',
  Good = 'Good',
  Fair = 'Fair',
  Poor = 'Poor',
}

export enum AuditAction {
  CREATED = 'CREATED',
  UPDATED = 'UPDATED',
  DELETED = 'DELETED',
  VIEWED = 'VIEWED',
  DOWNLOADED = 'DOWNLOADED',
}

export enum Theme {
  Light = 'light',
  Dark = 'dark',
}

export enum UserStatus {
  Active = 'Active',
  Inactive = 'Inactive',
  Suspended = 'Suspended',
}

export interface Tag {
  id: string;
  name: string;
  color: string;
  assetId?: string;
  userId?: string;
  createdAt?: string;
}

export interface AssetLog {
  id: string;
  action: AuditAction;
  assetId: string;
  userId: string;
  timestamp: string;
  details?: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface Asset {
  id: string;
  name: string;
  description?: string | null;
  category: AssetCategory;
  imageUrl?: string | null;
  imageName?: string | null;
  userId: string;
  status: AssetStatus;
  serialNumber?: string | null;
  location?: string | null;
  purchaseDate?: string | null;
  purchasePrice?: number | null;
  condition?: AssetCondition | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  tags?: { items: Tag[] };
  logs?: { items: AssetLog[] };
}

export interface UserProfile {
  id: string;
  email: string;
  name?: string | null;
  phone?: string | null;
  avatarUrl?: string | null;
  company?: string | null;
  department?: string | null;
  jobTitle?: string | null;
  theme: Theme;
  language: string;
  status: UserStatus;
  storageUsed: number;
  storageLimit: number;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string | null;
}

export interface CreateAssetInput {
  name: string;
  description?: string;
  category: AssetCategory;
  status?: AssetStatus;
  serialNumber?: string;
  location?: string;
  purchaseDate?: string;
  purchasePrice?: number;
  condition?: AssetCondition;
  notes?: string;
  imageFile?: File | null;
}

export interface UpdateAssetInput extends Partial<CreateAssetInput> {
  id: string;
  removeImage?: boolean;
}

export interface PaginationInfo {
  limit: number;
  nextToken?: string | null;
  total?: number;
}

export interface AssetFilter {
  category?: AssetCategory;
  status?: AssetStatus;
  condition?: AssetCondition;
  searchQuery?: string;
}
