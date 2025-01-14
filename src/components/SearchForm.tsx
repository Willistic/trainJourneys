import { parseAsInteger, useQueryState } from "nuqs";
import React, { useEffect, useRef, useState } from "react";
import useLatest from "../hooks/useLatest";
import type { FormErrors, JourneyParameters } from "../types/types";
import { isDateInPast } from "../utils";

interface SearchFormProps {
	onSubmit: (parameters: JourneyParameters) => void;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSubmit }) => {
	const [origin, setOrigin] = useQueryState("origin");
	const [destination, setDestination] = useQueryState("destination");
	const [date, setDate] = useQueryState("date");
	const [passengers, setPassengers] = useQueryState(
		"passengers",
		parseAsInteger
	);
	// This variable will tell us whether the user has started typing or not
	// We'll use this to delay the validation until the user has interacted with the form
	const formChanged = useRef(false);
	const [errors, setErrors] = useState<FormErrors>({
		origin: null,
		destination: null,
		date: null,
		passengers: null,
	});

	const latestOrigin = useLatest(origin);
	const latestDestination = useLatest(destination);
	const latestDate = useLatest(date);
	const latestPassengers = useLatest(passengers);

	// Trigger the search immediately on load
	// if all the data is available from the URL
	// using useLatest to be able to access the latest value
	// of the state from the useEffect (without having to add them as dependencies)
	useEffect(() => {
		if (
			latestOrigin &&
			latestDate &&
			latestDestination &&
			latestPassengers &&
			latestPassengers <= 10
		) {
			onSubmit({
				origin: latestOrigin,
				destination: latestDestination,
				date: new Date(latestDate),
				nrOfPassengers: latestPassengers,
			});
		}
	}, []);

	// This useEffect checks for errors (validation)
	useEffect(() => {
		if (!formChanged.current) return;
		if (!origin || !isValidLocation(origin)) {
			setErrors((prev) => ({
				...prev,
				origin: "Origin is required!",
			}));
		} else {
			setErrors((prev) => ({ ...prev, origin: null }));
		}
	}, [origin]);

	useEffect(() => {
		if (!formChanged.current) return;
		if (!destination || !isValidLocation(destination)) {
			setErrors((prev) => ({
				...prev,
				destination: "Destination is required!",
			}));
		} else {
			setErrors((prev) => ({ ...prev, destination: null }));
		}
	}, [destination]);

	useEffect(() => {
		if (!formChanged.current) return;
		if (!date || isDateInPast(new Date(date))) {
			setErrors((prev) => ({
				...prev,
				date: "Date is required and must be in the future!",
			}));
		} else {
			setErrors((prev) => ({ ...prev, date: null }));
		}
	}, [date]);

	useEffect(() => {
		if (!formChanged.current) return;
		if (!passengers || passengers < 1 || passengers > 10) {
			setErrors((prev) => ({
				...prev,
				passengers: "Passengers must be between 1 and 10!",
			}));
		} else {
			setErrors((prev) => ({ ...prev, passengers: null }));
		}
	}, [passengers]);

	// Regular expression to check if the input contains only letters and spaces
	const isValidLocation = (value: string) => /^[A-Za-z\s]+$/.test(value);

	const isValid =
		origin &&
		destination &&
		date &&
		!isDateInPast(new Date(date)) &&
		passengers &&
		passengers >= 1 &&
		passengers <= 10;

	const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const selectedDate = e.target.value;
		formChanged.current = true;
		setDate(selectedDate);

		// Validate if the selected date is in the past
		const today = new Date().toISOString().split("T")[0]; // Get the current date in yyyy-mm-dd format

		if (selectedDate < today) {
			// setErrorMessage("It has to be a present or a future date");
		} else {
			// setErrorMessage(null); // Clear the error if the date is valid
		}
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		// Validate the origin and destination fields
		if (
			!origin ||
			!isValidLocation(origin) ||
			!destination ||
			!isValidLocation(destination)
		) {
			return;
		}

		// If everything is valid, submit the form
		if (isValid && passengers && passengers >= 1) {
			onSubmit({
				origin,
				destination,
				date: new Date(date),
				nrOfPassengers: passengers,
			});
		}
	};

	return (
		<form onSubmit={handleSubmit} aria-labelledby='search-form-title'>
			<h1 id='search-form-title'>Search for a Journey</h1>
			<div>
				<label htmlFor='origin'>Origin</label>
				<input
					id='origin'
					type='text'
					value={origin || ""}
					onChange={(e) => {
						setOrigin(e.target.value);
						formChanged.current = true;
					}}
					aria-invalid={!!errors.origin}
					aria-describedby='origin-error'
					required
				/>
				{errors.origin && (
					<span id='origin-error' className='error'>
						{errors.origin}
					</span>
				)}
			</div>
			<div>
				<label htmlFor='destination'>Destination</label>
				<input
					id='destination'
					type='text'
					value={destination || ""}
					onChange={(e) => {
						setDestination(e.target.value);
						formChanged.current = true;
					}}
					aria-invalid={!!errors.destination}
					aria-describedby='destination-error'
					required
				/>
				{errors.destination && (
					<span id='destination-error' className='error'>
						{errors.destination}
					</span>
				)}
			</div>
			<div>
				<label htmlFor='date'>Date</label>
				<input
					id='date'
					type='date'
					value={date || ""}
					onChange={handleDateChange}
					aria-invalid={!!errors.date}
					aria-describedby='date-error'
					required
				/>
				{errors.date && (
					<span id='date-error' className='error'>
						{errors.date}
					</span>
				)}
			</div>
			<div>
				<label htmlFor='passengers'>Passengers</label>
				<input
					id='passengers'
					type='number'
					value={passengers || undefined}
					onChange={(e) => {
						setPassengers(Number(e.target.value));
						formChanged.current = true;
					}}
					aria-invalid={!!errors.passengers}
					aria-describedby='passengers-error'
					min='1'
					max='10'
					required
				/>
				{errors.passengers && (
					<span id='passengers-error' className='error'>
						{errors.passengers}
					</span>
				)}
			</div>
			<button type='submit' disabled={!isValid}>
				Search
			</button>
		</form>
	);
};

export default SearchForm;
