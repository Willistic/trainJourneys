import React, { useEffect, useRef, useState } from "react";
import { useQueryState, parseAsInteger } from "nuqs";
import useLatest from "../hooks/useLatest";
import { FormErrors, JourneyParameters } from "../types/types";
import { isDateInPast } from "../utils";
import InputField from "./InputField";
import DateField from "./DateField";
import NumberField from "./NrOfPassengersField";
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
		passengers >= 1 && passengers <= 10
	)

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		
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
			<InputField
				id='origin'
				label='Origin'
				value={origin || ""}
				onChange={(e) => {
					setOrigin(e.target.value);
					formChanged.current = true;
				}}
				error={errors.origin}
			/>
			<InputField
				id='destination'
				label='Destination'
				value={destination || ""}
				onChange={(e) => {
					setDestination(e.target.value);
					formChanged.current = true;
				}}
				error={errors.destination}
			/>
			<DateField
				id='date'
				label='Date'
				value={date || ""}
				onChange={(e) => {
					const selectedDate = e.target.value;
					formChanged.current = true;
					setDate(selectedDate);
				}}
				error={errors.date}
			/>
			<NumberField
				id='passengers'
				label='Passengers'
				value={passengers || ""}
				onChange={(e) => {
					setPassengers(Number(e.target.value));
					formChanged.current = true;
				}}
				min={1}
				max={10}
				error={errors.passengers}
			/>
			<SearchButton isValid={isValid} />
		</form>
	);
};

export default SearchForm;
