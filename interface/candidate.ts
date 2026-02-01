export interface CandidateDetails {
  offer_id: string;
  candidate_id: string;
  requisition_id: string;
  finalized_date: string | null;
  position: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  purpose: string;
}
