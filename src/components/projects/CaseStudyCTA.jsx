import TrustCTA from '../trust/TrustCTA';

export default function CaseStudyCTA() {
  return (
    <TrustCTA
      headline="Have a similar project?"
      body="Send your drawings, specifications, and project requirements. K&C will review your RFQ and follow up with next steps."
      analyticsLocation="case_study_detail_cta"
      secondaryLabel="View Capabilities"
      secondaryTo="/capabilities"
    />
  );
}
