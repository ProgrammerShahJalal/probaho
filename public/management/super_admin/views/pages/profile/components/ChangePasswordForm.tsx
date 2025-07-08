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
        if (newPassword.length < 6) { // Example: Basic password length validation
            setError("New password must be at least 6 characters long.");
            return;
        }

        setIsLoading(true);
        try {
            await changePassword({ current_password: currentPassword, new_password: newPassword, confirm_password: confirmPassword });
            setSuccessMessage('Password changed successfully!');
            // Assuming window.toaster is globally available
            (window as any).toaster('Password changed successfully!', 'success');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err: any) {
            // The global axios interceptor should handle displaying network/server errors.
            // This setError is for specific client-side or caught business logic errors from the API.
            setError(err.response?.data?.message || 'Failed to change password. Ensure your current password is correct.');
        }
        setIsLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-md shadow-sm">
            {error && <div className="p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}
            {successMessage && <div className="p-3 bg-green-100 text-green-700 rounded-md">{successMessage}</div>}
            <div>
                <label htmlFor="currentPassword_profile" className="block text-sm font-medium text-gray-700">Current Password</label>
                <input
                    type="password"
                    id="currentPassword_profile"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                />
            </div>
            <div>
                <label htmlFor="newPassword_profile" className="block text-sm font-medium text-gray-700">New Password</label>
                <input
                    type="password"
                    id="newPassword_profile"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                />
            </div>
            <div>
                <label htmlFor="confirmPassword_profile" className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                <input
                    type="password"
                    id="confirmPassword_profile"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                />
            </div>
            <div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                    {isLoading ? 'Changing...' : 'Change Password'}
                </button>
            </div>
        </form>
    );
};

export default ChangePasswordForm;
