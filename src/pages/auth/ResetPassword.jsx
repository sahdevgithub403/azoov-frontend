import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { resetPassword } from '../../api/authApi';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

const ResetPassword = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        token: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.newPassword !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.newPassword.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        setLoading(true);

        try {
            await resetPassword({
                token: formData.token,
                newPassword: formData.newPassword,
            });
            setSuccess(true);
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#238898] to-cyan-600 p-4">
                <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg
                            className="w-8 h-8 text-green-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Password Reset Successful!
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Your password has been reset successfully. Redirecting to login...
                    </p>
                    <Button onClick={() => navigate('/login')} className="w-full">
                        Go to Login
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#238898] to-cyan-600 p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-[#238898] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#238898]/30">
                        <svg
                            className="w-8 h-8 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                            />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">Reset Password</h2>
                    <p className="text-gray-600 mt-2">
                        Enter your reset token and new password
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Reset Token"
                        type="text"
                        value={formData.token}
                        onChange={(e) =>
                            setFormData({ ...formData, token: e.target.value })
                        }
                        placeholder="Paste your reset token here"
                        required
                    />

                    <Input
                        label="New Password"
                        type="password"
                        value={formData.newPassword}
                        onChange={(e) =>
                            setFormData({ ...formData, newPassword: e.target.value })
                        }
                        placeholder="Enter new password"
                        required
                    />

                    <Input
                        label="Confirm Password"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) =>
                            setFormData({ ...formData, confirmPassword: e.target.value })
                        }
                        placeholder="Confirm new password"
                        required
                    />

                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}

                    <Button type="submit" disabled={loading} className="w-full">
                        {loading ? 'Resetting...' : 'Reset Password'}
                    </Button>

                    <div className="text-center">
                        <Link
                            to="/login"
                            className="text-sm text-[#238898] hover:text-cyan-600 font-medium"
                        >
                            ← Back to Login
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
