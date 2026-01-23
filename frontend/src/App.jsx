import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Register from './pages/Register'
import StudentDashboard from './pages/StudentDashboard'
import DMTTest from './pages/DMTTest'
import Settings from './pages/Settings'

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth()

    if (loading) return <div className="h-screen flex items-center justify-center text-brand font-black text-2xl">Laden...</div>

    return user ? children : <Navigate to="/login" />
}

function App() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={
                <PrivateRoute>
                    <StudentDashboard />
                </PrivateRoute>
            } />
            <Route path="/test" element={
                <PrivateRoute>
                    <DMTTest />
                </PrivateRoute>
            } />
            <Route path="/settings" element={
                <PrivateRoute>
                    <Settings />
                </PrivateRoute>
            } />
            <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
    )
}

export default App
