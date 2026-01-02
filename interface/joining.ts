export interface Language {
  language: string;
  read: boolean;
  write: boolean;
  speak: boolean;
}

export interface FamilyMember {
  relation_type: string;
  name: string;
  dob: string | null; // ISO string YYYY-MM-DD
  gender: string;
  profession: string;
}

export interface EmploymentHistory {
  company_name: string;
  doj: string | null;
  dol: string | null;
  last_designation: string;
  reason_for_leaving: string;
}

export interface EducationalHistory {
  qualification: string;
  institute: string;
  specialization: string;
  passing_year: string;
}

export interface TrainingCertification {
  name: string;
  location: string;
  completion_date: string | null;
}

export interface Reference {
  name: string;
  contact_no: string;
}

export interface JoiningFormData {
  // Section 2: Personal Details
  first_name: string; // Should be pre-filled?
  last_name: string; // Should be pre-filled?
  middle_name: string;
  gender: string;
  dob: string | null;
  place_of_birth: string;
  country_of_birth: string;
  nationality: string;
  marital_status: string;
  religion: string;
  blood_group: string;
  languages: Language[];

  // Section 3: Contact & Address
  permanent_address: string;
  current_address: string;
  mobile_nigeria: string;
  personal_email: string;

  // Section 4: Identification & Licenses
  passport_number: string;
  passport_issue_date: string | null;
  passport_expiry_date: string | null;
  passport_place_of_issue: string;
  has_driving_license: string; // "Yes" / "No"
  driving_license_number: string;

  // Section 5: Financials
  bank_name: string;
  account_number: string;
  account_type: string; // "Savings" | "Current"
  pension_fund_account: string;
  gross_salary: string;

  // Section 6: Family & Next of Kin
  relatives_in_company: {
    has_relative: string; // "Yes" / "No"
    name: string;
    relation: string;
    dept: string;
  };
  family_members: FamilyMember[];
  next_of_kin: {
    name: string;
    relationship: string;
    age: number;
    address: string; // Often needed
    phone: string; // Often needed
  };

  // Section 7: Emergency Contacts & References
  emergency_primary: {
    name: string;
    relationship: string;
    address: string;
    phone: string;
  };
  references: Reference[];

  // Section 8: History
  employment_history: EmploymentHistory[];
  educational_history: EducationalHistory[];
  trainings_certifications: TrainingCertification[];
}
