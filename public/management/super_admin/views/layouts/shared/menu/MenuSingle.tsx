import React from 'react';
import { Link } from 'react-router-dom';
export interface Props {
    to: string;
    label: string;
    icon: string;
}

const MenuSingle: React.FC<Props> = (props: Props) => {
    return (
        <>
            <li>
                <Link to={props.to} className="sidebar-header">
                    <i className={props.icon} />
                    <span> {props.label}</span>
                </Link>
            </li>
        </>
    );
};

export default MenuSingle;
