import React, { useEffect, useRef, useState } from 'react';
import moment from 'moment/moment';

export interface Props {
    value: string | null;
    name: string;
    handler: (data: { [key: string]: any }) => void;
    default_value: string | null;
}

// Format time for display
const formattedTime = (value: string): string => {
    return moment(value, 'HH:mm').format('h:mm A');
};

const Time: React.FC<Props> = ({ value, name, handler, default_value }) => {
    const timeInput = useRef<HTMLInputElement>(null);
    const [inputValue, setInputValue] = useState<string>('');

    useEffect(() => {
        if (default_value) {
            setInputValue(moment(default_value, 'HH:mm:ss').format('HH:mm'));
        } else {
            setInputValue(moment().format('HH:mm')); // Default to current time
        }
    }, [default_value]);

    function timeHandler(event: React.ChangeEvent<HTMLInputElement>) {
        const newValue = event.target.value;
        setInputValue(newValue); // Update the input field
        handler({ [name]: newValue }); // Send formatted time to the handler
    }

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        const target = event.target as HTMLInputElement;
        if (target?.showPicker) {
            target.showPicker();
        }
    };

    return (
        <div>
            <label htmlFor={name} className="text-capitalize d-block time-custom-control">
                <input
                    type="time"
                    ref={timeInput}
                    onClick={handleClick}
                    id={name}
                    name={name}
                    onChange={timeHandler}
                    className="form-control"
                    value={inputValue}
                />
            </label>
            {/* <div className="form-control preview">{formattedTime(inputValue)}</div> */}
        </div>
    );
};

export default Time;
