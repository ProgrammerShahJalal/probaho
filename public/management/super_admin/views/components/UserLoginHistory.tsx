import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface LoginHistory {
    id: number;
    user: {
        name: string;
    };
    login_date: string;
    logout_date: string;
    device: string;
    total_session_time: number;
}

interface UserLoginHistoryProps {
    // You can add any props you might need here
}

const UserLoginHistory: React.FC<UserLoginHistoryProps> = () => {
    const [loginHistories, setLoginHistories] = useState<LoginHistory[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchLoginHistories = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await axios.get('/api/v1/user-login-histories', {
                    params: {
                        orderByCol: 'login_date',
                        orderByAsc: false,
                        paginate: 5,
                        show_active_data: true,
                    },
                });
                // Assuming the actual data is in response.data.data.data based on T1.tsx
                if (response.data && response.data.data && response.data.data.data) {
                    setLoginHistories(response.data.data.data);
                } else {
                    // Fallback if the structure is just response.data.data
                    setLoginHistories(response.data.data || []);
                }
            } catch (err) {
                console.error("Error fetching login histories:", err);
                setError('Failed to load login histories.');
            } finally {
                setLoading(false);
            }
        };

        fetchLoginHistories();
    }, []);

    if (loading) {
        return <div>Loading login histories...</div>;
    }

    if (error) {
        return <div style={{ color: 'red' }}>{error}</div>;
    }

    if (loginHistories.length === 0) {
        return <div>No login histories found.</div>;
    }

    const formatSessionTime = (seconds: number): string => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        return `${hrs.toString().padStart(2, '0')}:${mins
            .toString()
            .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="card">
            <div className="card-header">
                <h5 className="card-title mb-0">User Login History (Latest 5)</h5>
            </div>
            <div className="card-body">
                <div className="table-responsive">
                    <table className="table table-hover table-striped">
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Login Date</th>
                                <th>Logout Date</th>
                                <th>Device</th>
                                <th>Total Session Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loginHistories.map((history) => (
                                <tr key={history.id}>
                                    <td>{history.user?.name || 'N/A'}</td>
                                    <td>{new Date(history.login_date).toLocaleString() || 'N/A'}</td>
                                    <td>{new Date(history.logout_date).toLocaleString() || 'N/A'}</td>
                                    <td>{history.device || 'N/A'}</td>
                                    <td>
                                        {history.total_session_time
                                            ? `${formatSessionTime(history.total_session_time)} (HH:MM:SS)`
                                            : 'N/A'}
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UserLoginHistory;
