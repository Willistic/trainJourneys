import React from "react";

interface DateFieldProps {
	id: string;
	label: string;
	value: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	error: string | null;
	required?: boolean;
}

const DateField: React.FC<DateFieldProps> = ({
	id,
	label,
	value,
	onChange,
	error,
	required = true,
}) => {
	return (
		<div className='flex-col'>
			<label htmlFor={id}>{label}</label>
			<input
				id={id}
				type='date'
				value={value}
				onChange={onChange}
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

export default DateField;
