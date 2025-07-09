import React from 'react';
import { RootState, useAppDispatch } from '../../../../../store';
import storeSlice from '../../config/store';
import { anyObject } from '../../../../../common_types/object';
import { useSelector } from 'react-redux';
import { initialState } from '../../config/store/inital_state';
import setup from '../../config/setup';

export interface Props {
    item: anyObject;
}

const SelectItem: React.FC<Props> = (props: Props) => {
    const state: typeof initialState = useSelector(
        (state: RootState) => state[setup.module_name],
    );
    const dispatch = useAppDispatch();

    function check_exists(): boolean {
        return state.selected.find((i) => i.id === props.item.id)
            ? true
            : false;
    }

    function handle_select_item(e) {
        const temp = [...state.selected];
        const item = props.item;

        const check_index = temp.findIndex((i: anyObject) => i.id === item.id);

        if (check_index >= 0) {
            temp.splice(check_index, 1);
        } else {
            temp.push(item);
        }

        dispatch(storeSlice.actions.set_selected(temp));
    }

    return (
        <input
            onChange={(e) => handle_select_item(e)}
            checked={check_exists()}
            className="form_checkbox"
            type="checkbox"
        />
    );
};

export default SelectItem;
