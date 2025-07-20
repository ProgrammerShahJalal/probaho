import React from 'react';
export interface Props {
    label?: string;
    name: string;
    value?: string | number;
    values: { value: string; text: string }[];
    disabled?: boolean;
}

const Select: React.FC<Props> = ({ label, name, values, value, disabled }: Props) => {
    return (
        <>
            <label>{label ? label : name.replace(/_/g, ' ')}</label>
            <div className="form_elements">
                <select name={name} id={name} defaultValue={value} disabled={disabled}>
                    {values.map((i) => (
                        <option value={i.value} key={i.value}>
                            {i.text ? i.text : i.value}
                        </option>
                    ))}
                </select>
            </div>
        </>
    );
};

export default Select;
