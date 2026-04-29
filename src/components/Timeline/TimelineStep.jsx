/**
 * TimelineStep.jsx — Individual step card within the election timeline.
 */
import PropTypes from 'prop-types';

/**
 * Individual step component in the election timeline.
 * @param {Object} props - Component props.
 * @param {Object} props.step - The step data object.
 * @param {number} props.index - The index of the step.
 * @param {boolean} props.isActive - Whether the step is currently active.
 * @param {boolean} props.isCompleted - Whether the step has been completed.
 * @param {Function} props.onListen - Callback to toggle text-to-speech for the step.
 * @param {Function} props.onAskAI - Callback to trigger the AI assistant for the step.
 * @param {boolean} props.isListening - Whether the step content is being read aloud.
 * @returns {JSX.Element} The rendered TimelineStep component.
 */
export default function TimelineStep({
  step,
  index,
  isActive,
  isCompleted,
  onListen,
  onAskAI,
  isListening,
}) {
  return (
    <div
      className={`timeline-step ${isActive ? 'timeline-step--active' : ''} ${isCompleted ? 'timeline-step--completed' : ''} ${step.patternClass}`}
      role="tabpanel"
      id={`step-panel-${index}`}
      aria-labelledby={`step-tab-${index}`}
      aria-hidden={!isActive}
    >
      <div className="timeline-step__header">
        <span className="timeline-step__icon" aria-hidden="true">{step.icon}</span>
        <h3 className="timeline-step__title">{step.title}</h3>
      </div>

      <p className="timeline-step__explanation">{step.explanation}</p>

      <div className="timeline-step__checklist">
        <h4 className="timeline-step__checklist-title">Action Items</h4>
        <ul className="timeline-step__checklist-list">
          {step.checklist.map((item, i) => {
            const text = typeof item === 'string' ? item : item.text;
            const link = typeof item === 'string' ? null : item.link;
            
            return (
              <li key={i} className="timeline-step__checklist-item">
                <span className="timeline-step__check" aria-hidden="true">☐</span>
                <span className="timeline-step__text">{text}</span>
                {link && (
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="timeline-step__badge"
                    title="Opens official Government of India website"
                    aria-label={`Visit official source for ${text}`}
                  >
                    ↗ Official Site
                  </a>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      <div className="timeline-step__actions">
        <button
          className="timeline-step__btn timeline-step__btn--listen"
          onClick={() => onListen(step)}
          aria-label={isListening ? `Stop listening to ${step.title}` : `Listen to ${step.title}`}
        >
          <span aria-hidden="true">{isListening ? '⏹️' : '🔊'}</span>
          {isListening ? 'Stop' : 'Listen'}
        </button>
        <button
          className="timeline-step__btn timeline-step__btn--ai"
          onClick={() => onAskAI(step)}
          aria-label={`Ask AI about ${step.title}`}
        >
          <span aria-hidden="true">🤖</span>
          Ask AI about this step
        </button>
      </div>
    </div>
  );
}

TimelineStep.propTypes = {
  /** The step data object */
  step: PropTypes.shape({
    id: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    explanation: PropTypes.string.isRequired,
    checklist: PropTypes.arrayOf(
      PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({
          text: PropTypes.string.isRequired,
          link: PropTypes.string,
        }),
      ])
    ).isRequired,
    aiPrompt: PropTypes.string.isRequired,
    patternClass: PropTypes.string.isRequired,
  }).isRequired,
  /** The index of the step in the timeline */
  index: PropTypes.number.isRequired,
  /** Whether this step is the active one */
  isActive: PropTypes.bool.isRequired,
  /** Whether this step is considered completed */
  isCompleted: PropTypes.bool.isRequired,
  /** Callback to trigger text-to-speech */
  onListen: PropTypes.func.isRequired,
  /** Callback to trigger the AI assistant */
  onAskAI: PropTypes.func.isRequired,
  /** Whether the TTS is currently active for this step */
  isListening: PropTypes.bool.isRequired,
};
