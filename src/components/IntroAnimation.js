import React, { useState, useEffect } from 'react';
import './IntroAnimation.css';

/**
 * IntroAnimation - Beautiful onboarding experience
 * Shows the first time someone opens Thread
 */
const IntroAnimation = ({ onComplete }) => {
  const [show, setShow] = useState(true);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    // Check if user has seen intro
    const hasSeenIntro = localStorage.getItem('threadIntroSeen');
    if (hasSeenIntro) {
      setShow(false);
      return;
    }

    // Phase progression
    const phases = [
      { duration: 2000, next: 1 },  // Logo reveal
      { duration: 3000, next: 2 },  // Mission statement
      { duration: 3000, next: 3 },  // Features
      { duration: 2000, next: 4 }   // Fade out
    ];

    const timer = setTimeout(() => {
      if (phase < phases.length - 1) {
        setPhase(phase + 1);
      } else {
        // Mark as seen and complete
        localStorage.setItem('threadIntroSeen', 'true');
        setShow(false);
        if (onComplete) onComplete();
      }
    }, phases[phase]?.duration || 2000);

    return () => clearTimeout(timer);
  }, [phase, onComplete]);

  const handleSkip = () => {
    localStorage.setItem('threadIntroSeen', 'true');
    setShow(false);
    if (onComplete) onComplete();
  };

  if (!show) return null;

  return (
    <div className={`intro-animation phase-${phase}`}>
      <div className="intro-background">
        <div className="intro-particles"></div>
        <div className="intro-gradient-orb orb-1"></div>
        <div className="intro-gradient-orb orb-2"></div>
        <div className="intro-gradient-orb orb-3"></div>
      </div>

      <div className="intro-content">
        {phase === 0 && (
          <div className="intro-phase fade-in">
            <div className="intro-logo">
              <div className="logo-icon">🧵</div>
              <h1 className="logo-text">Thread</h1>
            </div>
            <div className="intro-tagline">
              Multi-Agent AI Orchestration
            </div>
          </div>
        )}

        {phase === 1 && (
          <div className="intro-phase fade-in">
            <h2 className="intro-heading">Thread is meant for the people</h2>
            <p className="intro-description">
              A decentralized network where AI agents collaborate freely,
              without corporate gatekeepers or centralized control.
            </p>
            <div className="intro-icons">
              <div className="intro-icon-item">
                <div className="icon-circle">🌐</div>
                <span>Peer-to-Peer</span>
              </div>
              <div className="intro-icon-item">
                <div className="icon-circle">🔓</div>
                <span>Open Source</span>
              </div>
              <div className="intro-icon-item">
                <div className="icon-circle">🤝</div>
                <span>Collaborative</span>
              </div>
            </div>
          </div>
        )}

        {phase === 2 && (
          <div className="intro-phase fade-in">
            <h2 className="intro-heading">What you can do</h2>
            <div className="intro-features">
              <div className="feature-item">
                <div className="feature-icon">🏗️</div>
                <h3>Build Agent Networks</h3>
                <p>Create sophisticated multi-agent systems with Architects, Brokers, Workers, and Validators</p>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🌐</div>
                <h3>Connect Threads</h3>
                <p>Join a federated network where your Thread can collaborate with others worldwide</p>
              </div>
              <div className="feature-item">
                <div className="feature-icon">⚡</div>
                <h3>Deploy Anywhere</h3>
                <p>Use OpenAI, local models (Ollama, LM Studio), or any AI provider you choose</p>
              </div>
            </div>
          </div>
        )}

        {phase === 3 && (
          <div className="intro-phase fade-in">
            <h2 className="intro-heading">Welcome to the Future</h2>
            <p className="intro-final-message">
              You're about to experience AI collaboration like never before.
            </p>
            <div className="intro-final-icon">✨</div>
          </div>
        )}
      </div>

      <button className="intro-skip" onClick={handleSkip}>
        Skip Intro →
      </button>

      <div className="intro-progress">
        <div className="progress-bar" style={{ width: `${((phase + 1) / 4) * 100}%` }}></div>
      </div>
    </div>
  );
};

export default IntroAnimation;
