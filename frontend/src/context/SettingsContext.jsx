import React, { createContext, useState, useEffect, useContext } from 'react';

const SettingsContext = createContext(null);

const SETTINGS_KEY = 'dmt_settings';

const defaultSettings = {
    // 'auto' = Use speech recognition (Deepgram), 'manual' = Parent/teacher enters score
    scoringMode: 'manual', // Default to manual for privacy
    // Has user consented to send voice data to Deepgram?
    deepgramConsent: false,
    // Timestamp of consent (for GDPR records)
    consentTimestamp: null,
};

export const SettingsProvider = ({ children }) => {
    const [settings, setSettings] = useState(() => {
        const saved = localStorage.getItem(SETTINGS_KEY);
        if (saved) {
            try {
                return { ...defaultSettings, ...JSON.parse(saved) };
            } catch (e) {
                return defaultSettings;
            }
        }
        return defaultSettings;
    });

    // Persist settings to localStorage
    useEffect(() => {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    }, [settings]);

    const updateSettings = (updates) => {
        setSettings(prev => ({ ...prev, ...updates }));
    };

    const setScoringMode = (mode) => {
        if (mode === 'auto' && !settings.deepgramConsent) {
            // Can't enable auto mode without consent
            return false;
        }
        updateSettings({ scoringMode: mode });
        return true;
    };

    const giveDeepgramConsent = () => {
        updateSettings({
            deepgramConsent: true,
            consentTimestamp: new Date().toISOString(),
        });
    };

    const revokeDeepgramConsent = () => {
        updateSettings({
            deepgramConsent: false,
            consentTimestamp: null,
            scoringMode: 'manual', // Force manual mode when consent revoked
        });
    };

    const canUseAutoScoring = settings.deepgramConsent && settings.scoringMode === 'auto';

    return (
        <SettingsContext.Provider value={{
            settings,
            updateSettings,
            setScoringMode,
            giveDeepgramConsent,
            revokeDeepgramConsent,
            canUseAutoScoring,
        }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};
