import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Timer, Mic, Square, Hand, Check, X, Settings } from 'lucide-react'
import confetti from 'canvas-confetti'
import { useSettings } from '../context/SettingsContext'

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
            confetti()
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
            <div className="min-h-screen bg-slate-50 flex flex-col">
                <div className="bg-white p-4 shadow-sm flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-700">Kaart {currentCard} - Score invoeren</h2>
                    <div className="flex items-center gap-2 bg-green-100 px-4 py-2 rounded-lg">
                        <Hand className="text-green-600" size={20} />
                        <span className="text-green-700 font-bold">Handmatig</span>
                    </div>
                </div>

                <div className="flex-1 p-6 max-w-4xl mx-auto w-full">
                    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                        <h3 className="text-lg font-bold text-slate-700 mb-4">
                            Tik op elk woord dat correct is gelezen:
                        </h3>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                            {currentWords.map((word, i) => (
                                <button
                                    key={i}
                                    onClick={() => toggleWordState(i)}
                                    className={`p-3 rounded-xl border-2 font-bold text-lg transition-all ${wordStates[i] === 'correct'
                                            ? 'bg-green-500 border-green-600 text-white'
                                            : wordStates[i] === 'incorrect'
                                                ? 'bg-red-500 border-red-600 text-white'
                                                : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                                        }`}
                                >
                                    <span className="flex items-center justify-center gap-1">
                                        {wordStates[i] === 'correct' && <Check size={16} />}
                                        {wordStates[i] === 'incorrect' && <X size={16} />}
                                        {word}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                        <h3 className="text-lg font-bold text-slate-700 mb-4">
                            Of voer het aantal correct gelezen woorden in:
                        </h3>
                        <input
                            type="number"
                            min="0"
                            max={currentWords.length}
                            value={manualScore}
                            onChange={(e) => setManualScore(e.target.value)}
                            placeholder="Aantal correct"
                            className="w-full p-4 text-2xl font-bold text-center border-2 border-slate-200 rounded-xl focus:border-brand focus:outline-none"
                        />
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-1 bg-brand-light rounded-xl p-4 text-center">
                            <p className="text-sm text-brand-dark font-bold">Geselecteerd correct</p>
                            <p className="text-3xl font-black text-brand">{correctCount}</p>
                        </div>
                        <button
                            onClick={submitManualScore}
                            className="flex-1 bg-brand text-white rounded-xl p-4 font-black text-xl hover:bg-brand-dark transition-colors"
                        >
                            Bevestigen →
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    if (phase === 'finished') {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
                <h1 className="text-5xl font-black text-brand-dark mb-8">Toets Voltooid!</h1>
                <div className="grid grid-cols-3 gap-6 mb-8 w-full max-w-2xl">
                    {[1, 2, 3].map(card => (
                        <div key={card} className="bg-white p-6 rounded-2xl shadow-lg border-b-4 border-slate-200">
                            <h3 className="text-xl font-bold text-slate-500 mb-2">Kaart {card}</h3>
                            <p className="text-4xl font-black text-brand">{results[card] || 0}</p>
                            <p className="text-sm text-slate-400">woorden</p>
                        </div>
                    ))}
                </div>
                <div className="mb-4 px-4 py-2 bg-slate-100 rounded-lg text-sm text-slate-500">
                    Gescoord met: {isManualMode ? '👋 Handmatig' : '🎤 Automatisch'}
                </div>
                <button
                    onClick={() => window.location.href = '/dashboard'}
                    className="bg-brand text-white px-8 py-3 rounded-xl font-black text-xl hover:bg-brand-dark transition-colors"
                >
                    Terug naar Dashboard
                </button>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Header */}
            <div className="bg-white p-4 shadow-sm flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <h2 className="text-xl font-bold text-slate-700">DMT Toets - Kaart {currentCard}</h2>
                    {isManualMode ? (
                        <span className="flex items-center gap-1 bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-bold">
                            <Hand size={14} /> Handmatig
                        </span>
                    ) : (
                        <span className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">
                            <Mic size={14} /> Automatisch
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => window.location.href = '/settings'}
                        className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                        title="Instellingen"
                    >
                        <Settings size={20} className="text-slate-400" />
                    </button>
                    <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-lg">
                        <Timer className={timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-slate-500'} />
                        <span className={`text-2xl font-mono font-black ${timeLeft < 10 ? 'text-red-500' : 'text-slate-700'}`}>
                            {timeLeft}s
                        </span>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-6 flex flex-col items-center max-w-5xl mx-auto w-full">

                {!isActive ? (
                    <div className="flex-1 flex flex-col items-center justify-center">
                        {isManualMode && (
                            <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4 max-w-md text-center">
                                <p className="text-amber-700 text-sm">
                                    <strong>Handmatige modus:</strong> Na afloop kunt u aangeven welke woorden correct zijn gelezen.
                                </p>
                            </div>
                        )}
                        <button
                            onClick={startCard}
                            className="bg-brand text-white text-2xl font-black px-12 py-6 rounded-2xl shadow-xl hover:scale-105 transition-transform flex items-center gap-4"
                        >
                            {isManualMode ? <Hand size={32} /> : <Mic size={32} />}
                            Start Kaart {currentCard}
                        </button>
                    </div>
                ) : (
                    <div className="w-full bg-white rounded-3xl shadow-xl border-4 border-slate-200 p-8 min-h-[500px] relative overflow-hidden">
                        <div className="grid grid-cols-4 gap-8">
                            {MOCK_CARDS[currentCard].map((word, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="col-span-1 flex items-center justify-center p-4 bg-slate-50 rounded-xl border-2 border-slate-100 text-2xl font-bold text-slate-800"
                                >
                                    {word}
                                </motion.div>
                            ))}
                        </div>

                        {/* Real-time feedback overlay (only in auto mode) */}
                        {!isManualMode && (
                            <div className="absolute bottom-4 left-4 right-4 bg-black/5 p-4 rounded-xl text-center">
                                <p className="text-sm font-bold text-slate-400 uppercase">Ik hoorde:</p>
                                <p className="text-lg text-slate-600 italic h-6 overflow-hidden">{recognizedText.slice(-50)}</p>
                            </div>
                        )}

                        {/* Manual mode indicator */}
                        {isManualMode && (
                            <div className="absolute bottom-4 left-4 right-4 bg-amber-50 p-4 rounded-xl text-center">
                                <p className="text-sm font-bold text-amber-600">
                                    🎯 Luister naar de leerling en druk op Stop als klaar
                                </p>
                            </div>
                        )}

                        <div className="absolute top-4 right-4">
                            {isListening && <span className="flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span></span>}
                        </div>

                        <button
                            onClick={endCard}
                            className="absolute bottom-4 right-4 bg-slate-200 hover:bg-slate-300 p-3 rounded-xl text-slate-600"
                        >
                            <Square fill="currentColor" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default DMTTest
