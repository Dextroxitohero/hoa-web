export const paymentMethods = [
  "CASH",
  "TRANSFER",
  "CARD",
  "SPEI",
  "CHECK",
  "OTHER",
] as const;

export type PaymentMethod = (typeof paymentMethods)[number];

export type Pago = {
  id: string;
  tenantId: string;
  homeId: string;
  paymentDate: string;
  monthLabel: string;
  amount: string;
  paymentMethod: PaymentMethod;
  referenceNumber?: string | null;
  paymentNumber?: string | null;
  createdAt: string;
  home: {
    homeNumber: string;
  };
};

export type PagoInput = {
  homeId: string;
  paymentDate: string;
  monthLabel: string;
  amount: number;
  paymentMethod: PaymentMethod;
  referenceNumber?: string;
  paymentNumber?: string;
};
