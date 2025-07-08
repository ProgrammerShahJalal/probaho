import React from 'react';
import ProfileForm from './components/ProfileForm';
import ChangePasswordForm from './components/ChangePasswordForm';

const ProfilePage: React.FC = () => {
    return (
        <div className="container p-4">
            <h1 className="mb-4 display-4">My Profile</h1> {/* Using display-4 for larger heading, mb-4 for margin */}

            <div className="row g-5"> {/* Bootstrap grid row with gap */}
                <div className="col-md-6"> {/* Column for Profile Information */}
                    <h2 className="mb-3 h4">Profile Information</h2> {/* Using h4 for sub-heading, mb-3 for margin */}
                    <ProfileForm />
                </div>
                <div className="col-md-6"> {/* Column for Change Password */}
                    <h2 className="mb-3 h4">Change Password</h2> {/* Using h4 for sub-heading, mb-3 for margin */}
                    <ChangePasswordForm />
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
