import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import TopHeader from './shared/TopHeader';
import SideBar from './shared/menu/SideBar';
import { RootState, useAppDispatch } from '../../store';
import { fetchUserProfileThunk } from '../../store/slices/profileSlice';

export interface Props { }

const DashboardLayout: React.FC<Props> = (props: Props) => {
    const dispatch = useAppDispatch();
    const { profileImageUrl, isLoadingProfile } = useSelector((state: RootState) => state.profile);

    useEffect(() => {
        // Load profile only if not already loaded or currently loading
        if (!profileImageUrl && !isLoadingProfile) {
            dispatch(fetchUserProfileThunk());
        }
    }, [dispatch, profileImageUrl, isLoadingProfile]);

    return (
        <div className="page-wrapper">
            {/*Page Header Start*/}
            <TopHeader />
            {/*Page Header Ends*/}

            {/*Page Body Start*/}
            <div className="page-body-wrapper">
                {/*Page Sidebar Start*/}
                <div className="page-sidebar custom-scrollbar">
                    <div className="sidebar-user text-center">
                        <div>
                            {isLoadingProfile && !profileImageUrl ? (
                                <div className="spinner-border text-primary avatar-placeholder" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            ) : (
                                <>
                                <h6>SUPER ADMIN PANEL</h6>
                                    <img
                                        className="img-100 rounded-circle bg-white"
                                        style={{ maxHeight: '128px', maxWidth: '128px', objectFit: 'cover' }}
                                        src={profileImageUrl || "/assets/dashboard/images/logo.png"}
                                        alt="super admin"
                                        onError={(e) => {
                                            // Fallback if image fails to load, e.g., broken URL
                                            (e.target as HTMLImageElement).src = "/assets/dashboard/images/logo.png";
                                        }}
                                    />
                                <h3></h3>
                                </>
                            )}
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
