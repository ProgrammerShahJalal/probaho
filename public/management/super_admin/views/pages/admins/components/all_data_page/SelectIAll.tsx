import React from 'react';
import { RootState, useAppDispatch } from '../../../../../store';
import storeSlice from '../../config/store';
import { anyObject } from '../../../../../common_types/object';
import { useSelector } from 'react-redux';
import setup from '../../config/setup';
import { initialState } from '../../config/store/inital_state';

export interface Props {}

const SelectAll: React.FC<Props> = (props: Props) => {
    const state: typeof initialState = useSelector(
        (state: RootState) => state[setup.module_name],
    );
    const dispatch = useAppDispatch();

    function handle_select_all(e) {
        let temp = [...state.selected];
        const all: anyObject = state.all as anyObject;

        if (all.data.length && e.target.checked) {
            all.data.forEach((item: anyObject) => {
                const check_index = temp.findIndex(
                    (i: anyObject) => i.id === item.id,
                );

                if (check_index < 0) {
                    temp.push(item);
                }
            });
        } else {
            temp = [];
        }

        dispatch(storeSlice.actions.set_select_all(temp));
    }
    return (
        <input
            onChange={(e) => handle_select_all(e)}
            className="form_checkbox"
            type="checkbox"
        />
    );
};

export default SelectAll;
