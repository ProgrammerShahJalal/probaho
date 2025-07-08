import React from 'react';
import ProfileForm from './components/ProfileForm';
import ChangePasswordForm from './components/ChangePasswordForm';

const ProfilePage: React.FC = () => {
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">My Profile</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h2 className="text-xl font-semibold mb-3">Profile Information</h2>
                    <ProfileForm />
                </div>
                <div>
                    <h2 className="text-xl font-semibold mb-3">Change Password</h2>
                    <ChangePasswordForm />
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
