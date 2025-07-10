/* eslint-disable no-undef */
import React, { useEffect } from 'react';
export interface Props {}

const NavbarSwitch: React.FC<Props> = (props: Props) => {
    function toggle() {
        (window as any).jQuery('.page-body-wrapper').toggleClass('sidebar-close');
    }
    return (
        <>
            <div className="mobile-sidebar col-1 ps-0">
                <div className="text-start switch-sm">
                    <label className="switch">
                        <input
                            type="checkbox"
                            onChange={toggle}
                            id="sidebar-toggle"
                            defaultChecked
                        />
                        <span className="switch-state" />
                    </label>
                </div>
            </div>
        </>
    );
};

export default NavbarSwitch;
