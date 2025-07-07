import React, { useEffect, useRef, useState } from 'react';
import moment from 'moment/moment';

export interface Props {
    label?: string;
    value: string | null;
    name: string;
    handler: (data: { [key: string]: any }) => void;
}

interface TargetWithPicker {
    showPicker?: () => void;
}

export function formated_date(value: string | null) {
    return value
        ? moment(value).format('DD MMMM YYYY')
        : moment().format('DD MMMM YYYY');
}

const DateEl: React.FC<Props> = ({ value, name, label, handler }: Props) => {
    const date_input = useRef<HTMLInputElement>(null);
    const [input_value, setInput_value] = useState<string | null>(null);
    const [minDate, setMinDate] = useState<string>(
        moment().format('YYYY-MM-DD'),
    );

    useEffect(() => {
        setInput_value(value);
        return () => {
            setInput_value(null);
        };
    }, [value]);

    function date_handler() {
        if (date_input?.current?.value) {
            // Always send the date as a string in YYYY-MM-DD format
            const input_value = date_input.current.value;
            setInput_value(input_value);
            handler({
                [name]: input_value, // string only, no Date object
                key: name,
                value: input_value,
            });
        }
    }

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        const target = event.target as TargetWithPicker | null;
        if (target?.showPicker) {
            target.showPicker();
        }
    };

    return (
        <>
            {label && (
                <label htmlFor={name} className="form-label text-capitalize mb-6">
                    {label}
                </label>
            )}
            <label
                htmlFor={name || label}
                className="text-capitalize d-block date_custom_control"
                style={{ width: '100%' }}
            >
                <input
                    type="date"
                    ref={date_input}
                    onClick={handleClick}
                    id={name}
                    name={name}
                    onChange={date_handler}
                    min={minDate}
                    className="form-control"
                />
            </label>
            {input_value && (
                <div className="form-control preview">
                    {formated_date(input_value)}
                </div>
            )}
        </>
    );
};

export default DateEl;
