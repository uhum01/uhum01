import { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface ThemeContextType {
    calmMode: boolean;
    toggleCalmMode: () => void;
    isTransitioning: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
    calmMode: false,
    toggleCalmMode: () => { },
    isTransitioning: false,
});

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [calmMode, setCalmMode] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const toggleCalmMode = useCallback(() => {
        if (isTransitioning) return;
        setIsTransitioning(true);

        // Step 1: Dim & depth shift — 300ms
        document.documentElement.classList.add("theme-transitioning");

        setTimeout(() => {
            // Step 2: Color morph — apply or remove calm class
            setCalmMode(prev => !prev);

            setTimeout(() => {
                // Step 3: Re-emerge
                document.documentElement.classList.remove("theme-transitioning");
                setIsTransitioning(false);
            }, 700);
        }, 300);
    }, [isTransitioning]);

    return (
        <ThemeContext.Provider value={{ calmMode, toggleCalmMode, isTransitioning }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => useContext(ThemeContext);
