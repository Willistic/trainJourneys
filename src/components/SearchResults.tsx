import React from "react";
import { Journey } from "../types/types";

interface SearchResultsProps {
	journeys: readonly Journey[];
	error?: string | null;
}

const SearchResults: React.FC<SearchResultsProps> = ({ journeys, error }) => {
	if (error) {
		return (
			<span className='error text-center block  margin-top-large'>
				An unexpected error occurred: {error}
			</span>
		);
	}

	if (journeys.length === 0) {
		return (
			<div className='block center text-center margin-top-large'>
				No results
			</div>
		);
	}

	// Helper function to format dates in dd-mm-yyyy format
	const formatDate = (date: Date) => {
		const day = date.getDate().toString().padStart(2, "0");
		const month = (date.getMonth() + 1).toString().padStart(2, "0");
		const year = date.getFullYear();
		return `${day}-${month}-${year}`;
	};

	// Helper function to format time in hh:mm format
	const formatTime = (date: Date) => {
		const hours = date.getHours().toString().padStart(2, "0");
		const minutes = date.getMinutes().toString().padStart(2, "0");
		return `${hours}:${minutes}`;
	};

	return (
		<div className='table-container'>
			<h2 className='text-center'>Possible Journeys</h2>
			<table>
				<thead>
					<tr>
						<th>Origin</th>
						<th>Destination</th>
						<th>Date</th>
						<th>Departure time</th>
						<th>Arrival time</th>
						<th>Price</th>
					</tr>
				</thead>
				<tbody>
					{journeys.map((journey, index) => {
						const departureDate = new Date(journey.departure);
						const arrivalDate = new Date(journey.arrival);
						const price = journey.price.value.toLocaleString(
							undefined,
							{ style: "currency", currency: "EUR" }
						);

						return (
							<tr key={index}>
								<td>{journey.origin}</td>
								<td>{journey.destination}</td>
								<td>{formatDate(departureDate)}</td>
								<td>{formatTime(departureDate)}</td>
								<td>{formatTime(arrivalDate)}</td>
								<td>{price}</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
};

export default SearchResults;
