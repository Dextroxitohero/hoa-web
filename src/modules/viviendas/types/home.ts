export type Home = {
  id: string;
  homeNumber: string;
  contactPhone?: string | null;
  contactEmail?: string | null;
  regulationSigned: boolean;
  createdAt: string;
};

export type CreateHomeInput = {
  homeNumber: string;
  contactPhone?: string;
  contactEmail?: string;
  regulationSigned?: boolean;
};
