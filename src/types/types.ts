export type Amount = {
  value: number;
  currency: string;
};

export type Journey = {
  origin: string;
  destination: string;
  departure: Date;
  arrival: Date;
  price: Amount;
};

export type FormErrors = {
  origin: string | null;
  destination: string | null;
  date: string | null;
  passengers: string | null;
};

export type Journeys = ReadonlyArray<Journey>;

export type JourneyParameters = {
  origin: string;
  destination: string;
  date: Date;
  nrOfPassengers: number;
};

export type SearchJourneys = (parameters: JourneyParameters) => Promise<Journeys>;
