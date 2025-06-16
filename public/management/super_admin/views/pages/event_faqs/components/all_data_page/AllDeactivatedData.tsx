import React from 'react';
import { RootState, useAppDispatch } from '../../../../../store';
import storeSlice from '../../config/store';
import { useSelector } from 'react-redux';
import setup from '../../config/setup';
import { initialState } from '../../config/store/inital_state';
import { all } from '../../config/store/async_actions/all';
export interface Props {}

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
        dispatch(storeSlice.actions.set_show_active_data(type));
        dispatch(storeSlice.actions.set_only_latest_data(true));
        dispatch(storeSlice.actions.set_page(1));
        dispatch(all({}) as any);
    }

    return (
        <>
            {state.show_active_data ? (
                <a href="#" onClick={(e) => handle_recycle_data(false, e)}>
                    <span className="material-symbols-outlined fill">
                        delete
                    </span>
                    <div className="text">Recycle bin</div>
                </a>
            ) : (
                <a href="#" onClick={(e) => handle_recycle_data(true, e)}>
                    <span className="material-symbols-outlined fill">
                        inactive_order
                    </span>
                    <div className="text">Active data</div>
                </a>
            )}
        </>
    );
};

export default AllDeactivatedData;
