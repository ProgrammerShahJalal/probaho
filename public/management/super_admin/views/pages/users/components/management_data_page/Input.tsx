import React, { useState } from 'react';

export interface Props {
    label?: string;
    name: string;
    placeholder?: string;
    type?: string;
    value?: string | number | null;
    setter?: (response: unknown) => void;
    referance_data?: object;
    required?: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void; // Added onKeyDown prop
}

const Input: React.FC<Props> = ({
    label,
    name,
    placeholder,
    type,
    value,
    required,
    setter,
    onChange,
    onKeyDown, // Destructure onKeyDown
    ...props
}: Props) => {
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (setter) {
            setter({
                value: event.target.value,
                referance_data: props.referance_data,
            });
        }
    };

    const isPassword = name === 'password';

    return (
        <>
            <label htmlFor={name}>
                {label ? label : name.replaceAll('_', ' ')}
                {required && <span style={{ color: 'red' }}>*</span>}
            </label>
            <div style={{ position: 'relative' }}>
                <input
                    type={
                        isPassword
                            ? showPassword
                                ? 'text'
                                : 'password'
                            : type
                                ? type
                                : 'text'
                    }
                    placeholder={placeholder ? placeholder : name.replaceAll('_', ' ')}
                    name={name}
                    id={name}
                    defaultValue={value ? value : ''}
                    onChange={onChange ? onChange : handleChange}
                    onKeyDown={onKeyDown} // Pass onKeyDown to the input element
                    style={{
                        width: '100%',
                        paddingRight: isPassword ? '40px' : undefined,
                        paddingLeft: '10px',
                        height: '40px',
                        borderRadius: '6px',
                        border: '1px solid #444',
                        backgroundColor: '#2c2f36',
                        color: '#fff',
                    }}
                />

                {isPassword && (
                    <span
                        onClick={() => setShowPassword((v) => !v)}
                        style={{
                            position: 'absolute',
                            right: '12px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            cursor: 'pointer',
                            fontSize: '18px',
                            color: '#888',
                        }}
                        title={showPassword ? 'Hide password' : 'Show password'}
                    >
                        {showPassword ? (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                            </svg>
                        ) : (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.956 9.956 0 012.293-3.95m3.362-2.675A9.956 9.956 0 0112 5c4.478 0 8.268 2.943 9.542 7a9.973 9.973 0 01-4.293 5.03M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 3l18 18"
                                />
                            </svg>
                        )}
                    </span>
                )}
            </div>
        </>
    );
};

export default Input;