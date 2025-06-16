import React from 'react';

export interface Props {
    label?: string;
    name: string;
    placeholder?: string;
    type?: string;
    value?: string | number | null | any[];
    setter?: (response: unknown) => void;
    referance_data?: object;
}

const TextArea: React.FC<Props> = ({
    label,
    name,
    placeholder,
    type,
    value,
    setter,
    ...props
}: Props) => {
    // Format the value for display: if it's an array or object, stringify it with indentation
    const displayValue = React.useMemo(() => {
        if (typeof value === 'string') {
            try {
                const parsed = JSON.parse(value);
                if (Array.isArray(parsed) || typeof parsed === 'object') {
                    return JSON.stringify(parsed, null, 2); // Pretty-print with 2-space indentation
                }
            } catch {
                return value; // If parsing fails, treat as plain string
            }
        } else if (Array.isArray(value) || typeof value === 'object') {
            return JSON.stringify(value, null, 2);
        }
        return value || '';
    }, [value]);

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (setter) {
            setter({
                value: event.target.value,
                referance_data: props.referance_data,
            });
        }
    };

    return (
        <>
            <label htmlFor={name}>
                {label ? label : name.replaceAll('_', ' ')}
            </label>
            <div className="form_elements">
                <textarea
                    placeholder={
                        placeholder ? placeholder : name.replaceAll('_', ' ')
                    }
                    rows={10} // Increased rows for better visibility of JSON
                    name={name}
                    id={name}
                    defaultValue={displayValue}
                    onChange={handleChange}
                />
            </div>
        </>
    );
};

export default TextArea;
