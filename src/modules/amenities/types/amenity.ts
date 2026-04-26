export type Amenity = {
  id: string;
  name: string;
  description?: string | null;
  bookingCost: string;
  cleaningCost: string;
  openingTime: string;
  closingTime: string;
  createdAt: string;
};

export type AmenityInput = {
  name: string;
  description?: string;
  bookingCost: number;
  cleaningCost: number;
  openingTime: string;
  closingTime: string;
};
