import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../services/api';

function Navbar() {
    const navigate = useNavigate();

    const [isLoggedIn, setIsLoggedIn] = useState(
        Boolean(localStorage.getItem('auth_token'))
    );

    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('auth_user');

        if (!savedUser) {
            return null;
        }

        try {
            return JSON.parse(savedUser);
        } catch {
            return null;
        }
    });

    useEffect(() => {
        function handleAuthChange() {
            const token = localStorage.getItem('auth_token');

            setIsLoggedIn(Boolean(token));

            const savedUser =
                localStorage.getItem('auth_user');

            if (savedUser) {
                try {
                    setUser(JSON.parse(savedUser));
                } catch {
                    setUser(null);
                }
            } else {
                setUser(null);
            }
        }

        window.addEventListener(
            'auth-change',
            handleAuthChange
        );

        return () => {
            window.removeEventListener(
                'auth-change',
                handleAuthChange
            );
        };
    }, []);

    async function handleLogout() {
        try {
            await logoutUser();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('auth_user');

            window.dispatchEvent(
                new Event('auth-change')
            );

            navigate('/login');
        }
    }

    return (
        <nav className="navbar">

            <div className="navbar-container">

                <div
                    className="navbar-brand"
                    onClick={() => navigate('/')}
                >
                    Real Estate
                </div>

                <div className="navbar-right">

                    <div className="navbar-links">

                        <button
                            type="button"
                            onClick={() => navigate('/')}
                        >
                            Home
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                navigate('/properties')
                            }
                        >
                            Properties
                        </button>

                        {isLoggedIn && (
                            <>
                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate('/add-property')
                                    }
                                >
                                    Add Property
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate('/inquiries')
                                    }
                                >
                                    Inquiries
                                </button>

                                <button
                                    type="button"
                                    className="logout-button"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </button>
                            </>
                        )}

                        {!isLoggedIn && (
                            <>
                                <button
                                    type="button"
                                    className="login-button"
                                    onClick={() =>
                                        navigate('/login')
                                    }
                                >
                                    Login
                                </button>

                                <button
                                    type="button"
                                    className="register-button"
                                    onClick={() =>
                                        navigate('/register')
                                    }
                                >
                                    Register
                                </button>
                            </>
                        )}

                    </div>

                    {isLoggedIn && (
                        <div className="navbar-welcome">
                            Welcome,{' '}
                            <strong>
                                {user?.name || 'User'}
                            </strong>
                            👋
                        </div>
                    )}

                </div>

            </div>

        </nav>
    );
}

export default Navbar;