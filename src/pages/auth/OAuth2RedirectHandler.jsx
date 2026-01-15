import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../../api/axios';

const OAuth2RedirectHandler = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const token = searchParams.get('token');

        const fetchUser = async (token) => {
            try {
                // Save token
                localStorage.setItem('token', token);

                // Fetch user details
                const response = await api.get('/auth/me');
                const user = response.data.user;

                // Save user
                localStorage.setItem('user', JSON.stringify(user));

                // Redirect to dashboard (full reload to init context)
                window.location.href = '/';
            } catch (error) {
                console.error("OAuth2 Login failed", error);
                navigate('/login?error=oauth_failed');
            }
        };

        if (token) {
            fetchUser(token);
        } else {
            navigate('/login');
        }
    }, [searchParams, navigate]);

    return (
        <div className="flex items-center justify-center h-screen bg-gray-50">
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-[#238898] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <h2 className="text-xl font-semibold text-gray-700">Completing Login...</h2>
                <p className="text-gray-500">Please wait while we verify your credentials.</p>
            </div>
        </div>
    );
};

export default OAuth2RedirectHandler;
