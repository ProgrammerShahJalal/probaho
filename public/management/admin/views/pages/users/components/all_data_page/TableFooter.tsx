import React, { useState } from 'react'; // Added useState
import { Link } from 'react-router-dom';
import setup from '../../config/setup';
import { initialState } from '../../config/store/inital_state';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../../../../store';
import ExportSelected from './ExportSelected';
import ExportAll from './ExportAll';
import AllDeactivatedData from './AllDeactivatedData';
import ImportUsersModal from './ImportUsersModal';
import storeSlice from '../../config/store';
import { all } from '../../config/store/async_actions/all';
import ActionDropdown from './ActionDropdown';

const route_prefix = setup.route_prefix;

export interface Props { }
const Footer: React.FC<Props> = (props: Props) => {
    const {
        selected,
        all: allData, // aliasing to avoid conflict with the imported 'all' action creator
    } = useSelector((state: RootState) => state[setup.module_name]) as typeof initialState;

    const users = (allData as any)?.data || []; // Get the users array

    const dispatch = useAppDispatch();
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);

    async function handle_recycle_data(
        type: boolean,
        e: React.MouseEvent<HTMLElement, MouseEvent>,
    ) {
        e.preventDefault();
        dispatch(storeSlice.actions.set_selected([])); // Clear selected items
        dispatch(storeSlice.actions.set_show_active_data(type));
        dispatch(storeSlice.actions.set_show_trash_data(false)); // Ensure trash is off when showing active/inactive
        dispatch(storeSlice.actions.set_only_latest_data(true));
        dispatch(storeSlice.actions.set_page(1));
        dispatch(all({}) as any);
    }

    return (
        <>
            <div className="footer" style={{ position: 'relative', zIndex: 20 }}>
                <div className="action_btns">
                    <ul>
                        <li>
                            <Link to={`/${route_prefix}/register`}>
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
                            <ExportAll />
                        </li>
                        <li>
                            <a href="#" onClick={(e) => { e.preventDefault(); setIsImportModalOpen(true); }}>
                                <span className="material-symbols-outlined fill">
                                    upload
                                </span>
                                <div className="text text-white">Import</div>
                            </a>
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
                        {selected.length > 0 && ( // Conditionally render if items are selected
                            <li>
                                <ActionDropdown selectedItems={selected} isBulk={true} />
                            </li>
                        )}
                    </ul>
                </div>
            </div>
            <ImportUsersModal isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} />
        </>
    );
};

export default Footer;
