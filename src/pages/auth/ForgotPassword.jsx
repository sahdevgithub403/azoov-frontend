import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { forgotPassword, verifyOTP } from '../../api/authApi';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: Email, 2: OTP
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSendOTP = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await forgotPassword({ email });
            setStep(2);
        } catch (err) {
            setError(err.response?.data?.error || err.response?.data?.message || 'Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setError('');

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            await verifyOTP({ email, otp, newPassword });
            // Success! Redirect to login
            navigate('/login', {
                state: { message: 'Password reset successfully! Please login with your new password.' }
            });
        } catch (err) {
            setError(err.response?.data?.error || err.response?.data?.message || 'Invalid OTP or failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#238898] to-cyan-600 p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-[#238898] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#238898]/30">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">
                        {step === 1 ? 'Forgot Password?' : 'Enter OTP'}
                    </h2>
                    <p className="text-gray-600 mt-2">
                        {step === 1
                            ? 'Enter your email to receive a 6-digit OTP'
                            : `We've sent a 6-digit code to ${email}`
                        }
                    </p>
                </div>

                {step === 1 ? (
                    <form onSubmit={handleSendOTP} className="space-y-4">
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
                            {loading ? 'Sending OTP...' : 'Send OTP'}
                        </Button>

                        <div className="text-center">
                            <button
                                type="button"
                                onClick={() => navigate('/login')}
                                className="text-sm text-[#238898] hover:text-cyan-600 font-medium"
                            >
                                ← Back to Login
                            </button>
                        </div>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOTP} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Enter 6-Digit OTP
                            </label>
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                placeholder="000000"
                                maxLength={6}
                                className="w-full px-4 py-3 border rounded-lg text-center text-2xl font-bold tracking-widest focus:outline-none focus:ring-2 focus:ring-[#238898]"
                                required
                            />
                        </div>

                        <Input
                            label="New Password"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Enter new password"
                            required
                        />

                        <Input
                            label="Confirm Password"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm new password"
                            required
                        />

                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                <p className="text-sm text-red-600">{error}</p>
                            </div>
                        )}

                        <Button type="submit" disabled={loading} className="w-full">
                            {loading ? 'Verifying...' : 'Reset Password'}
                        </Button>

                        <div className="text-center space-y-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setStep(1);
                                    setOtp('');
                                    setError('');
                                }}
                                className="text-sm text-[#238898] hover:text-cyan-600 font-medium block w-full"
                            >
                                ← Change Email
                            </button>
                            <button
                                type="button"
                                onClick={handleSendOTP}
                                disabled={loading}
                                className="text-sm text-gray-600 hover:text-gray-900 font-medium"
                            >
                                Resend OTP
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;
