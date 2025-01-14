import React, { useState } from "react";
import { searchJourneys } from "./api/searchJourneys";
import Loader from "./components/Loader";
import SearchForm from "./components/SearchForm";
import SearchResults from "./components/SearchResults";
import { JourneyParameters, Journeys } from "./types/types";

const App: React.FC = () => {
	const [journeys, setJourneys] = useState<Journeys>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleSearchSubmit = async (parameters: JourneyParameters) => {
		setLoading(true);
		setError(null);
		try {
			// Fetch journeys from the search API, passing the parameters entered by the user
			const results = await searchJourneys(parameters);
			setJourneys(results);
		} catch {
			setError("An error occurred while fetching the journeys.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div>
			<h1>Train Journey Search</h1>
			<SearchForm onSubmit={handleSearchSubmit} />
			{loading ? (
				<Loader />
			) : (
				<SearchResults journeys={journeys} error={error} />
			)}
		</div>
	);
};

export default App;
