import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import TopHeader from './shared/TopHeader';
import SideBar from './shared/menu/SideBar';
import { fetchUserProfile } from '../pages/profile/services';

export interface Props { }

const DashboardLayout: React.FC<Props> = (props: Props) => {
    const [previewImage, setPreviewImage] = useState<string | null>(null);
        const [isLoading, setIsLoading] = useState(false); // For submission spinner
        const [initialLoading, setInitialLoading] = useState(true); // For initial data load

        useEffect(() => {
                const loadUserProfile = async () => {
                    setInitialLoading(true); // Ensure it's true when loading starts
                    try {
                        const data = await fetchUserProfile();
                        if (data.photo && typeof data.photo === 'string') {
                            setPreviewImage(data.photo);
                        }
                    } catch (error) {
                        console.error("Failed to load user profile", error);
                        // Error should be handled by global interceptor or a specific toast message here
                    }
                    setInitialLoading(false); // Set to false after loading finishes
                };
                loadUserProfile();
            }, []);
        
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
                                src={previewImage || "/assets/dashboard/images/logo.png"}
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
