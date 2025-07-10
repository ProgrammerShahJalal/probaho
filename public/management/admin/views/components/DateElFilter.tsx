import React, { useEffect, useRef, useState } from 'react';
import moment from 'moment/moment';

export interface Props {
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

const DateElFilter: React.FC<Props> = ({ value, name, handler }: Props) => {
    const date_input = useRef<HTMLInputElement>(null);
    const [input_value, setInput_value] = useState<string | null>(null);
    // const [minDate, setMinDate] = useState<string>(
    //     moment().format('YYYY-MM-DD'),
    // );

    useEffect(() => {
        setInput_value(value);
        return () => {
            setInput_value(null);
        };
    }, [value]);

    function date_handler() {
        if (date_input?.current?.value) {
            const input_value = date_input.current.value;
            setInput_value(input_value);
            handler({
                [name]: input_value,
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
            <label
                htmlFor={name}
                className="text-capitalize d-block date_custom_control"
            >
                <input
                    type="date"
                    ref={date_input}
                    onClick={handleClick}
                    id={name}
                    name={name}
                    onChange={date_handler}
                    className="form-control"
                />
            </label>
            <div className="form-control preview">
                {input_value ? formated_date(input_value) : formated_date(null)}
            </div>
        </>
    );
};

export default DateElFilter;
