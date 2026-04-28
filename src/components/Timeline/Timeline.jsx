/**
 * Timeline.jsx — Horizontal stepper with 6 election stages.
 * Supports keyboard navigation (Arrow keys, Enter).
 */
import { useState, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import TimelineStep from './TimelineStep';
import { TIMELINE_STEPS } from '../../utils/mockData';
import useTTS from '../../hooks/useTTS';

export default function Timeline({ onAskAI }) {
  const [activeStep, setActiveStep] = useState(0);
  const [listeningStep, setListeningStep] = useState(null);
  const tabsRef = useRef([]);
  const { speak, isSpeaking, stop } = useTTS();

  const handleKeyDown = useCallback((e) => {
    const { key } = e;
    let newIndex = activeStep;

    if (key === 'ArrowRight' || key === 'ArrowDown') {
      e.preventDefault();
      newIndex = Math.min(activeStep + 1, TIMELINE_STEPS.length - 1);
    } else if (key === 'ArrowLeft' || key === 'ArrowUp') {
      e.preventDefault();
      newIndex = Math.max(activeStep - 1, 0);
    } else if (key === 'Home') {
      e.preventDefault();
      newIndex = 0;
    } else if (key === 'End') {
      e.preventDefault();
      newIndex = TIMELINE_STEPS.length - 1;
    }

    if (newIndex !== activeStep) {
      setActiveStep(newIndex);
      tabsRef.current[newIndex]?.focus();
    }
  }, [activeStep]);

  const handleListen = useCallback((step) => {
    if (isSpeaking && listeningStep === step.id) {
      stop();
      setListeningStep(null);
    } else {
      setListeningStep(step.id);
      speak(`${step.title}. ${step.explanation}`, 'en');
    }
  }, [isSpeaking, listeningStep, speak, stop]);

  const handleAskAI = useCallback((step) => {
    if (onAskAI) {
      onAskAI(step.aiPrompt);
    }
  }, [onAskAI]);

  return (
    <section className="timeline" id="timeline" aria-label="Election process timeline">
      <div className="timeline__header">
        <h2 className="timeline__heading">Your Election Journey</h2>
        <p className="timeline__subtitle">
          Follow these six steps from eligibility to understanding results
        </p>
      </div>

      {/* Tab List — Horizontal Stepper */}
      <div
        className="timeline__tabs"
        role="tablist"
        aria-label="Election timeline steps"
        onKeyDown={handleKeyDown}
      >
        {TIMELINE_STEPS.map((step, index) => (
          <button
            key={step.id}
            ref={(el) => (tabsRef.current[index] = el)}
            className={`timeline__tab ${index === activeStep ? 'timeline__tab--active' : ''} ${index < activeStep ? 'timeline__tab--completed' : ''}`}
            role="tab"
            id={`step-tab-${index}`}
            aria-selected={index === activeStep}
            aria-controls={`step-panel-${index}`}
            tabIndex={index === activeStep ? 0 : -1}
            onClick={() => setActiveStep(index)}
          >
            <span className="timeline__tab-icon" aria-hidden="true">{step.icon}</span>
            <span className="timeline__tab-label">{step.title}</span>
            <span className="timeline__tab-number" aria-hidden="true">{index + 1}</span>
          </button>
        ))}
      </div>

      {/* Step Connector Line */}
      <div className="timeline__progress" aria-hidden="true">
        <div
          className="timeline__progress-fill"
          style={{ width: `${(activeStep / (TIMELINE_STEPS.length - 1)) * 100}%` }}
        />
      </div>

      {/* Active Step Panel */}
      <div className="timeline__panel">
        <TimelineStep
          step={TIMELINE_STEPS[activeStep]}
          index={activeStep}
          isActive={true}
          isCompleted={false}
          onSelect={setActiveStep}
          onListen={handleListen}
          onAskAI={handleAskAI}
          isListening={isSpeaking && listeningStep === TIMELINE_STEPS[activeStep].id}
        />
      </div>

      {/* Step Navigation Buttons (Mobile-friendly) */}
      <div className="timeline__nav">
        <button
          className="timeline__nav-btn"
          onClick={() => setActiveStep((p) => Math.max(0, p - 1))}
          disabled={activeStep === 0}
          aria-label="Previous step"
        >
          ← Previous
        </button>
        <span className="timeline__nav-counter" aria-live="polite">
          Step {activeStep + 1} of {TIMELINE_STEPS.length}
        </span>
        <button
          className="timeline__nav-btn"
          onClick={() => setActiveStep((p) => Math.min(TIMELINE_STEPS.length - 1, p + 1))}
          disabled={activeStep === TIMELINE_STEPS.length - 1}
          aria-label="Next step"
        >
          Next →
        </button>
      </div>
    </section>
  );
}

Timeline.propTypes = {
  onAskAI: PropTypes.func,
};
