import React from 'react';
import { RootState, useAppDispatch } from '../../../../../store';
import storeSlice from '../../config/store';
import { useSelector } from 'react-redux';
import setup from '../../config/setup';
import { initialState } from '../../config/store/inital_state';
import { all } from '../../config/store/async_actions/all';
export interface Props { }

const AllDeactivatedData: React.FC<Props> = (props: Props) => {
    const state: typeof initialState = useSelector(
        (state: RootState) => state[setup.module_name],
    );
    const dispatch = useAppDispatch();

    async function handle_recycle_data(
        type: boolean,
        e: React.MouseEvent<HTMLElement, MouseEvent>,
    ) {
        e.preventDefault();
        dispatch(storeSlice.actions.set_show_trash_data(true));
        dispatch(storeSlice.actions.set_show_active_data(false)); // Ensure active/inactive is off when showing trash
        dispatch(storeSlice.actions.set_only_latest_data(true));
        dispatch(storeSlice.actions.set_page(1));
        dispatch(all({}) as any);
    }

    return (
        <>
            <a href="#" onClick={(e) => handle_recycle_data(false, e)}>
                <span className="material-symbols-outlined fill text-danger">
                    delete
                </span>
                <div className="text text-white">Trashed</div>
            </a>
        </>
    );
};

export default AllDeactivatedData;
