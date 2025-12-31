export interface MasterClause {
  clause_id: string;
  title: string;
  content: string; // This will be the already interpolated text
  sort_order: number;
}

export interface OfferDetails {
  offer_id: string;
  candidate_id: string;
  requisition_id: string;
  position: string;
  location: string;
  company_name: string;
  commencement_date: string; // ISO string
  
  // Salary & Benefits
  salary_net: number | null;
  leave_days: number;
  probation_period: number;
  
  // Working Hours (For display if needed outside clauses)
  weekday_work_start: string;
  weekday_work_end: string;
  weekday_working_hour_start: string;
  weekday_working_hour_end: string;
  weekend_included: boolean;
  
  // Legal/Notice
  notice_period: number;
  notice_unit: string;

  // The Big Array
  clauses: MasterClause[];
  
  // Status indicators for the UI
  accepted_at: string | null;
  first_viewed_at: string | null;
}