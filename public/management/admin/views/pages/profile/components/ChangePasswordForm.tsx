import React, { useState } from 'react';
import { changePassword } from '../services';

const ChangePasswordForm: React.FC = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);

        if (newPassword !== confirmPassword) {
            setError("New password and confirm password don't match.");
            return;
        }
        if (newPassword.length < 6) { 
            setError("New password must be at least 6 characters long.");
            return;
        }

        setIsLoading(true);
        try {
            await changePassword({ current_password: currentPassword, new_password: newPassword, confirm_password: confirmPassword });
            setSuccessMessage('Password changed successfully!');
            (window as any).toaster('Password changed successfully!', 'success'); // Keep global toaster
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err: any) {
            // Prefer API error message, fallback to generic
            const apiErrorMessage = err.response?.data?.message;
            const displayError = apiErrorMessage || 'Failed to change password. Ensure your current password is correct.';
            setError(displayError);
            if (!apiErrorMessage) { // If it's not a specific API error, toaster can show generic one
                 (window as any).toaster(displayError, 'error');
            }
        }
        setIsLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="card shadow-sm">
            <div className="card-body">
                {error && <div className="alert alert-danger mb-3">{error}</div>}
                {successMessage && <div className="alert alert-success mb-3">{successMessage}</div>}
                
                <div className="mb-3">
                    <label htmlFor="currentPassword_profile" className="form-label">Current Password</label>
                    <input
                        type="password"
                        id="currentPassword_profile"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="form-control"
                        required
                        disabled={isLoading}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="newPassword_profile" className="form-label">New Password</label>
                    <input
                        type="password"
                        id="newPassword_profile"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="form-control"
                        required
                        disabled={isLoading}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="confirmPassword_profile" className="form-label">Confirm New Password</label>
                    <input
                        type="password"
                        id="confirmPassword_profile"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="form-control"
                        required
                        disabled={isLoading}
                    />
                </div>
                <div className="d-grid">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="btn btn-primary"
                    >
                        {isLoading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Changing...
                            </>
                        ) : (
                            'Change Password'
                        )}
                    </button>
                </div>
            </div>
        </form>
    );
};

export default ChangePasswordForm;
