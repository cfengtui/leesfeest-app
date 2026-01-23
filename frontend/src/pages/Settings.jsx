import { useState } from 'react'
import { useSettings } from '../context/SettingsContext'
import { useAuth } from '../context/AuthContext'
import { Settings as SettingsIcon, Mic, Hand, Shield, ChevronLeft, AlertTriangle, Check } from 'lucide-react'
import { motion } from 'framer-motion'

const Settings = () => {
    const { settings, setScoringMode, giveDeepgramConsent, revokeDeepgramConsent } = useSettings()
    const { user, logout } = useAuth()
    const [showConsentDialog, setShowConsentDialog] = useState(false)

    const handleAutoModeToggle = () => {
        if (settings.scoringMode === 'auto') {
            // Switching to manual - always allowed
            setScoringMode('manual')
        } else {
            // Switching to auto - check consent first
            if (settings.deepgramConsent) {
                setScoringMode('auto')
            } else {
                setShowConsentDialog(true)
            }
        }
    }

    const handleAcceptConsent = () => {
        giveDeepgramConsent()
        setScoringMode('auto')
        setShowConsentDialog(false)
    }

    const handleRevokeConsent = () => {
        revokeDeepgramConsent()
    }

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <header className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => window.location.href = '/dashboard'}
                    className="p-2 rounded-xl bg-white shadow-md hover:bg-slate-100 transition-colors"
                >
                    <ChevronLeft size={24} className="text-slate-600" />
                </button>
                <div className="flex items-center gap-3">
                    <SettingsIcon size={28} className="text-brand" />
                    <h1 className="text-2xl font-black text-slate-800">Instellingen</h1>
                </div>
            </header>

            <div className="max-w-xl mx-auto space-y-6">
                {/* Scoring Mode Section */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h2 className="text-lg font-bold text-slate-700 mb-4">Scoringsmodus</h2>

                    <div className="space-y-3">
                        {/* Manual Mode Option */}
                        <button
                            onClick={() => setScoringMode('manual')}
                            className={`w-full p-4 rounded-xl border-2 transition-all flex items-start gap-4 text-left ${settings.scoringMode === 'manual'
                                    ? 'border-brand bg-brand-light/30'
                                    : 'border-slate-200 hover:border-slate-300'
                                }`}
                        >
                            <div className={`p-2 rounded-lg ${settings.scoringMode === 'manual' ? 'bg-brand' : 'bg-slate-100'}`}>
                                <Hand size={24} className={settings.scoringMode === 'manual' ? 'text-white' : 'text-slate-500'} />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-bold text-slate-800">Handmatig scoren</h3>
                                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">Privacy-vriendelijk</span>
                                </div>
                                <p className="text-sm text-slate-500 mt-1">
                                    Ouder of leerkracht telt de correct gelezen woorden en voert de score in.
                                    Geen stemgegevens worden verzonden.
                                </p>
                            </div>
                            {settings.scoringMode === 'manual' && (
                                <Check size={24} className="text-brand flex-shrink-0" />
                            )}
                        </button>

                        {/* Auto Mode Option */}
                        <button
                            onClick={handleAutoModeToggle}
                            className={`w-full p-4 rounded-xl border-2 transition-all flex items-start gap-4 text-left ${settings.scoringMode === 'auto'
                                    ? 'border-brand bg-brand-light/30'
                                    : 'border-slate-200 hover:border-slate-300'
                                }`}
                        >
                            <div className={`p-2 rounded-lg ${settings.scoringMode === 'auto' ? 'bg-brand' : 'bg-slate-100'}`}>
                                <Mic size={24} className={settings.scoringMode === 'auto' ? 'text-white' : 'text-slate-500'} />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-slate-800">Automatisch scoren</h3>
                                <p className="text-sm text-slate-500 mt-1">
                                    Spraakherkenning luistert mee en telt automatisch de correct gelezen woorden.
                                </p>
                                {!settings.deepgramConsent && (
                                    <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
                                        <AlertTriangle size={12} />
                                        Toestemming vereist voor spraakverwerking
                                    </p>
                                )}
                            </div>
                            {settings.scoringMode === 'auto' && (
                                <Check size={24} className="text-brand flex-shrink-0" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Privacy & Data Section */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Shield size={20} className="text-slate-600" />
                        <h2 className="text-lg font-bold text-slate-700">Privacy & Gegevens</h2>
                    </div>

                    {settings.deepgramConsent ? (
                        <div className="space-y-4">
                            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                                <p className="text-sm text-green-800">
                                    <strong>Toestemming gegeven</strong> voor spraakverwerking op{' '}
                                    {new Date(settings.consentTimestamp).toLocaleDateString('nl-NL', {
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </p>
                            </div>
                            <button
                                onClick={handleRevokeConsent}
                                className="w-full py-3 rounded-xl border-2 border-red-200 text-red-600 font-bold hover:bg-red-50 transition-colors"
                            >
                                Toestemming intrekken
                            </button>
                            <p className="text-xs text-slate-400 text-center">
                                Bij intrekken wordt de scoringsmodus automatisch op handmatig gezet.
                            </p>
                        </div>
                    ) : (
                        <div className="bg-slate-50 rounded-xl p-4">
                            <p className="text-sm text-slate-600">
                                U heeft geen toestemming gegeven voor automatische spraakverwerking.
                                De app werkt in handmatige modus.
                            </p>
                        </div>
                    )}
                </div>

                {/* User Info */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h2 className="text-lg font-bold text-slate-700 mb-4">Account</h2>
                    <div className="space-y-2 text-sm text-slate-600">
                        <p><strong>Naam:</strong> {user?.name}</p>
                        <p><strong>Email:</strong> {user?.email}</p>
                        <p><strong>Groep:</strong> {user?.school_group}</p>
                    </div>
                    <button
                        onClick={logout}
                        className="mt-4 w-full py-3 rounded-xl border-2 border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors"
                    >
                        Uitloggen
                    </button>
                </div>
            </div>

            {/* Consent Dialog */}
            {showConsentDialog && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-amber-100 rounded-lg">
                                <AlertTriangle size={24} className="text-amber-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800">Toestemming Spraakverwerking</h3>
                        </div>

                        <div className="space-y-4 text-sm text-slate-600 mb-6">
                            <p>
                                Voor automatische scoring wordt uw stem opgenomen en verwerkt door <strong>Deepgram</strong>,
                                een externe spraakherkenningsdienst.
                            </p>
                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                                <p className="font-bold text-amber-800 mb-2">Wat gebeurt er met uw gegevens?</p>
                                <ul className="list-disc list-inside space-y-1 text-amber-700">
                                    <li>Stemopnames worden naar Deepgram (VS) verzonden</li>
                                    <li>Deepgram verwerkt de audio en retourneert tekst</li>
                                    <li>Audio wordt niet permanent opgeslagen door ons</li>
                                    <li>U kunt toestemming altijd intrekken</li>
                                </ul>
                            </div>
                            <p>
                                Door akkoord te gaan, geeft u toestemming conform de AVG (GDPR) voor deze verwerking.
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowConsentDialog(false)}
                                className="flex-1 py-3 rounded-xl border-2 border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors"
                            >
                                Annuleren
                            </button>
                            <button
                                onClick={handleAcceptConsent}
                                className="flex-1 py-3 rounded-xl bg-brand text-white font-bold hover:bg-brand-dark transition-colors"
                            >
                                Akkoord
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    )
}

export default Settings
