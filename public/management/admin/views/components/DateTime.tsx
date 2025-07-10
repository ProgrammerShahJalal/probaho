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

export function formattedDateTime(value: string | null): string {
    return value
        ? moment(value).format('Do MMM YY, h:mm A')
        : moment().format('Do MMM YY, h:mm A');
}

const DateTime: React.FC<Props> = ({ value, name, handler }: Props) => {
    const dateTimeInput = useRef<HTMLInputElement>(null);
    const [inputValue, setInputValue] = useState<string | null>(null);
    const [minDateTime, setMinDateTime] = useState<string>(
        moment().format('YYYY-MM-DDTHH:mm'), // Format required by datetime-local input
    );

    useEffect(() => {
        setInputValue(value);
        return () => {
            setInputValue(null);
        };
    }, [value]);

    function dateTimeHandler() {
        if (dateTimeInput.current?.value) {
            const selectedValue = dateTimeInput.current.value;
            const formattedTime = moment(selectedValue).format(
                'YYYY-MM-DD HH:mm:ss',
            );

            // Validate the selected datetime is not in the past
            if (moment(selectedValue).isSameOrAfter(moment())) {
                setInputValue(formattedTime);
                handler({
                    [name]: formattedTime,
                    key: name,
                    value: formattedTime,
                });
            } else {
                // Reset to current time if past datetime was somehow selected
                const currentTime = moment().format('YYYY-MM-DD HH:mm:ss');
                setInputValue(currentTime);
                if (dateTimeInput.current) {
                    dateTimeInput.current.value =
                        moment().format('YYYY-MM-DDTHH:mm');
                }
                handler({
                    [name]: currentTime,
                    key: name,
                    value: currentTime,
                });
            }
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
                className="text-capitalize d-block date-time-custom-control"
            >
                <input
                    type="datetime-local"
                    ref={dateTimeInput}
                    onClick={handleClick}
                    id={name}
                    name={name}
                    onChange={dateTimeHandler}
                    min={minDateTime}
                    className="form-control"
                />
            </label>
            <div className="form-control preview">
                {inputValue
                    ? formattedDateTime(inputValue)
                    : formattedDateTime(null)}
            </div>
        </>
    );
};

export default DateTime;
