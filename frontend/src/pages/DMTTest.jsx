import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Timer, Mic, Square } from 'lucide-react'
import confetti from 'canvas-confetti'

const CARD_DURATION = 60 // seconds

// Mock data - In real app, fetch from backend based on card ID
const MOCK_CARDS = {
    1: ["kat", "boom", "huis", "vis", "vuur", "mus", "raam", "boek", "soep", "jas", "meer", "maan", "roos", "pen", "aap"],
    2: ["schip", "vliegtuig", "appel", "konijn", "lopen", "zingen", "dansen", "spelen", "klimmen", "rennen", "lezen", "schrijven"],
    3: ["bibliotheek", "verjaardag", "televisie", "computer", "vrachtwagen", "pannenkoek", "ziekenhuis", "politieauto", "brandweer", "helikopter"]
}

const DMTTest = () => {
    const [phase, setPhase] = useState('intro') // intro, testing, finished
    const [currentCard, setCurrentCard] = useState(1)
    const [timeLeft, setTimeLeft] = useState(CARD_DURATION)
    const [isActive, setIsActive] = useState(false)
    const [results, setResults] = useState({}) // { 1: score, 2: score, 3: score }

    // Audio Recognition State
    const [isListening, setIsListening] = useState(false)
    const [recognizedText, setRecognizedText] = useState('')
    const recognitionRef = useRef(null)

    useEffect(() => {
        if ('webkitSpeechRecognition' in window) {
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
    }, [])

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
        if (recognitionRef.current) {
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

        // Calculate abstract score based on captured text (simplified)
        // In real app, we'd diff Recognized vs Expected
        const words = recognizedText.trim().split(/\s+/).length
        const score = Math.min(words, MOCK_CARDS[currentCard].length) // Mock logic

        setResults(prev => ({ ...prev, [currentCard]: score }))

        if (currentCard < 3) {
            setCurrentCard(c => c + 1)
            setTimeLeft(CARD_DURATION)
        } else {
            setPhase('finished')
            confetti()
            saveResults({ ...results, [currentCard]: score })
        }
    }

    const saveResults = async (finalResults) => {
        const totalScore = Object.values(finalResults).reduce((a, b) => a + b, 0)
        try {
            await fetch('http://localhost:8000/session/', {
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
                    words_read: []
                })
            })
        } catch (e) {
            console.error("Failed to save results", e)
        }
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
                <h2 className="text-xl font-bold text-slate-700">DMT Toets - Kaart {currentCard}</h2>
                <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-lg">
                    <Timer className={timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-slate-500'} />
                    <span className={`text-2xl font-mono font-black ${timeLeft < 10 ? 'text-red-500' : 'text-slate-700'}`}>
                        {timeLeft}s
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-6 flex flex-col items-center max-w-5xl mx-auto w-full">

                {!isActive ? (
                    <div className="flex-1 flex flex-col items-center justify-center">
                        <button
                            onClick={startCard}
                            className="bg-brand text-white text-2xl font-black px-12 py-6 rounded-2xl shadow-xl hover:scale-105 transition-transform flex items-center gap-4"
                        >
                            <Mic size={32} />
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

                        {/* Real-time feedback overlay (optional, debug only) */}
                        <div className="absolute bottom-4 left-4 right-4 bg-black/5 p-4 rounded-xl text-center">
                            <p className="text-sm font-bold text-slate-400 uppercase">Ik hoorde:</p>
                            <p className="text-lg text-slate-600 italic h-6 overflow-hidden">{recognizedText.slice(-50)}</p>
                        </div>

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
