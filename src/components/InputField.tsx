import React from "react";

interface InputFieldProps {
	id: string;
	label: string;
	value: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	error: string | null;
	required?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
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
				type='text'
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

export default InputField;
