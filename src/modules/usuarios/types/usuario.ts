export const roleOptions = [
  "SUPERADMIN",
  "ADMIN_PRIVADA",
  "TESORERO",
  "PROPIETARIO",
  "RESIDENTE",
] as const;

export type UserRole = (typeof roleOptions)[number];

export type Usuario = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  tenantId?: string | null;
  isActive: boolean;
  createdAt: string;
  roles: { role: { name: UserRole } }[];
};

export type CreateUsuarioInput = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  tenantId?: string;
  roles: UserRole[];
};

export type UpdateUsuarioInput = Partial<CreateUsuarioInput> & {
  isActive?: boolean;
};
