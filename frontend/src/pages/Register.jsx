import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { UserPlus, Sparkles } from 'lucide-react'
import Decorations from '../components/Decorations'

// Use environment variable for API base URL, fallback to relative URL for production
const API_BASE = import.meta.env.VITE_API_URL || '';

const Register = () => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        school_group: 3
    })
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')

        try {
            const response = await fetch(`${API_BASE}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            if (response.ok) {
                navigate('/login')
            } else {
                const data = await response.json()
                setError(data.detail || 'Registratie mislukt')
            }
        } catch (err) {
            setError('Er ging iets mis.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-100 via-purple-50 to-pink-50 p-4 relative">
            <Decorations />

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/90 backdrop-blur p-8 rounded-3xl shadow-xl w-full max-w-md relative z-10"
            >
                {/* Header */}
                <div className="flex flex-col items-center mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                        <UserPlus size={40} className="text-white" />
                    </div>
                    <h2 className="text-2xl font-black text-gray-800 flex items-center gap-2">
                        <Sparkles size={24} className="text-yellow-500" />
                        Nieuw Account
                        <Sparkles size={24} className="text-yellow-500" />
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">Begin je leesavontuur!</p>
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

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-600 font-bold mb-1 text-sm">Naam</label>
                        <input
                            name="name"
                            required
                            onChange={handleChange}
                            placeholder="Jouw naam"
                            className="w-full p-3 rounded-xl bg-gray-50 border-2 border-gray-200 focus:border-primary focus:bg-white outline-none font-medium text-gray-700 transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-600 font-bold mb-1 text-sm">Email</label>
                        <input
                            name="email"
                            type="email"
                            required
                            onChange={handleChange}
                            placeholder="jouw@email.nl"
                            className="w-full p-3 rounded-xl bg-gray-50 border-2 border-gray-200 focus:border-primary focus:bg-white outline-none font-medium text-gray-700 transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-600 font-bold mb-1 text-sm">Wachtwoord</label>
                        <input
                            name="password"
                            type="password"
                            required
                            onChange={handleChange}
                            placeholder="••••••••"
                            className="w-full p-3 rounded-xl bg-gray-50 border-2 border-gray-200 focus:border-primary focus:bg-white outline-none font-medium text-gray-700 transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-600 font-bold mb-1 text-sm">Groep</label>
                        <div className="grid grid-cols-6 gap-2">
                            {[3, 4, 5, 6, 7, 8].map(g => (
                                <button
                                    key={g}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, school_group: g })}
                                    className={`p-3 rounded-xl font-bold text-lg transition-all ${formData.school_group === g
                                            ? 'bg-primary text-white shadow-md'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    {g}
                                </button>
                            ))}
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 text-amber-900 font-black py-4 rounded-xl text-xl shadow-lg border-b-4 border-amber-600 mt-4 disabled:opacity-70"
                    >
                        {isLoading ? 'Even geduld...' : 'Maak Account ✨'}
                    </motion.button>
                </form>

                <div className="mt-6 text-center">
                    <Link to="/login" className="text-primary font-bold hover:underline">
                        Heb je al een account? Inloggen
                    </Link>
                </div>
            </motion.div>
        </div>
    )
}

export default Register
