import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Timer, Mic, Square, Hand, Check, X, Settings, ArrowLeft, BookOpen, Star } from 'lucide-react'
import confetti from 'canvas-confetti'
import { useSettings } from '../context/SettingsContext'
import Decorations from '../components/Decorations'

// Use environment variable for API base URL, fallback to relative URL for production
const API_BASE = import.meta.env.VITE_API_URL || '';

const CARD_DURATION = 60 // seconds

// Mock data - In real app, fetch from backend based on card ID
const MOCK_CARDS = {
    1: ["kat", "boom", "huis", "vis", "vuur", "mus", "raam", "boek", "soep", "jas", "meer", "maan", "roos", "pen", "aap"],
    2: ["schip", "vliegtuig", "appel", "konijn", "lopen", "zingen", "dansen", "spelen", "klimmen", "rennen", "lezen", "schrijven"],
    3: ["bibliotheek", "verjaardag", "televisie", "computer", "vrachtwagen", "pannenkoek", "ziekenhuis", "politieauto", "brandweer", "helikopter"]
}

const DMTTest = () => {
    const { settings, canUseAutoScoring } = useSettings()
    const [phase, setPhase] = useState('intro') // intro, testing, manual_score, finished
    const [currentCard, setCurrentCard] = useState(1)
    const [timeLeft, setTimeLeft] = useState(CARD_DURATION)
    const [isActive, setIsActive] = useState(false)
    const [results, setResults] = useState({}) // { 1: score, 2: score, 3: score }

    // Manual scoring state
    const [manualScore, setManualScore] = useState('')
    const [wordStates, setWordStates] = useState({}) // { wordIndex: 'correct' | 'incorrect' | null }

    // Audio Recognition State (only used in auto mode)
    const [isListening, setIsListening] = useState(false)
    const [recognizedText, setRecognizedText] = useState('')
    const recognitionRef = useRef(null)

    const isManualMode = settings.scoringMode === 'manual' || !canUseAutoScoring

    useEffect(() => {
        // Only set up speech recognition if in auto mode
        if (!isManualMode && 'webkitSpeechRecognition' in window) {
            const SpeechRecognition = window.webkitSpeechRecognition
            recognitionRef.current = new SpeechRecognition()
            recognitionRef.current.continuous = true
            recognitionRef.current.lang = 'nl-NL'
            recognitionRef.current.interimResults = true

            recognitionRef.current.onresult = (event) => {
                let finalTranscript = ''
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript + ' '
                    }
                }
                if (finalTranscript) {
                    setRecognizedText(prev => prev + finalTranscript)
                }
            }
        }

        // Cleanup function to stop recognition when component unmounts
        return () => {
            if (recognitionRef.current) {
                try {
                    recognitionRef.current.stop()
                } catch (e) {
                    // Ignore errors if already stopped
                }
            }
        }
    }, [isManualMode])

    useEffect(() => {
        let interval = null
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(time => time - 1)
            }, 1000)
        } else if (timeLeft === 0) {
            endCard()
        }
        return () => clearInterval(interval)
    }, [isActive, timeLeft])

    const startCard = () => {
        setIsActive(true)
        setTimeLeft(CARD_DURATION)
        setRecognizedText('')
        setWordStates({})

        if (!isManualMode && recognitionRef.current) {
            try {
                recognitionRef.current.start()
                setIsListening(true)
            } catch (e) { console.error("Mic error", e) }
        }
    }

    const endCard = () => {
        setIsActive(false)
        if (recognitionRef.current) {
            try {
                recognitionRef.current.stop()
            } catch (e) { }
            setIsListening(false)
        }

        if (isManualMode) {
            // Go to manual scoring phase
            setPhase('manual_score')
        } else {
            // Calculate automatic score
            const words = recognizedText.trim().split(/\s+/).length
            const score = Math.min(words, MOCK_CARDS[currentCard].length)
            finishCard(score)
        }
    }

    const finishCard = (score) => {
        setResults(prev => ({ ...prev, [currentCard]: score }))

        if (currentCard < 3) {
            setCurrentCard(c => c + 1)
            setTimeLeft(CARD_DURATION)
            setPhase('intro')
            setManualScore('')
            setWordStates({})
        } else {
            setPhase('finished')
            confetti({
                particleCount: 150,
                spread: 100,
                origin: { y: 0.6 }
            })
            saveResults({ ...results, [currentCard]: score })
        }
    }

    const submitManualScore = () => {
        // Count correct words from toggle or use typed number
        let score
        if (Object.keys(wordStates).length > 0) {
            score = Object.values(wordStates).filter(s => s === 'correct').length
        } else {
            score = parseInt(manualScore) || 0
        }
        finishCard(score)
    }

    const toggleWordState = (index) => {
        setWordStates(prev => {
            const current = prev[index]
            if (!current) return { ...prev, [index]: 'correct' }
            if (current === 'correct') return { ...prev, [index]: 'incorrect' }
            const { [index]: _, ...rest } = prev
            return rest
        })
    }

    const saveResults = async (finalResults) => {
        const totalScore = Object.values(finalResults).reduce((a, b) => a + b, 0)
        try {
            await fetch(`${API_BASE}/session/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('dmt_token')}`
                },
                body: JSON.stringify({
                    user_id: 0, // Ignored by backend
                    total_words: 100, // Mock
                    correct_words: totalScore,
                    duration_seconds: 180,
                    wpm: Math.round(totalScore / 3),
                    accuracy: 100,
                    words_presented: [],
                    words_read: [],
                    scoring_mode: isManualMode ? 'manual' : 'auto'
                })
            })
        } catch (e) {
            console.error("Failed to save results", e)
        }
    }

    // Manual scoring phase
    if (phase === 'manual_score') {
        const currentWords = MOCK_CARDS[currentCard]
        const correctCount = Object.values(wordStates).filter(s => s === 'correct').length

        return (
            <div className="min-h-screen bg-gradient-to-b from-indigo-100 via-purple-50 to-pink-50 relative">
                <Decorations />
                <div className="relative z-10">
                    {/* Header */}
                    <div className="bg-white/90 backdrop-blur p-4 shadow-sm flex justify-between items-center">
                        <h2 className="text-xl font-bold text-primary-dark">Kaart {currentCard} - Score invoeren</h2>
                        <div className="flex items-center gap-2 bg-amber-100 px-4 py-2 rounded-full">
                            <Hand className="text-amber-600" size={18} />
                            <span className="text-amber-700 font-bold text-sm">Handmatig</span>
                        </div>
                    </div>

                    <div className="p-6 max-w-2xl mx-auto">
                        {/* Word toggle grid */}
                        <div className="bg-white/90 backdrop-blur rounded-3xl shadow-xl p-6 mb-6">
                            <h3 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
                                <span>👆</span> Tik op elk correct gelezen woord:
                            </h3>
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                {currentWords.map((word, i) => (
                                    <motion.button
                                        key={i}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => toggleWordState(i)}
                                        className={`p-3 rounded-xl border-2 font-bold text-lg transition-all ${wordStates[i] === 'correct'
                                            ? 'bg-green-500 border-green-600 text-white shadow-lg'
                                            : wordStates[i] === 'incorrect'
                                                ? 'bg-red-400 border-red-500 text-white'
                                                : 'bg-white border-gray-200 text-gray-700 hover:border-primary/50 hover:bg-primary/5'
                                            }`}
                                    >
                                        <span className="flex items-center justify-center gap-1">
                                            {wordStates[i] === 'correct' && <Check size={16} />}
                                            {wordStates[i] === 'incorrect' && <X size={16} />}
                                            {word}
                                        </span>
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        {/* Number input alternative */}
                        <div className="bg-white/90 backdrop-blur rounded-2xl shadow-lg p-5 mb-6">
                            <h3 className="text-md font-bold text-gray-600 mb-3">
                                Of voer een getal in:
                            </h3>
                            <input
                                type="number"
                                min="0"
                                max={currentWords.length}
                                value={manualScore}
                                onChange={(e) => setManualScore(e.target.value)}
                                placeholder="Aantal correct"
                                className="w-full p-4 text-2xl font-bold text-center border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none"
                            />
                        </div>

                        {/* Submit section */}
                        <div className="flex gap-4">
                            <div className="flex-1 bg-green-100 rounded-2xl p-4 text-center">
                                <p className="text-sm text-green-700 font-bold">Correct</p>
                                <p className="text-4xl font-black text-green-600">{correctCount}</p>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={submitManualScore}
                                className="flex-1 bg-gradient-to-r from-primary to-primary-dark text-white rounded-2xl p-4 font-black text-xl shadow-lg"
                            >
                                Volgende →
                            </motion.button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // Finished phase
    if (phase === 'finished') {
        const totalScore = Object.values(results).reduce((a, b) => a + b, 0)

        return (
            <div className="min-h-screen bg-gradient-to-b from-indigo-100 via-purple-50 to-pink-50 relative">
                <Decorations />
                <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6 text-center">
                    {/* Celebration header */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="mb-6"
                    >
                        <span className="text-7xl">🎉</span>
                    </motion.div>

                    <h1 className="text-4xl font-black text-primary-dark mb-2">Geweldig gedaan!</h1>
                    <p className="text-gray-500 mb-8">Je hebt de toets afgerond</p>

                    {/* Score cards */}
                    <div className="grid grid-cols-3 gap-4 mb-6 w-full max-w-md">
                        {[1, 2, 3].map(card => (
                            <motion.div
                                key={card}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: card * 0.2 }}
                                className="bg-white/90 backdrop-blur p-4 rounded-2xl shadow-lg"
                            >
                                <p className="text-sm text-gray-400 font-bold">Kaart {card}</p>
                                <p className="text-3xl font-black text-primary">{results[card] || 0}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Total score */}
                    <div className="bg-gradient-to-r from-yellow-400 to-amber-400 text-amber-900 px-8 py-4 rounded-2xl shadow-lg mb-6">
                        <div className="flex items-center gap-3">
                            <Star size={28} className="fill-amber-900" />
                            <div>
                                <p className="text-sm font-bold opacity-80">Totaal</p>
                                <p className="text-3xl font-black">{totalScore} woorden</p>
                            </div>
                        </div>
                    </div>

                    {/* Mode indicator */}
                    <div className="mb-6 px-4 py-2 bg-white/60 backdrop-blur rounded-full text-sm text-gray-500">
                        Gescoord met: {isManualMode ? '👋 Handmatig' : '🎤 Automatisch'}
                    </div>

                    {/* Back button */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => window.location.href = '/dashboard'}
                        className="bg-gradient-to-r from-primary to-primary-dark text-white px-8 py-4 rounded-2xl font-black text-xl shadow-lg flex items-center gap-3"
                    >
                        <ArrowLeft size={24} />
                        Terug naar Dashboard
                    </motion.button>
                </div>
            </div>
        )
    }

    // Main test view (intro and testing phases)
    return (
        <div className="min-h-screen bg-gradient-to-b from-indigo-100 via-purple-50 to-pink-50 relative">
            <Decorations />

            <div className="relative z-10 flex flex-col min-h-screen">
                {/* Header */}
                <div className="bg-white/90 backdrop-blur p-4 shadow-sm flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => window.location.href = '/dashboard'}
                            className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
                        >
                            <ArrowLeft size={20} className="text-gray-500" />
                        </button>
                        <div>
                            <h2 className="text-lg font-bold text-primary-dark">Kaart {currentCard} van 3</h2>
                            <div className="flex gap-1">
                                {[1, 2, 3].map(i => (
                                    <div
                                        key={i}
                                        className={`h-1.5 w-8 rounded-full ${i < currentCard ? 'bg-green-400' :
                                                i === currentCard ? 'bg-primary' : 'bg-gray-200'
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Mode badge */}
                        {isManualMode ? (
                            <span className="flex items-center gap-1 bg-amber-100 text-amber-700 px-3 py-1.5 rounded-full text-sm font-bold">
                                <Hand size={14} /> Handmatig
                            </span>
                        ) : (
                            <span className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-sm font-bold">
                                <Mic size={14} /> Auto
                            </span>
                        )}

                        {/* Timer */}
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono font-black text-xl ${timeLeft < 10
                                ? 'bg-red-100 text-red-600'
                                : 'bg-primary/10 text-primary-dark'
                            }`}>
                            <Timer size={20} className={timeLeft < 10 ? 'animate-pulse' : ''} />
                            {timeLeft}s
                        </div>
                    </div>
                </div>

                {/* Main content */}
                <div className="flex-1 p-6 flex flex-col items-center max-w-3xl mx-auto w-full">
                    {!isActive ? (
                        /* Start button */
                        <div className="flex-1 flex flex-col items-center justify-center">
                            {isManualMode && (
                                <div className="mb-6 bg-amber-50 border border-amber-200 rounded-2xl p-4 max-w-sm text-center">
                                    <p className="text-amber-700 text-sm">
                                        <strong>👋 Handmatige modus:</strong><br />
                                        Luister naar de leerling, dan kun je aangeven welke woorden correct zijn.
                                    </p>
                                </div>
                            )}

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={startCard}
                                className="bg-gradient-to-r from-green-400 to-green-500 text-white text-2xl font-black px-12 py-6 rounded-3xl shadow-xl flex items-center gap-4 border-b-4 border-green-600"
                            >
                                <div className="bg-white/30 p-3 rounded-xl">
                                    <BookOpen size={32} />
                                </div>
                                Start Kaart {currentCard}
                            </motion.button>

                            <p className="mt-4 text-gray-400 text-sm">
                                {MOCK_CARDS[currentCard].length} woorden • 1 minuut
                            </p>
                        </div>
                    ) : (
                        /* Word display during test */
                        <div className="w-full bg-white/90 backdrop-blur rounded-3xl shadow-xl p-6 min-h-[400px] relative">
                            {/* Encouragement message */}
                            <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-bold">
                                <span>🐻</span> Goed bezig!
                            </div>

                            {/* Words grid */}
                            <div className="mt-12 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                                {MOCK_CARDS[currentCard].map((word, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="flex items-center justify-center p-4 bg-white border-2 border-primary/20 rounded-xl text-xl font-bold text-gray-800 shadow-sm"
                                    >
                                        {word}
                                    </motion.div>
                                ))}
                            </div>

                            {/* Bottom feedback */}
                            {!isManualMode && (
                                <div className="absolute bottom-4 left-4 right-4 bg-gray-50 p-3 rounded-xl text-center">
                                    <p className="text-xs font-bold text-gray-400 uppercase">Ik hoorde:</p>
                                    <p className="text-sm text-gray-600 italic h-5 overflow-hidden">{recognizedText.slice(-50)}</p>
                                </div>
                            )}

                            {isManualMode && (
                                <div className="absolute bottom-4 left-4 right-4 bg-amber-50 p-3 rounded-xl text-center">
                                    <p className="text-sm font-bold text-amber-600">
                                        🎯 Luister naar de leerling...
                                    </p>
                                </div>
                            )}

                            {/* Recording indicator */}
                            {isListening && (
                                <div className="absolute top-4 right-4">
                                    <span className="flex h-4 w-4">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
                                    </span>
                                </div>
                            )}

                            {/* Stop button */}
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={endCard}
                                className="absolute bottom-4 right-4 bg-gray-200 hover:bg-red-100 p-3 rounded-xl text-gray-600 hover:text-red-500 transition-colors"
                            >
                                <Square size={24} fill="currentColor" />
                            </motion.button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default DMTTest
