import React from "react";

interface SearchButtonProps {
	isValid: boolean;
}

const SearchButton: React.FC<SearchButtonProps> = ({ isValid }) => {
	return (
		<button type='submit' disabled={!isValid}>
			Search
		</button>
	);
};

export default SearchButton;
