import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api';

function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    function handleChange(event) {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();

        setError('');
        setSuccess('');

        if (!formData.name.trim()) {
            setError('Please enter your name.');
            return;
        }

        if (!formData.email.trim()) {
            setError('Please enter your email.');
            return;
        }

        if (!formData.password) {
            setError('Please enter your password.');
            return;
        }

        if (
            formData.password !==
            formData.password_confirmation
        ) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);

        try {
            await registerUser(
                formData.name.trim(),
                formData.email.trim(),
                formData.password,
                formData.password_confirmation
            );

            setSuccess(
                'Registration successful. Please login.'
            );

            setTimeout(() => {
                navigate('/login');
            }, 1000);
        } catch (err) {
            console.error(
                'Registration error:',
                err
            );

            setError(
                err.message ||
                    'Registration failed.'
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-container">

                <div className="auth-header">
                    <h1>Create Account</h1>

                    <p>
                        Create an account to manage
                        your properties.
                    </p>
                </div>

                {error && (
                    <div className="form-message error">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="form-message success">
                        {success}
                    </div>
                )}

                <form
                    className="auth-form"
                    onSubmit={handleSubmit}
                >

                    <div className="form-group">
                        <label htmlFor="name">
                            Full Name
                        </label>

                        <input
                            id="name"
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                            autoComplete="name"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">
                            Email Address
                        </label>

                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            autoComplete="email"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">
                            Password
                        </label>

                        <input
                            id="password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            autoComplete="new-password"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password_confirmation">
                            Confirm Password
                        </label>

                        <input
                            id="password_confirmation"
                            name="password_confirmation"
                            type="password"
                            value={
                                formData.password_confirmation
                            }
                            onChange={handleChange}
                            placeholder="Confirm your password"
                            autoComplete="new-password"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="primary-button"
                        disabled={loading}
                    >
                        {loading
                            ? 'Creating Account...'
                            : 'Create Account'}
                    </button>

                </form>

                <div className="auth-footer">
                    <p>
                        Already have an account?{' '}
                        <Link to="/login">
                            Login
                        </Link>
                    </p>
                </div>

            </div>
        </div>
    );
}

export default Register;