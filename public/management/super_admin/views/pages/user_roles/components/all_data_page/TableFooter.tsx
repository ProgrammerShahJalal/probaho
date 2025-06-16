import React from 'react';
import { Link } from 'react-router-dom';
import setup from '../../config/setup';
import { initialState } from '../../config/store/inital_state';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../store';
import ExportSelected from './ExportSelected';
import AllDeactivatedData from './AllDeactivatedData';

const route_prefix = setup.route_prefix;

export interface Props {}
const Footer: React.FC<Props> = (props: Props) => {
    const state: typeof initialState = useSelector(
        (state: RootState) => state[setup.module_name],
    );

    return (
        <div className="footer">
            <div className="action_btns">
                <ul>
                    <li>
                        <Link to={`/${route_prefix}/create`}>
                            <span className="material-symbols-outlined fill">
                                add
                            </span>
                            <div className="text">create new</div>
                        </Link>
                    </li>
                    <li>
                        <ExportSelected />
                    </li>
                    <li>
                        <AllDeactivatedData />
                    </li>
                    {/* <li>
                        <a href="#">
                            <span className="material-symbols-outlined fill">
                                upload
                            </span>
                            <div className="text">Import All</div>
                        </a>
                    </li> */}
                </ul>
            </div>
        </div>
    );
};

export default Footer;
