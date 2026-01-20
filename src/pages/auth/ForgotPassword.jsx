import { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../../api/authApi';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [resetToken, setResetToken] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await forgotPassword({ email });
            setSuccess(true);
            setResetToken(response.data.resetToken); // For development only
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to send reset instructions');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#238898] to-cyan-600 p-4">
                <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
                    <div className="text-center mb-6">
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
                        <h2 className="text-2xl font-bold text-gray-900">Check Your Email</h2>
                        <p className="text-gray-600 mt-2">
                            We've sent password reset instructions to <strong>{email}</strong>
                        </p>
                    </div>

                    {resetToken && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                            <p className="text-xs text-yellow-800 mb-2">
                                <strong>Development Mode:</strong> Use this token to reset your password
                            </p>
                            <code className="text-xs bg-white p-2 rounded block overflow-x-auto">
                                {resetToken}
                            </code>
                        </div>
                    )}

                    <div className="space-y-3">
                        <Link to="/reset-password" className="block">
                            <Button className="w-full">
                                Reset Password Now
                            </Button>
                        </Link>
                        <Link to="/login" className="block">
                            <Button variant="secondary" className="w-full">
                                Back to Login
                            </Button>
                        </Link>
                    </div>
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
                                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                            />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">Forgot Password?</h2>
                    <p className="text-gray-600 mt-2">
                        No worries! Enter your email and we'll send you reset instructions.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Email Address"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                    />

                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}

                    <Button type="submit" disabled={loading} className="w-full">
                        {loading ? 'Sending...' : 'Send Reset Instructions'}
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

export default ForgotPassword;
