import React, { useEffect, useRef, useState } from 'react';
import Paginate from '../../../../components/Paginate';
import storeSlice from '../../config/store';
import { all } from '../../config/store/async_actions/all';
import { useSelector } from 'react-redux';
import { initialState } from '../../config/store/inital_state';
import { RootState, useAppDispatch } from '../../../../../store';
import setup from '../../config/setup';
import HeadSearch from '../all_data_page/HeadSearch';
import { anyObject } from '../../../../../common_types/object';
import DropDownCheckbox from './DropDownCheckbox';
import DropDownSelectedItem from './DropDownSelectedItem';

export interface Props {
    name: string;
    get_selected_data?: (anyObject) => void;
    multiple: true | false;
    default_value?: anyObject[] | [];
}

const DropDown: React.FC<Props> = ({
    name,
    get_selected_data,
    multiple,
    default_value,
}) => {
    const state: typeof initialState = useSelector(
        (state: RootState) => state[setup.module_name],
    );

    /** local states */
    const [showDropDownList, setShowDropDownList] = useState(false);
    const [selectedList, setSelectedList] = useState<anyObject[]>([]);
    const selected_items_input = useRef<HTMLInputElement>(null);

    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(storeSlice.actions.set_only_latest_data(true));
        dispatch(all({}));
    }, []);

    useEffect(() => {
        if (
            Array.isArray(default_value) &&
            default_value.length > 0 &&
            Array.isArray(state.all?.data) &&
            state.all.data.length > 0
        ) {
            // Prevent overwriting user selections
            if (selectedList.length === 0) {
                const defaultItems = default_value.map((item) => ({
                    serial: item.id?.serial || item.serial || null,
                    title: item.id?.title || item.title || null,
                }));

                const enrichedList = defaultItems.map((defaultItem) => {
                    const fullItem = state.all.data.find(
                        (item) => item.role_serial === defaultItem.serial,
                    );
                    return fullItem || defaultItem;
                });

                setSelectedList(enrichedList);
            }
        }
    }, [default_value, state.all?.data]);

    /** update selected items */
    useEffect(() => {
        const serial = selectedList.map((i) => i.serial).join(',');
        if (selected_items_input.current) {
            selected_items_input.current.value = serial;
        }
        get_selected_data?.({ selectedList, serial });
    }, [selectedList, get_selected_data]);

    return (
        <>
            <div className="custom_drop_down">
                <input
                    type="hidden"
                    ref={selected_items_input}
                    id={name}
                    name={name}
                />
                <div
                    className="selected_list"
                    onClick={() => setShowDropDownList(true)}
                >
                    <DropDownSelectedItem
                        selectedList={selectedList}
                        setSelectedList={setSelectedList}
                    />
                </div>
                {showDropDownList && (
                    <div className="drop_down_items">
                        <div className="drop_down_data_search">
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

                        <ul className="option_list custom_scroll">
                            {(state.all as anyObject)?.data?.map(
                                (i: anyObject) => {
                                    return (
                                        <li
                                            className="option_item"
                                            key={i.serial}
                                        >
                                            <label
                                                htmlFor={`drop_item_${i.serial}`}
                                            >
                                                <div className="check_box">
                                                    <DropDownCheckbox
                                                        item={i}
                                                        selectedList={
                                                            selectedList
                                                        }
                                                        setSelectedList={
                                                            setSelectedList
                                                        }
                                                        multiple={multiple}
                                                    />
                                                </div>
                                                <div className="label">
                                                    {/* {i.uid} - */}
                                                    {i.title}
                                                </div>
                                            </label>
                                        </li>
                                    );
                                },
                            )}
                        </ul>

                        <div className="drop_down_footer data_list">
                            <Paginate
                                set_url={storeSlice.actions.set_url}
                                set_paginate={storeSlice.actions.set_paginate}
                                set_page={storeSlice.actions.set_page}
                                all={all}
                                data={state.all}
                                selected_paginate={state.paginate}
                            ></Paginate>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default DropDown;
