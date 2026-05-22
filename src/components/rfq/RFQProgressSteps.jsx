import { CheckCircle2, Circle } from 'lucide-react';

const STEPS = [
  { id: 'contact', label: 'Contact' },
  { id: 'project', label: 'Project' },
  { id: 'files', label: 'Files' },
  { id: 'submit', label: 'Submit' },
];

export default function RFQProgressSteps({ activeStep, stepStatus }) {
  return (
    <nav className="rfq-progress-steps" aria-label="RFQ form progress">
      <ol className="rfq-progress-steps__list">
        {STEPS.map((step, index) => {
          const complete = stepStatus[step.id];
          const active = activeStep === step.id;

          return (
            <li
              key={step.id}
              className={`rfq-progress-steps__item ${active ? 'rfq-progress-steps__item--active' : ''} ${complete ? 'rfq-progress-steps__item--complete' : ''}`}
              aria-current={active ? 'step' : undefined}
            >
              <span className="rfq-progress-steps__indicator" aria-hidden="true">
                {complete ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
              </span>
              <span className="rfq-progress-steps__label">{step.label}</span>
              {index < STEPS.length - 1 ? (
                <span className="rfq-progress-steps__connector hidden sm:block" aria-hidden="true" />
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export { STEPS as RFQ_PROGRESS_STEPS };
