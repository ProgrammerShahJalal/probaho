import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import TopHeader from './shared/TopHeader';
import SideBar from './shared/menu/SideBar';

export interface Props { }

const DashboardLayout: React.FC<Props> = (props: Props) => {
    return (
        <div className="page-wrapper">
            {/*Page Header Start*/}
            <TopHeader></TopHeader>
            {/*Page Header Ends*/}

            {/*Page Body Start*/}
            <div className="page-body-wrapper">
                {/*Page Sidebar Start*/}
                <div className="page-sidebar custom-scrollbar">
                    <div className="sidebar-user text-center">
                        <div>
                            <img
                                className="img-80 rounded-circle bg-white"
                                src="/assets/dashboard/images/logo.png"
                                alt="super admin"
                            />
                        </div>
                    </div>
                    <SideBar />
                </div>
                {/*Page Sidebar Ends*/}
                <div className="page-body">
                    <div className="row">
                        <div className="col-sm-12">
                            <Outlet />
                        </div>
                    </div>
                </div>
            </div>
            {/*Page Body Ends*/}
        </div>
    );
};
export default DashboardLayout;
