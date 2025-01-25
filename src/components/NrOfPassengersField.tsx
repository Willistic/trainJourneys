import React from "react";

interface NumberFieldProps {
	id: string;
	label: string;
	value: number | string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	error: string | null;
	min: number;
	max: number;
	required?: boolean;
}

const NrOfPassengersField: React.FC<NumberFieldProps> = ({
	id,
	label,
	value,
	onChange,
	error,
	min,
	max,
	required = true,
}) => {
	return (
		<div className='flex-col'>
			<label htmlFor={id}>{label}</label>
			<input
				id={id}
				type='number'
				value={value}
				onChange={onChange}
				min={min}
				max={max}
				aria-invalid={!!error}
				aria-describedby={`${id}-error`}
				required={required}
			/>
			{error && (
				<span id={`${id}-error`} className='error'>
					{error}
				</span>
			)}
		</div>
	);
};

export default NrOfPassengersField;
