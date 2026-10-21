import { Routes, Route } from 'react-router-dom';
import './App.css';

import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Properties from './pages/Properties';
import PropertyDetails from './pages/PropertyDetails';
import AddProperty from './pages/AddProperty';
import EditProperty from './pages/EditProperty';
import Inquiries from './pages/Inquiries';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
    return (
        <>
            <Navbar />

            <main>
                <Routes>

                    {/* Public Routes */}

                    <Route
                        path="/"
                        element={<Home />}
                    />

                    <Route
                        path="/properties"
                        element={<Properties />}
                    />

                    <Route
                        path="/properties/:id"
                        element={<PropertyDetails />}
                    />

                    <Route
                        path="/login"
                        element={<Login />}
                    />

                    <Route
                        path="/register"
                        element={<Register />}
                    />

                    {/* Protected Routes */}

                    <Route
                        path="/add-property"
                        element={
                            <ProtectedRoute>
                                <AddProperty />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/properties/:id/edit"
                        element={
                            <ProtectedRoute>
                                <EditProperty />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/inquiries"
                        element={
                            <ProtectedRoute>
                                <Inquiries />
                            </ProtectedRoute>
                        }
                    />

                </Routes>
            </main>
        </>
    );
}

export default App;