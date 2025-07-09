import React, { ReactNode } from 'react';
import setup from '../../config/setup';
import { Link } from 'react-router-dom';

export interface Props {
    children?: ReactNode;
}
const Footer: React.FC<Props> = (props: Props) => {
    return (
        <>
            <div className="footer">
                <div className="action_btns">
                    <ul>
                        <li>
                            <Link
                                to={`/${setup.route_prefix}`}
                                className="outline btn-outline-warning"
                            >
                                <span className="material-symbols-outlined fill">
                                    arrow_back
                                </span>
                                <div className="text">Back</div>
                            </Link>
                        </li>
                        {props.children}
                    </ul>
                </div>
            </div>
        </>
    );
};

export default Footer;
