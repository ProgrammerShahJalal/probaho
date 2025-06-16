import React from 'react';
import { RootState, useAppDispatch } from '../../../../../store';
import { useSelector } from 'react-redux';
import { initialState } from '../../config/store/inital_state';
import setup from '../../config/setup';
import storeSlice from '../../config/store';
export interface Props {}

const HeadRightButtons: React.FC<Props> = (props: Props) => {
    const state: typeof initialState = useSelector(
        (state: RootState) => state[setup.module_name],
    );
    const dispatch = useAppDispatch();

    function show_filter(action: boolean = true) {
        event?.preventDefault();
        dispatch(storeSlice.actions.set_show_filter_canvas(action));
    }

    return (
        <ul>
            {/* <li>
                <a href="#">
                    <span className="material-symbols-outlined fill">
                        zoom_out_map
                    </span>
                </a>
            </li>
            <li>
                <a href="#">
                    <span className="material-symbols-outlined fill">
                        remove
                    </span>
                </a>
            </li>
            <li>
                <a href="#">
                    <span className="material-symbols-outlined fill">
                        close
                    </span>
                </a>
            </li> */}
            <li>
                <a href="#" onClick={() => show_filter(true)}>
                    <span className="material-symbols-outlined fill">
                        event_list
                    </span>
                </a>
            </li>
        </ul>
    );
};

export default HeadRightButtons;
