import React from 'react';
import { Link } from 'react-router-dom';
import setup from '../../config/setup';
import { initialState } from '../../config/store/inital_state';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../../../../store';
import ExportSelected from './ExportSelected';
import AllDeactivatedData from './AllDeactivatedData';
import storeSlice from '../../config/store';
import { all } from '../../config/store/async_actions/all';

const route_prefix = setup.route_prefix;

export interface Props { }
const Footer: React.FC<Props> = (props: Props) => {
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
            dispatch(storeSlice.actions.set_show_trash_data(false)); // Ensure trash is off when showing active/inactive
            dispatch(storeSlice.actions.set_only_latest_data(true));
            dispatch(storeSlice.actions.set_page(1));
            dispatch(all({}) as any);
        }
    

    return (
        <div className="footer">
            <div className="action_btns">
                <ul>
                    <li>
                        <Link to={`/${route_prefix}/create`}>
                            <span className="material-symbols-outlined fill">
                                add
                            </span>
                            <div className="text text-white">create new</div>
                        </Link>
                    </li>
                    <li>
                        <ExportSelected />
                    </li>
                    <li>
                        <Link to={`/${route_prefix}/import`}>
                            <span className="material-symbols-outlined fill">
                                upload
                            </span>
                            <div className="text text-white">Import</div>
                        </Link>
                    </li>
                    <li>
                        <a href="#" onClick={(e) => handle_recycle_data(true, e)}>
                            <span className="material-symbols-outlined fill text-success">
                                visibility
                            </span>
                            <div className="text text-white">Active</div>
                        </a>
                    </li>
                    <li>
                        <a href="#" onClick={(e) => handle_recycle_data(false, e)}>
                            <span className="material-symbols-outlined fill">
                                visibility_off
                            </span>
                            <div className="text text-white">Inactive</div>
                        </a>
                    </li>
                    <li>
                        <AllDeactivatedData />
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Footer;
