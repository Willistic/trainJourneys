import { JourneyParameters, Journeys } from '../types/types';

export const searchJourneys = async (
  parameters: JourneyParameters
): Promise<Journeys> => {
  const searchDate = new Date(parameters.date)
  // Mock data
  const mockJourneys: Journeys = [
    {
      origin: 'Enschede',
      destination: 'Hengelo',
      departure: searchDate,
      arrival: new Date(searchDate.getTime() + 10 * 60 * 1000),
      price: {
        value: 6.0 * parameters.nrOfPassengers,
        currency: 'EUR',
      },
    },
    {
      origin: 'Enschede',
      destination: 'Hengelo',
      departure: searchDate,
      arrival: new Date(searchDate.getTime() + 30 * 60 * 1000),
      price: {
        value: 5.0 * parameters.nrOfPassengers,
        currency: 'EUR',
      },
    },
    {
      origin: 'Enschede',
      destination: 'Almelo',
      departure: searchDate,
      arrival: new Date(searchDate.getTime() + 10 * 60 * 1000),
      price: {
        value: 7.5 * parameters.nrOfPassengers,
        currency: 'EUR',
      },
    },
  ];

  // Filter journeys based on origin, destination, and departure date
  const filteredJourneys = mockJourneys.filter(journey => {
    const journeyDate = new Date(journey.departure);
    const searchDate = new Date(parameters.date);
    
    // Check if the journey date is the same as the search date
    const isSameDay = 
      journeyDate.getFullYear() === searchDate.getFullYear() &&
      journeyDate.getMonth() === searchDate.getMonth() &&
      journeyDate.getDate() === searchDate.getDate();

    return journey.origin.toLowerCase() === parameters.origin.toLowerCase() &&
           journey.destination.toLowerCase() === parameters.destination.toLowerCase() &&
           isSameDay;
  });

  return new Promise((resolve) => setTimeout(() => resolve(filteredJourneys), 1000));
};
