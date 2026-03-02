import { useRef } from "react";
import { useTheme } from "@/context/ThemeContext";

export default function CalmModeToggle() {
    const { calmMode, toggleCalmMode, isTransitioning } = useTheme();
    const btnRef = useRef<HTMLButtonElement>(null);

    const handleClick = () => {
        if (isTransitioning) return;

        // Depress animation
        const btn = btnRef.current;
        if (btn) {
            btn.style.transform = "translateY(0px) scale(0.93)";
            setTimeout(() => {
                btn.style.transform = "";
                toggleCalmMode();
            }, 120);
        } else {
            toggleCalmMode();
        }
    };

    return (
        <>
            <button
                ref={btnRef}
                onClick={handleClick}
                aria-label={calmMode ? "Switch to Light Mode" : "Activate Deep Calm Mode"}
                aria-pressed={calmMode}
                className="calm-toggle-btn"
                data-calm={calmMode}
                data-transitioning={isTransitioning}
            >
                {/* Pill track */}
                <span className="calm-track">
                    {/* Stars / sun icons inside track */}
                    <span className="calm-track-icons">
                        <span className="calm-icon-moon">🌙</span>
                        <span className="calm-icon-sun">☀️</span>
                    </span>
                    {/* Sliding thumb */}
                    <span className="calm-thumb">
                        <span className="calm-thumb-inner">
                            {calmMode ? "🌙" : "☀️"}
                        </span>
                    </span>
                </span>

                {/* Label */}
                <span className="calm-label">
                    {calmMode ? "Calm Mode" : "Calm Mode"}
                </span>

                {/* Glow ring */}
                <span className="calm-glow-ring" aria-hidden />
            </button>

            <style>{`
        /* ── Toggle Button ── */
        .calm-toggle-btn {
          position: relative;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 5px 10px 5px 5px;
          border-radius: 100px;
          border: 1.5px solid var(--calm-border);
          background: var(--calm-btn-bg);
          cursor: pointer;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          box-shadow:
            var(--calm-btn-shadow),
            inset 0 1px 0 rgba(255,255,255,0.15),
            inset 0 -1px 0 rgba(0,0,0,0.06);
          transition:
            transform 0.25s cubic-bezier(0.22,1,0.36,1),
            box-shadow 0.35s ease,
            border-color 0.5s ease,
            background 0.5s ease;
          will-change: transform;
          --calm-btn-bg:     rgba(255,255,255,0.82);
          --calm-border:     rgba(74,175,218,0.22);
          --calm-btn-shadow: 0 4px 18px rgba(74,175,218,0.14);
          --calm-label-c:    #4a6880;
          --calm-thumb-c:    linear-gradient(135deg,#4AAFDA,#7EC8E3);
          --calm-glow-c:     rgba(74,175,218,0.3);
        }

        /* Dark-mode internal overrides */
        .calm-toggle-btn[data-calm="true"] {
          --calm-btn-bg:     rgba(31,42,56,0.88);
          --calm-border:     rgba(79,163,165,0.45);
          --calm-btn-shadow: 0 4px 24px rgba(79,163,165,0.3);
          --calm-label-c:    #a8c8ca;
          --calm-thumb-c:    linear-gradient(135deg,#4FA3A5,#2d8a8c);
          --calm-glow-c:     rgba(79,163,165,0.45);
        }

        .calm-toggle-btn:hover:not([data-transitioning="true"]) {
          transform: translateY(-2px);
          box-shadow:
            0 8px 30px var(--calm-glow-c),
            inset 0 1px 0 rgba(255,255,255,0.15),
            inset 0 -1px 0 rgba(0,0,0,0.06);
        }

        /* ── Pill track ── */
        .calm-track {
          position: relative;
          width: 42px;
          height: 24px;
          border-radius: 100px;
          background: rgba(0,0,0,0.08);
          display: flex;
          align-items: center;
          overflow: hidden;
          flex-shrink: 0;
          transition: background 0.5s ease;
        }
        .calm-toggle-btn[data-calm="true"] .calm-track {
          background: rgba(79,163,165,0.22);
        }

        /* icons inside track */
        .calm-track-icons {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 4px;
          pointer-events: none;
          font-size: 9px;
          opacity: 0.6;
        }
        .calm-icon-moon { order: 2; }
        .calm-icon-sun  { order: 1; }

        /* ── Thumb ── */
        .calm-thumb {
          position: absolute;
          left: 3px;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: var(--calm-thumb-c);
          box-shadow: 0 2px 8px rgba(0,0,0,0.18);
          display: flex;
          align-items: center;
          justify-content: center;
          transition:
            left 0.45s cubic-bezier(0.22,1,0.36,1),
            background 0.5s ease,
            box-shadow 0.3s ease;
          will-change: left;
        }
        .calm-toggle-btn[data-calm="true"] .calm-thumb {
          left: 21px;
          box-shadow: 0 2px 12px rgba(79,163,165,0.45);
        }
        .calm-thumb-inner {
          font-size: 10px;
          line-height: 1;
          user-select: none;
          transition: transform 0.35s ease;
        }
        .calm-toggle-btn:active .calm-thumb-inner {
          transform: rotate(20deg);
        }

        /* ── Label ── */
        .calm-label {
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          color: var(--calm-label-c);
          white-space: nowrap;
          transition: color 0.5s ease;
          user-select: none;
          font-family: 'Nunito', sans-serif;
          text-transform: uppercase;
        }

        /* ── Glow ring (pulse) ── */
        .calm-glow-ring {
          position: absolute;
          inset: -4px;
          border-radius: 100px;
          pointer-events: none;
          opacity: 0;
          border: 1.5px solid var(--calm-glow-c);
          transition: opacity 0.4s ease, border-color 0.5s ease;
          animation: calmGlowPulse 3s ease-in-out infinite;
        }
        .calm-toggle-btn[data-calm="true"] .calm-glow-ring {
          opacity: 1;
        }
        @keyframes calmGlowPulse {
          0%, 100% { transform: scale(1);    opacity: 0.7; }
          50%       { transform: scale(1.06); opacity: 0.3; }
        }
      `}</style>
        </>
    );
}
