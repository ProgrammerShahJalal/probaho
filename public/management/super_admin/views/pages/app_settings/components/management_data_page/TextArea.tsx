import React from 'react';
export interface Props {
    label?: string;
    name: string;
    placeholder?: string;
    type?: string;
    value?: string | number | null;
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
                    rows={3}
                    name={name}
                    id={name}
                    defaultValue={value ? value : ''}
                    onChange={handleChange}
                />
            </div>
        </>
    );
};

export default TextArea;
