export type PrivateCommunitySummary = {
  id: string;
  name: string;
  address?: string;
  city: string;
  country: string;
  postalCode?: string;
  phone?: string | null;
  email?: string | null;
  createdAt: string;
};

export type CreatePrivateCommunityInput = {
  name: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  phone?: string;
  email?: string;
};
