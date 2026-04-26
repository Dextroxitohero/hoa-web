export type Reserva = {
  id: string;
  homeId: string;
  reservationDate: string;
  contactName: string;
  contactPhone: string;
  contactEmail?: string | null;
  startsAt: string;
  endsAt: string;
  createdAt: string;
};

export type ReservaInput = {
  homeId: string;
  reservationDate: string;
  contactName: string;
  contactPhone: string;
  contactEmail?: string;
  startsAt: string;
  endsAt: string;
};
