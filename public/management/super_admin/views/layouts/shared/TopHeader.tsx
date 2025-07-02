import React from 'react';
import NavbarSwitch from './NavbarSwitch';

export interface Props {}

const TopHeader: React.FC<Props> = (props: Props) => {
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
                </div>
            </div>
        </>
    );
};

export default TopHeader;
