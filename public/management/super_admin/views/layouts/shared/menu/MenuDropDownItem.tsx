import React from 'react';
import { Link } from 'react-router-dom';
export interface Props {
    to: string;
    label: string;
}

const MenuDropDownItem: React.FC<Props> = (props: Props) => {
    return (
        <>
            <li>
                <Link to={props.to}>
                    <i className="fa fa-angle-right" />
                    {props.label}
                </Link>
            </li>
        </>
    );
};

export default MenuDropDownItem;
