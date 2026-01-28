import React from 'react'
import { useAuth } from '../context/AuthContext'
import { motion } from 'framer-motion'
import { Book, Pencil, Home, Library, Gift, User, Star, Trophy, BookOpen, Settings, LogOut } from 'lucide-react'
import Decorations from '../components/Decorations'

const StudentDashboard = () => {
    const [history, setHistory] = React.useState([])
    const [activeTab, setActiveTab] = React.useState('home')
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

    // Calculate stats from history
    const totalScore = history.reduce((sum, s) => sum + (s.correct_words || 0), 0)
    const sessionsCount = history.length
    const level = totalScore < 50 ? 1 : totalScore < 150 ? 2 : totalScore < 300 ? 3 : 4
    const levelNames = ['Beginner', 'Lezer', 'Boekenwurm', 'Leeskampioen']
    const levelColors = ['bg-gray-400', 'bg-blue-400', 'bg-purple-500', 'bg-yellow-500']

    return (
        <div className="min-h-screen bg-gradient-to-b from-indigo-100 via-purple-50 to-pink-50 relative overflow-hidden">
            {/* Decorative background elements */}
            <Decorations />

            {/* Main content */}
            <div className="relative z-10 pb-24">
                {/* Header */}
                <header className="pt-6 px-6 flex justify-between items-center">
                    <h1 className="text-3xl font-black text-primary-dark flex items-center gap-2">
                        <span>📚</span>
                        <span>Leesfeest</span>
                        <span>🎉</span>
                    </h1>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => window.location.href = '/settings'}
                            className="p-2 rounded-full bg-white/80 shadow-md hover:bg-white transition-colors"
                            title="Instellingen"
                        >
                            <Settings size={20} className="text-primary" />
                        </button>
                        <button
                            onClick={logout}
                            className="p-2 rounded-full bg-white/80 shadow-md hover:bg-red-50 transition-colors"
                            title="Uitloggen"
                        >
                            <LogOut size={20} className="text-gray-400 hover:text-red-500" />
                        </button>
                    </div>
                </header>

                {/* Main Action Buttons */}
                <div className="px-6 mt-8 space-y-4 max-w-md mx-auto">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => window.location.href = '/test'}
                        className="w-full bg-gradient-to-r from-green-400 to-green-500 text-white font-black text-2xl py-5 px-8 rounded-2xl shadow-lg flex items-center justify-center gap-4 border-b-4 border-green-600"
                    >
                        <div className="bg-white/30 p-2 rounded-xl">
                            <BookOpen size={28} />
                        </div>
                        <span>Start Lezen</span>
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => window.location.href = '/test?mode=spelling'}
                        className="w-full bg-gradient-to-r from-yellow-400 to-amber-400 text-amber-900 font-black text-2xl py-5 px-8 rounded-2xl shadow-lg flex items-center justify-center gap-4 border-b-4 border-amber-500"
                    >
                        <div className="bg-white/30 p-2 rounded-xl">
                            <Pencil size={28} />
                        </div>
                        <span>Spelling</span>
                    </motion.button>
                </div>

                {/* Progress Section */}
                <div className="px-6 mt-10 max-w-md mx-auto">
                    <h2 className="text-xl font-bold text-gray-700 mb-4">Jouw Voortgang</h2>

                    <div className="bg-white/90 backdrop-blur rounded-3xl shadow-xl p-6">
                        <div className="flex items-center gap-4 mb-6">
                            {/* Star rating display */}
                            <div className="flex -space-x-1">
                                {[1, 2, 3].map((i) => (
                                    <Star
                                        key={i}
                                        size={32}
                                        className={`${i <= Math.min(level, 3) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'} drop-shadow`}
                                    />
                                ))}
                            </div>

                            <div className="flex-1">
                                <div className="text-sm text-gray-500">Totaal Score:</div>
                                <div className="text-3xl font-black text-primary">{totalScore}</div>
                            </div>
                        </div>

                        {/* Level badge */}
                        <div className={`${levelColors[level - 1]} text-white text-center py-2 px-4 rounded-full font-bold text-sm mb-6`}>
                            Niveau {level}: {levelNames[level - 1]}
                        </div>

                        {/* Stats cards */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-indigo-50 rounded-2xl p-4 flex items-center gap-3">
                                <div className="bg-indigo-100 p-2 rounded-xl">
                                    <BookOpen size={24} className="text-indigo-500" />
                                </div>
                                <div>
                                    <div className="text-xs text-gray-500">Sessies</div>
                                    <div className="text-xl font-black text-indigo-600">{sessionsCount}</div>
                                </div>
                            </div>

                            <div className="bg-amber-50 rounded-2xl p-4 flex items-center gap-3">
                                <div className="bg-amber-100 p-2 rounded-xl">
                                    <Trophy size={24} className="text-amber-500" />
                                </div>
                                <div>
                                    <div className="text-xs text-gray-500">Beloningen</div>
                                    <div className="text-xl font-black text-amber-600">{Math.floor(totalScore / 50)}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent History */}
                {history.length > 0 && (
                    <div className="px-6 mt-8 max-w-md mx-auto">
                        <h3 className="text-lg font-bold text-gray-600 mb-3">Recente Sessies</h3>
                        <div className="space-y-3">
                            {history.slice(0, 3).map(session => (
                                <div key={session.id} className="bg-white/80 backdrop-blur p-4 rounded-2xl shadow-md flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-green-100 p-2 rounded-xl">
                                            <Book size={20} className="text-green-500" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-700">Leessessie</p>
                                            <p className="text-xs text-gray-400">{new Date(session.created_at).toLocaleDateString('nl-NL')}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-black text-green-500">{session.correct_words}</p>
                                        <p className="text-xs text-gray-400">woorden</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur border-t border-gray-100 shadow-lg z-20">
                <div className="max-w-md mx-auto flex justify-around py-2">
                    <NavButton icon={Home} label="Home" active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
                    <NavButton icon={Library} label="Bibliotheek" active={activeTab === 'library'} onClick={() => setActiveTab('library')} />
                    <NavButton icon={Gift} label="Beloningen" active={activeTab === 'rewards'} onClick={() => setActiveTab('rewards')} />
                    <NavButton icon={User} label="Profiel" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
                </div>
            </nav>
        </div>
    )
}

// Bottom navigation button component
const NavButton = ({ icon: Icon, label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`flex flex-col items-center p-2 rounded-xl transition-all ${active
                ? 'text-primary bg-primary/10'
                : 'text-gray-400 hover:text-gray-600'
            }`}
    >
        <Icon size={24} />
        <span className="text-xs font-medium mt-1">{label}</span>
    </button>
)

export default StudentDashboard
