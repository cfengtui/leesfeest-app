import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LogIn } from 'lucide-react'

const Login = () => {
    const { login } = useAuth()
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        const success = await login(email, password)
        if (success) {
            navigate('/dashboard')
        } else {
            setError('Inloggen mislukt. Controleer je gegevens.')
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border-4 border-slate-100"
            >
                <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 bg-brand-light rounded-full flex items-center justify-center">
                        <LogIn size={40} className="text-brand-dark" />
                    </div>
                </div>
                <h2 className="text-3xl font-black text-center text-slate-800 mb-8">Inloggen</h2>

                {error && (
                    <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-center font-bold">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-slate-600 font-bold mb-2">Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-4 rounded-xl bg-slate-50 border-2 border-slate-200 focus:border-brand outline-none font-bold text-slate-700"
                        />
                    </div>
                    <div>
                        <label className="block text-slate-600 font-bold mb-2">Wachtwoord</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-4 rounded-xl bg-slate-50 border-2 border-slate-200 focus:border-brand outline-none font-bold text-slate-700"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-brand text-white font-black py-4 rounded-xl text-xl hover:bg-brand-dark transition-colors shadow-lg shadow-brand/30"
                    >
                        Start!
                    </button>
                </form>
                <div className="mt-6 text-center">
                    <Link to="/register" className="text-brand font-bold hover:underline">Nog geen account? Registreren</Link>
                </div>
            </motion.div>
        </div>
    )
}

export default Login
