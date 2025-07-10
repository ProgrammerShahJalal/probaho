import React from 'react';

export interface Props {
    section_title?: string;

    icon: string;
    group_title: string;
    children: React.ReactNode;
}

const MenuDropDown: React.FC<Props> = (props: Props) => {
    return (
        <>
            <li>
                {props.section_title && (
                    <div className="sidebar-title">{props.section_title}</div>
                )}
                <a className="sidebar-header">
                    <i className={props.icon} />
                    <span>{props.group_title}</span>
                    <i className="fa fa-angle-right pull-right" />
                </a>
                <ul className="sidebar-submenu">{props.children}</ul>
            </li>
        </>
    );
};

export default MenuDropDown;
