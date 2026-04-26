export type AuthUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  tenantId: string | null;
  roles: string[];
};

export type LoginInput = {
  email: string;
  password: string;
};

export type SignupInput = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  tenantId?: string;
};

export type BootstrapSuperadminInput = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  bootstrapKey: string;
};
