import React, { useRef } from 'react';
import { anyObject } from '../../../../../common_types/object';
import setup from '../../config/setup';
import { Link } from 'react-router-dom';
import active_row from '../../helpers/table_active_row';
import DeleteButton from './DeleteButton';
import DestroyButton from './DestroyButton';
import RestoreButton from './RestoreButton';
import InactiveButton from './InactiveButton';
import ActiveButton from './ActiveButton';
import { useSelector } from 'react-redux';
import { initialState } from '../../config/store/inital_state';
import { RootState } from '../../../../../store';

export interface Props {
    item: anyObject;
}
const TableRowAction: React.FC<Props> = ({ item }: Props) => {
    const toggle_icon = useRef<HTMLElement | null>(null);
    const state: typeof initialState = useSelector(
        (state: RootState) => state[setup.module_name],
    );

    return (
        <>
              <span
                role="button"
                className="icon-settings"
                ref={toggle_icon}
                onClick={(e) => active_row(toggle_icon, e)}
            />
            <div className="table_action_btns">
                <ul>
                    <li>
                        <Link to={`/${setup.route_prefix}/details/${item.id}`}>
                            <span className="icon-eye text-secondary"></span>
                            <span className="text text-white">Show</span>
                        </Link>
                    </li>
                    <li>
                        <Link to={`/${setup.route_prefix}/edit/${item.id}`}>
                         <span className="icon-pencil text-info"></span> 
                         <span className="text text-white">Edit</span>
                        </Link>
                    </li>
                    <li>
                        <InactiveButton item={item} />
                        <ActiveButton item={item} />
                    </li>
                    <li>
                        <DeleteButton item={item} />
                    </li>
                    <li>
                        <DestroyButton item={item} />
                    </li>
                    {/* Only show RestoreButton if not viewing inactive data */}
                    {state.show_active_data || state.show_trash_data ? (
                        <li>
                            <RestoreButton item={item} />
                        </li>
                    ): null}
                </ul>
            </div>
        </>
    );
};

export default TableRowAction;
