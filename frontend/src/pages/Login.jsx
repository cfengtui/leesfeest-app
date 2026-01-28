import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BookOpen } from 'lucide-react'
import Decorations from '../components/Decorations'

const Login = () => {
    const { login } = useAuth()
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')

        const success = await login(email, password)
        if (success) {
            navigate('/dashboard')
        } else {
            setError('Inloggen mislukt. Controleer je gegevens.')
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-100 via-purple-50 to-pink-50 p-4 relative">
            <Decorations />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/90 backdrop-blur p-8 rounded-3xl shadow-xl w-full max-w-md relative z-10"
            >
                {/* Logo */}
                <div className="flex flex-col items-center mb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary-dark rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                        <BookOpen size={40} className="text-white" />
                    </div>
                    <h1 className="text-3xl font-black text-primary-dark flex items-center gap-2">
                        <span>📚</span> Leesfeest <span>🎉</span>
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Welkom terug!</p>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl mb-4 text-center font-bold text-sm"
                    >
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-gray-600 font-bold mb-2 text-sm">Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-4 rounded-xl bg-gray-50 border-2 border-gray-200 focus:border-primary focus:bg-white outline-none font-medium text-gray-700 transition-colors"
                            placeholder="jouw@email.nl"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-600 font-bold mb-2 text-sm">Wachtwoord</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-4 rounded-xl bg-gray-50 border-2 border-gray-200 focus:border-primary focus:bg-white outline-none font-medium text-gray-700 transition-colors"
                            placeholder="••••••••"
                        />
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-green-400 to-green-500 text-white font-black py-4 rounded-xl text-xl shadow-lg border-b-4 border-green-600 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Even geduld...' : 'Start! 🚀'}
                    </motion.button>
                </form>

                <div className="mt-6 text-center">
                    <Link to="/register" className="text-primary font-bold hover:underline">
                        Nog geen account? Registreren
                    </Link>
                </div>
            </motion.div>
        </div>
    )
}

export default Login
