import QAStatusBadge from '../mobileQA/QAStatusBadge';

const STATUS_OPTIONS = ['pending', 'approved', 'needs_revision', 'blocked'];
const RISK_OPTIONS = ['low', 'medium', 'high', 'critical'];
const DECISION_OPTIONS = ['pending', 'approved', 'needs_revision', 'blocked'];

export default function ContentRiskBadge({ risk, className = '' }) {
  return <QAStatusBadge status={risk} className={className} />;
}

export { STATUS_OPTIONS, RISK_OPTIONS, DECISION_OPTIONS };
