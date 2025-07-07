import React, { useState } from 'react';
import axios from 'axios';
import NavbarSwitch from './NavbarSwitch';
import { anyObject } from '../../../common_types/object';
import ConfirmModal from '../../components/ConfirmModal';

export interface Props {}

const TopHeader: React.FC<Props> = (props: Props) => {
    const [error, setError] = useState(null);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false); // Added state

    const handleLogout = () => {
        (document.getElementById('logout_form') as HTMLFormElement)?.submit();
    };
    return (
        <>
            <div className="page-main-header flex items-center justify-between px-4 py-2">
                <div
                    className="main-header-left flex-1"
                    semilight-bg-color="bg-default-light-colo"
                >
                    {/* <div className="logo-wrapper flex justify-center items-center">
                        <a href="#/">
                            <img
                                style={{
                                    width: '40%',
                                    height: 'auto',
                                }}
                                src="https://i.ibb.co/6JvcPy2H/probaho-logo.png"
                                className="image-dark"
                                alt="Probaho Logo Dark"
                            />
                            <img
                                style={{
                                    width: '40%',
                                    height: 'auto',
                                }}
                                src="https://i.ibb.co/6JvcPy2H/probaho-logo.png"
                                className="image-light hidden"
                                alt="Probaho Logo Light"
                            />
                        </a>
                    </div> */}
                </div>
                <div
                    className="main-header-right"
                    header-bg-color="bg-default-light-colo"
                >
                    <NavbarSwitch />
                    <div className="nav-right col">
                        <ul className="nav-menus">
                            <li className="onhover-dropdown">
                                <div className="d-flex align-items-center">
                                    <div>
                                        <h6 className="m-0 txt-dark f-16">
                                            My Account
                                            <i className="fa fa-angle-down pull-right ms-2" />
                                        </h6>
                                    </div>
                                </div>
                                <ul className="profile-dropdown onhover-show-div p-20">
                                    <li>
                                        <a href="/admission-officer#/settings">
                                            <i className="icon-user" />
                                            Profile
                                        </a>
                                    </li>
                                    <li>
                                        <a onClick={(e) => {
                            e.preventDefault();
                            setIsLogoutModalOpen(true); // Open modal
                        }} href="#">
                                            <i className="icon-power-off" />
                                            Logout
                                        </a>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                        <div className="d-lg-none mobile-toggle">
                            <i className="icon-more" />
                        </div>
                        {/* Added ConfirmModal */}
                                    <ConfirmModal
                                        isOpen={isLogoutModalOpen}
                                        onClose={() => setIsLogoutModalOpen(false)}
                                        onConfirm={handleLogout}
                                        message="Are you sure you want to log out? Your session will be ended."
                                        title="Logout Confirmation"
                                    />
                    </div>
                </div>
            </div>
        </>
    );
};

export default TopHeader;
