import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../store';
import setup from '../../config/setup';
import { anyObject } from '../../../../../common_types/object';
import DropDownCheckbox from './DropDownCheckbox';
import DropDownSelectedItem from './DropDownSelectedItem';
import HeadSearch from '../all_data_page/HeadSearch';

export interface Props {
    name: string;
    get_selected_data: (data: { selectedList: anyObject[]; ids: string }) => void;
    multiple: boolean;
    disabled?: boolean;
    options?: anyObject[];
    default_value?: anyObject[];
}

const DropDown: React.FC<Props> = ({
    name,
    get_selected_data,
    multiple = false,
    disabled = false,
    options = [],
    default_value = [],
}) => {
    /** local states */
    const [showDropDownList, setShowDropDownList] = useState(false);
    const [selectedList, setSelectedList] = useState<anyObject[]>([]);
    const selected_items_input = useRef<HTMLInputElement>(null);

    // Initialize with default values
    useEffect(() => {
        if (default_value?.length) {
            setSelectedList(default_value);
        }
    }, [default_value]);

    /** update selected items */
    useEffect(() => {
        const ids = selectedList.map((i) => i.id).join(',');
        if (selected_items_input.current) {
            selected_items_input.current.value = `[${ids}]`;
        }
        get_selected_data({ selectedList, ids });
    }, [selectedList, get_selected_data]);

    const handleItemClick = (item: anyObject) => {
        if (multiple) {
            setSelectedList(prev => {
                const exists = prev.some(i => i.id === item.id);
                return exists
                    ? prev.filter(i => i.id !== item.id)
                    : [...prev, item];
            });
        } else {
            setSelectedList([item]);
            setShowDropDownList(false);
        }
    };

    const removeSelectedItem = (id: number) => {
        setSelectedList(prev => prev.filter(item => item.id !== id));
    };

    return (
        <div className="custom_drop_down">
            <input type="hidden" ref={selected_items_input} id={name} name={name} />
            <div
                className={`selected_list ${disabled ? 'disabled' : ''}`}
                onClick={() => !disabled && setShowDropDownList(true)}
            >
                <DropDownSelectedItem
                    selectedList={selectedList}
                    onRemove={removeSelectedItem}
                />
                {disabled && (
                    <span className="disabled-hint">Select an event first</span>
                )}
            </div>
            
            {showDropDownList && (
                <div className="drop_down_items">
                    <div className="drop_down_header">
                    <HeadSearch />
                        <button
                            type="button"
                            onClick={() => setShowDropDownList(false)}
                            className="btn btn_1 text-danger"
                        >
                            <span className="material-symbols-outlined fill">
                                close
                            </span>
                        </button>
                    </div>

                    {options.length === 0 ? (
                        <div className="no_options">
                            No sessions available
                        </div>
                    ) : (
                        <ul className="option_list custom_scroll">
                            {options.map((item) => (
                                <li 
                                    className={`option_item ${selectedList.some(i => i.id === item.id) ? 'selected' : ''}`}
                                    key={item.id}
                                    onClick={() => handleItemClick(item)}
                                >
                                    <label htmlFor={`drop_item_${item.id}`}>
                                        <div className="check_box">
                                            <DropDownCheckbox
                                                checked={selectedList.some(i => i.id === item.id)}
                                                multiple={multiple}
                                            />
                                        </div>
                                        <div className="label">
                                            {item.title}
                                        </div>
                                    </label>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
};

export default DropDown;