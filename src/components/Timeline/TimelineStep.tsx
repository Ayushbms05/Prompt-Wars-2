/**
 * TimelineStep.tsx — Individual step card within the election timeline.
 */
import type { ElectionStep } from 'types/index';

/** Props for TimelineStep. */
interface TimelineStepProps {
  /** The step data object */
  readonly step: ElectionStep;
  /** The index of the step */
  readonly index: number;
  /** Whether the step is currently active */
  readonly isActive: boolean;
  /** Whether the step has been completed */
  readonly isCompleted: boolean;
  /** Callback to trigger text-to-speech for the step */
  readonly onListen: (step: ElectionStep) => void;
  /** Callback to trigger the AI assistant for the step */
  readonly onAskAI: (step: ElectionStep) => void;
  /** Whether the step content is being read aloud */
  readonly isListening: boolean;
}

/**
 * Individual step component in the election timeline.
 */
export default function TimelineStep({
  step,
  index,
  isActive,
  isCompleted,
  onListen,
  onAskAI,
  isListening,
}: TimelineStepProps) {
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
