import React from 'react'
import { useAuth } from '../context/AuthContext'
import { motion } from 'framer-motion'
import { Play, FileText, CheckCircle, Settings } from 'lucide-react'

const StudentDashboard = () => {
    const [history, setHistory] = React.useState([])
    const { user, logout } = useAuth()

    // Use environment variable for API base URL, fallback to relative URL for production
    const API_BASE = import.meta.env.VITE_API_URL || '';

    React.useEffect(() => {
        if (user) {
            fetch(`${API_BASE}/session/me`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('dmt_token')}` }
            })
                .then(r => r.json())
                .then(setHistory)
                .catch(console.error)
        }
    }, [user])

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <header className="flex justify-between items-center mb-12">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-brand-light rounded-full flex items-center justify-center text-2xl font-black text-brand-dark">
                        {user?.name?.[0] || '?'}
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-800">Hallo, {user?.name}!</h1>
                        <p className="text-slate-500 font-bold">Groep {user?.school_group}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => window.location.href = '/settings'}
                        className="p-2 rounded-xl bg-white shadow-md hover:bg-slate-100 transition-colors"
                        title="Instellingen"
                    >
                        <Settings size={24} className="text-slate-500" />
                    </button>
                    <button onClick={logout} className="text-slate-400 font-bold hover:text-red-500">
                        Uitloggen
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-white p-8 rounded-3xl shadow-xl border-b-8 border-r-8 border-brand cursor-pointer group"
                >
                    <div className="flex justify-between items-start mb-6">
                        <div className="w-16 h-16 bg-brand-light rounded-2xl flex items-center justify-center">
                            <Play size={32} className="text-brand-dark" />
                        </div>
                        <span className="bg-brand-light text-brand-dark font-black px-4 py-2 rounded-full text-sm">NIEUW</span>
                    </div>
                    <h2 className="text-3xl font-black text-slate-800 mb-2 group-hover:text-brand transition-colors">DMT Toets</h2>
                    <p className="text-slate-500 font-medium mb-8">
                        Doe de officiële toets. 3 kaarten, 1 minuut per kaart.
                    </p>
                    <button onClick={() => window.location.href = '/test'} className="w-full py-4 rounded-xl bg-brand text-white font-black text-xl group-hover:bg-brand-dark transition-colors">
                        Start Toets
                    </button>
                </motion.div>

                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-white p-8 rounded-3xl shadow-xl border-b-8 border-r-8 border-yellow-400 cursor-pointer group"
                >
                    <div className="flex justify-between items-start mb-6">
                        <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center">
                            <FileText size={32} className="text-yellow-600" />
                        </div>
                    </div>
                    <h2 className="text-3xl font-black text-slate-800 mb-2 group-hover:text-yellow-500 transition-colors">Oefenen</h2>
                    <p className="text-slate-500 font-medium mb-8">
                        Gewoon lekker lezen zonder tijd of druk.
                    </p>
                    <button className="w-full py-4 rounded-xl bg-yellow-400 text-yellow-900 font-black text-xl group-hover:bg-yellow-500 transition-colors">
                        Ga Oefenen
                    </button>
                </motion.div>
            </div>

            {history.length > 0 && (
                <div className="max-w-4xl mx-auto">
                    <h3 className="text-2xl font-black text-slate-700 mb-6">Mijn Geschiedenis</h3>
                    <div className="space-y-4">
                        {history.map(session => (
                            <div key={session.id} className="bg-white p-6 rounded-2xl shadow-md flex justify-between items-center">
                                <div>
                                    <p className="font-bold text-slate-700">Oefensessie</p>
                                    <p className="text-sm text-slate-400">{new Date(session.created_at).toLocaleDateString()}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-black text-brand">{session.correct_words}</p>
                                    <p className="text-xs font-bold text-slate-400 uppercase">Woorden</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default StudentDashboard
