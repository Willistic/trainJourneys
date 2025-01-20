import { parseAsInteger, useQueryState } from "nuqs";
import React, { useEffect, useRef, useState } from "react";
import useLatest from "../hooks/useLatest";
import type { FormErrors, JourneyParameters } from "../types/types";
import { isDateInPast } from "../utils";
import SearchButton from "./SearchButton";

interface SearchFormProps {
	onSubmit: (parameters: JourneyParameters) => void;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSubmit }) => {
	// Use the useQueryState hook to manage the state of the form fields and also sync form values with the URL
	const [origin, setOrigin] = useQueryState("origin");
	const [destination, setDestination] = useQueryState("destination");
	const [date, setDate] = useQueryState("date");
	// parseInt is used to parse the value as an integer
	const [passengers, setPassengers] = useQueryState(
		"passengers",
		parseAsInteger
	);

	// This variable will tell us whether the user has started typing or not
	// I'll use this to delay the validation until the user has interacted with the form
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

	// This useEffect checks for validating the origin field whenever the origin value changes
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

	// this useEffect checks for validating the destination field whenever the destination value changes
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

	// this useEffect checks for validating the date field whenever the date value changes
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

	// this useEffect checks for validating the passengers field whenever the passengers value changes
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

	// Check if the form is valid
	const isValid = !!(
		origin &&
		destination &&
		date &&
		!isDateInPast(new Date(date)) &&
		passengers &&
		passengers >= 1 &&
			passengers <= 10
	)

	// Handle the date change event
	const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const selectedDate = e.target.value;
		formChanged.current = true;
		setDate(selectedDate);
	};

	// Handle the form submission
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
			<div className='flex-col'>
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
			<div className='flex-col'>
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
			<div className='flex-col'>
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
			<div className='flex-col'>
				<label htmlFor='passengers'>Passengers</label>
				<input
					id='passengers'
					type='number'
					value={passengers || ""}
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
			<SearchButton isValid={isValid} />
		</form>
	);
};

export default SearchForm;
