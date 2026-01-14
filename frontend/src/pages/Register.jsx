import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { UserPlus } from 'lucide-react'

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

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
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
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border-4 border-slate-100"
            >
                <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center">
                        <UserPlus size={40} className="text-yellow-600" />
                    </div>
                </div>
                <h2 className="text-3xl font-black text-center text-slate-800 mb-8">Nieuwe Account</h2>

                {error && (
                    <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-center font-bold">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-slate-600 font-bold mb-1">Naam</label>
                        <input
                            name="name"
                            required
                            onChange={handleChange}
                            className="w-full p-3 rounded-xl bg-slate-50 border-2 border-slate-200 focus:border-brand outline-none font-bold text-slate-700"
                        />
                    </div>
                    <div>
                        <label className="block text-slate-600 font-bold mb-1">Email</label>
                        <input
                            name="email"
                            type="email"
                            required
                            onChange={handleChange}
                            className="w-full p-3 rounded-xl bg-slate-50 border-2 border-slate-200 focus:border-brand outline-none font-bold text-slate-700"
                        />
                    </div>
                    <div>
                        <label className="block text-slate-600 font-bold mb-1">Wachtwoord</label>
                        <input
                            name="password"
                            type="password"
                            required
                            onChange={handleChange}
                            className="w-full p-3 rounded-xl bg-slate-50 border-2 border-slate-200 focus:border-brand outline-none font-bold text-slate-700"
                        />
                    </div>
                    <div>
                        <label className="block text-slate-600 font-bold mb-1">Groep</label>
                        <select
                            name="school_group"
                            onChange={handleChange}
                            className="w-full p-3 rounded-xl bg-slate-50 border-2 border-slate-200 focus:border-brand outline-none font-bold text-slate-700"
                        >
                            {[3, 4, 5, 6, 7, 8].map(g => (
                                <option key={g} value={g}>Groep {g}</option>
                            ))}
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-yellow-400 text-yellow-900 font-black py-4 rounded-xl text-xl hover:bg-yellow-500 transition-colors mt-6"
                    >
                        Maak Account
                    </button>
                </form>
                <div className="mt-6 text-center">
                    <Link to="/login" className="text-slate-500 font-bold hover:underline">Heb je al een account? Inloggen</Link>
                </div>
            </motion.div>
        </div>
    )
}

export default Register
