import React, { useEffect, useRef, useState } from 'react';
import moment from 'moment/moment';

export interface Props {
    value: string | null;
    name: string;
    handler: (data: { [key: string]: any }) => void;
    default_value?: string | null;
}

const formatDate = (value: string | null) => {
    return value ? moment(value).format('DD MMMM YYYY') : moment().format('DD MMMM YYYY');
};

const DateEl: React.FC<Props> = ({ value, name, handler, default_value }) => {
    const date_input = useRef<HTMLInputElement>(null);
    const [inputValue, setInputValue] = useState<string>(
        default_value ? moment(default_value).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD')
    );

    useEffect(() => {
        if (value) {
            setInputValue(moment(value).format('YYYY-MM-DD'));
        }
    }, [value]);

    function dateHandler(event: React.ChangeEvent<HTMLInputElement>) {
        const newValue = event.target.value;
        setInputValue(newValue);
        handler({ [name]: newValue });
    }

 const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        const target = event.target as HTMLInputElement;
        if (target?.showPicker) {
            target.showPicker();
        }
    };

    return (
        <div>
            <label htmlFor={name} className="text-capitalize d-block date_custom_control">
                <input
                    type="date"
                    ref={date_input}
                    onClick={handleClick}
                    id={name}
                    name={name}
                    onChange={dateHandler}
                    className="form-control"
                    value={inputValue}
                />
            </label>
            {/* <div className="form-control preview">{formatDate(inputValue)}</div> */}
        </div>
    );
};

export default DateEl;
