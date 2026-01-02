export interface GuarantorFormData {
  guarantor_full_name: string;
  email_address: string;
  place_of_work_address: string;
  income_range: string;
  relationship_with_employee: string;
  relationship_other?: string;
  known_duration: string;
  known_duration_comment?: string; // "Comments"
  assessment_character: string;
  assessment_comment?: string;
  is_honest: string;
  recommend_for_employment: string;
  recommend_comment?: string;
  will_stand_as_guarantor: string;
  general_comment?: string;

  // Bottom section
  phone_number: string;
  house_address: string;

  // Declaration check
  declaration_agreed: boolean;
  digital_signature: string;
  declaration_date: string | null;
}
