'use client';

import React, { useState, KeyboardEvent } from 'react';
import { useSearchParams } from 'next/navigation';
import { saveCompetencyProfile } from '@/api/offer';
import {
  Box, Typography, TextField, MenuItem, Card, Container,
  Button, Chip, Select, InputLabel, FormControl, OutlinedInput,
  ToggleButtonGroup, ToggleButton, Divider, CircularProgress,
  SelectChangeEvent, IconButton, Autocomplete,
} from '@mui/material';
import ApartmentIcon from '@mui/icons-material/Apartment';
import AddIcon from '@mui/icons-material/Add';

const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa',
  'Benue', 'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo',
  'Ekiti', 'Enugu', 'FCT - Abuja', 'Gombe', 'Imo', 'Jigawa',
  'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara',
  'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun',
  'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara',
];

const BENEFITS_OPTIONS = [
  'Health insurance',
  'Pension',
  'Housing',
  'Transport',
  'Leave allowance',
  'Other',
];

const QUALIFICATIONS = [
  'SSCE',
  'OND',
  'HND',
  'BSc',
  'MSc',
  'MBA',
  'PhD',
  'Professional Certification',
  'Other',
];

interface CompetencyFormData {
  age: string;
  state_of_origin: string;
  location: string;                 // was current_location
  open_to_relocation: string;
  marital_status: string;
  spouse_occupation: string;
  children_details: string;         // was num_children + ages_of_children — merged
  employment_status: string;
  current_place_of_work: string;    // was current_company
  role_current: string;             // was current_designation
  current_gross_salary: string;     // was gross_salary
  current_net_salary: string;       // was net_salary
  // UI arrays — converted to a comma-separated string on submit as benefits_received
  benefits_received: string[];
  custom_benefits: string[];
  expected_salary_min: string;      // merged into salary_target_min on submit
  expected_salary_max: string;
  years_of_experience: string;
  // UI arrays — converted to a comma-separated string on submit as qualification
  qualification: string[];
  other_qualification: string;
}

const initialFormData: CompetencyFormData = {
  age: '',
  state_of_origin: '',
  location: '',
  open_to_relocation: '',
  marital_status: '',
  spouse_occupation: '',
  children_details: '',
  employment_status: '',
  current_place_of_work: '',
  role_current: '',
  current_gross_salary: '',
  current_net_salary: '',
  benefits_received: [],
  custom_benefits: [],
  expected_salary_min: '',
  expected_salary_max: '',
  years_of_experience: '',
  qualification: [],
  other_qualification: '',
};

interface Props {
  candidate: any;
}

const parseTokens = (raw: string): string[] =>
  raw.split(',').map(s => s.trim()).filter(Boolean);

export default function CompetencyProfileForm({ candidate }: Props) {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [formData, setFormData] = useState<CompetencyFormData>(initialFormData);
  const [benefitInput, setBenefitInput] = useState('');
  const [qualInput, setQualInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field: keyof CompetencyFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleMultiSelectChange = (field: keyof CompetencyFormData) =>
    (event: SelectChangeEvent<string[]>) => {
      const value = event.target.value;
      handleChange(field, typeof value === 'string' ? value.split(',') : value);
    };

  // ── Custom benefit helpers ──────────────────────────────────────────────────
  const addCustomBenefits = (raw: string) => {
    const tokens = parseTokens(raw).filter(t => !formData.custom_benefits.includes(t));
    if (!tokens.length) return;
    handleChange('custom_benefits', [...formData.custom_benefits, ...tokens]);
    setBenefitInput('');
  };

  const removeCustomBenefit = (val: string) =>
    handleChange('custom_benefits', formData.custom_benefits.filter(b => b !== val));

  // ── Custom qualification helpers ────────────────────────────────────────────
  const addCustomQualifications = (raw: string) => {
    const existing = formData.other_qualification
      ? formData.other_qualification.split(', ').filter(Boolean)
      : [];
    const tokens = parseTokens(raw).filter(t => !existing.includes(t));
    if (!tokens.length) return;
    handleChange('other_qualification', [...existing, ...tokens].join(', '));
    setQualInput('');
  };

  const removeCustomQual = (val: string) => {
    const updated = formData.other_qualification
      .split(', ')
      .filter(q => q !== val)
      .join(', ');
    handleChange('other_qualification', updated);
  };

  // ── Salary validation ───────────────────────────────────────────────────────
  const salaryMin = Number(formData.expected_salary_min);
  const salaryMax = Number(formData.expected_salary_max);
  const salaryError =
    !!formData.expected_salary_min &&
    !!formData.expected_salary_max &&
    salaryMax < salaryMin;

  // ── Form validity ───────────────────────────────────────────────────────────
  const isFormValid =
    Number(formData.age) > 0 &&
    !!formData.state_of_origin &&
    !!formData.location &&
    !!formData.open_to_relocation &&
    !!formData.marital_status &&
    !!formData.employment_status &&
    formData.qualification.length > 0 &&
    (!formData.qualification.includes('Other') || !!formData.other_qualification.trim()) &&
    !salaryError;

  // ── Submit ──────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        token,
        candidate_id: candidate?.candidate_id,
        age: formData.age,
        state_of_origin: formData.state_of_origin,
        location: formData.location,
        open_to_relocation: formData.open_to_relocation,
        marital_status: formData.marital_status,
        spouse_occupation: formData.spouse_occupation,
        children_details: formData.children_details,
        employment_status: formData.employment_status,
        current_place_of_work: formData.current_place_of_work,
        role_current: formData.role_current,
        current_gross_salary: formData.current_gross_salary,
        current_net_salary: formData.current_net_salary,
        benefits_received: [
          ...formData.benefits_received.filter(b => b !== 'Other'),
          ...formData.custom_benefits,
        ].join(', '),
        salary_target_min:
          formData.expected_salary_min && formData.expected_salary_max
            ? `${formData.expected_salary_min}-${formData.expected_salary_max}`
            : formData.expected_salary_min || formData.expected_salary_max || '',
        years_of_experience: formData.years_of_experience,
        qualification: [
          ...formData.qualification.filter(q => q !== 'Other'),
          ...(formData.other_qualification
            ? formData.other_qualification.split(', ').filter(Boolean)
            : []),
        ].join(', '),
      };

      await saveCompetencyProfile(payload);
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const sectionHeader = (title: string) => (
    <Typography
      variant="subtitle1"
      sx={{ fontWeight: 700, color: '#2962FF', mb: 2, mt: 1, letterSpacing: 0.3 }}
    >
      {title}
    </Typography>
  );

  const half = { xs: '100%', sm: 'calc(50% - 8px)' };
  const third = { xs: '100%', sm: 'calc(33.33% - 11px)' };
  const full = '100%';

  if (submitted) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(circle at 10% 20%, rgb(239, 246, 255) 0%, rgb(255, 255, 255) 90%)' }}>
        <Container maxWidth="sm">
          <Card sx={{ textAlign: 'center', p: 4, boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}>
            <Box sx={{ width: 80, height: 80, bgcolor: 'primary.main', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 3, boxShadow: '0 10px 20px rgba(41,98,255,0.3)' }}>
              <ApartmentIcon sx={{ fontSize: 40, color: 'white' }} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#1E293B', mb: 1 }}>
              Profile Submitted!
            </Typography>
            <Typography variant="body1" sx={{ color: '#64748B' }}>
              Thank you, {candidate?.first_name}. Your competency profile has been received.
            </Typography>
          </Card>
        </Container>
      </Box>
    );
  }

  const benefitHasOther = formData.benefits_received.includes('Other');
  const qualHasOther = formData.qualification.includes('Other');
  const customQuals = formData.other_qualification
    ? formData.other_qualification.split(', ').filter(Boolean)
    : [];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'radial-gradient(circle at 10% 20%, rgb(239, 246, 255) 0%, rgb(255, 255, 255) 90%)',
        py: 6,
      }}
    >
      <Container maxWidth="md">
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
          <Box sx={{ width: 56, height: 56, bgcolor: 'primary.main', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 16px rgba(41,98,255,0.3)', flexShrink: 0 }}>
            <ApartmentIcon sx={{ fontSize: 30, color: 'white' }} />
          </Box>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#1E293B', lineHeight: 1.2 }}>
              Competency Profile
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748B' }}>
              Hi {candidate?.first_name}, please complete the form below.
            </Typography>
          </Box>
        </Box>

        <Card sx={{ p: { xs: 2, sm: 4 }, boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}>

          {/* ── Personal Information ── */}
          {sectionHeader('Personal Information')}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>

            <Box sx={{ width: half }}>
              <TextField
                fullWidth label="Age" type="number" size="small"
                inputProps={{ min: 1, max: 100 }}
                value={formData.age}
                onChange={e => handleChange('age', e.target.value)}
              />
            </Box>

            <Box sx={{ width: half }}>
              <TextField
                select fullWidth label="State of Origin" size="small"
                value={formData.state_of_origin}
                onChange={e => handleChange('state_of_origin', e.target.value)}
              >
                {NIGERIAN_STATES.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </TextField>
            </Box>

            <Box sx={{ width: full }}>
              <Autocomplete
                multiple
                options={NIGERIAN_STATES}
                value={formData.location ? formData.location.split(', ').filter(Boolean) : []}
                onChange={(_, newValue) => handleChange('location', newValue.join(', '))}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip label={option} size="small" {...getTagProps({ index })} key={option} />
                  ))
                }
                renderInput={(params) => (
                  <TextField {...params} label="Current Location" size="small" />
                )}
              />
            </Box>

            <Box sx={{ width: half, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 500 }}>
                Open to Relocation (Within Nigeria)
              </Typography>
              <ToggleButtonGroup
                exclusive size="small"
                value={formData.open_to_relocation}
                onChange={(_, val) => { if (val !== null) handleChange('open_to_relocation', val); }}
                sx={{ height: 40 }}
              >
                <ToggleButton value="Yes" sx={{ px: 3, textTransform: 'none', fontWeight: 600 }}>Yes</ToggleButton>
                <ToggleButton value="No" sx={{ px: 3, textTransform: 'none', fontWeight: 600 }}>No</ToggleButton>
              </ToggleButtonGroup>
            </Box>

            <Box sx={{ width: half }}>
              <TextField
                select fullWidth label="Marital Status" size="small"
                value={formData.marital_status}
                onChange={e => handleChange('marital_status', e.target.value)}
              >
                {['Single', 'Married', 'Divorced', 'Widowed'].map(s => (
                  <MenuItem key={s} value={s}>{s}</MenuItem>
                ))}
              </TextField>
            </Box>

            {formData.marital_status === 'Married' && (
              <Box sx={{ width: full }}>
                <TextField
                  fullWidth label="Spouse Occupation" size="small"
                  value={formData.spouse_occupation}
                  onChange={e => handleChange('spouse_occupation', e.target.value)}
                />
              </Box>
            )}

            <Box sx={{ width: full }}>
              <TextField
                fullWidth label="Children Details (e.g. Boy 5, Girl 3)" size="small"
                placeholder="Leave blank if none"
                value={formData.children_details}
                onChange={e => handleChange('children_details', e.target.value)}
              />
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* ── Professional Information ── */}
          {sectionHeader('Professional Information')}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>

            <Box sx={{ width: half }}>
              <TextField
                select fullWidth label="Employment Status" size="small"
                value={formData.employment_status}
                onChange={e => handleChange('employment_status', e.target.value)}
              >
                {['Employed', 'Unemployed', 'Self-employed'].map(s => (
                  <MenuItem key={s} value={s}>{s}</MenuItem>
                ))}
              </TextField>
            </Box>

            <Box sx={{ width: half }}>
              <TextField
                fullWidth label="Current / Last Company" size="small"
                value={formData.current_place_of_work}
                onChange={e => handleChange('current_place_of_work', e.target.value)}
              />
            </Box>

            <Box sx={{ width: half }}>
              <TextField
                fullWidth label="Current / Last Designation" size="small"
                value={formData.role_current}
                onChange={e => handleChange('role_current', e.target.value)}
              />
            </Box>

            <Box sx={{ width: half }}>
              <TextField
                fullWidth label="Years of Experience" type="number" size="small"
                inputProps={{ min: 0 }}
                value={formData.years_of_experience}
                onChange={e => handleChange('years_of_experience', e.target.value)}
              />
            </Box>

            <Box sx={{ width: half }}>
              <TextField
                fullWidth label="Current Gross Salary (₦)" type="number" size="small"
                inputProps={{ min: 0 }}
                value={formData.current_gross_salary}
                onChange={e => handleChange('current_gross_salary', e.target.value)}
              />
            </Box>

            <Box sx={{ width: half }}>
              <TextField
                fullWidth label="Current Net Salary (₦)" type="number" size="small"
                inputProps={{ min: 0 }}
                value={formData.current_net_salary}
                onChange={e => handleChange('current_net_salary', e.target.value)}
              />
            </Box>

            {/* Benefits Received */}
            <Box sx={{ width: full }}>
              <FormControl fullWidth size="small">
                <InputLabel>Current Benefits</InputLabel>
                <Select
                  multiple
                  value={formData.benefits_received}
                  onChange={handleMultiSelectChange('benefits_received')}
                  input={<OutlinedInput label="Current Benefits" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {(selected as string[])
                        .filter(v => v !== 'Other')
                        .map(v => <Chip key={v} label={v} size="small" />)}
                      {formData.custom_benefits.map(v => (
                        <Chip key={v} label={v} size="small" color="primary" variant="outlined" />
                      ))}
                    </Box>
                  )}
                >
                  {BENEFITS_OPTIONS.map(b => <MenuItem key={b} value={b}>{b}</MenuItem>)}
                </Select>
              </FormControl>

              {benefitHasOther && (
                <Box sx={{ mt: 1.5 }}>
                  {formData.custom_benefits.length > 0 && (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                      {formData.custom_benefits.map(b => (
                        <Chip
                          key={b} label={b} size="small" color="primary" variant="outlined"
                          onDelete={() => removeCustomBenefit(b)}
                        />
                      ))}
                    </Box>
                  )}
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <TextField
                      size="small"
                      placeholder="Type benefit(s), separate multiple with commas"
                      value={benefitInput}
                      onChange={e => setBenefitInput(e.target.value)}
                      onKeyDown={(e: KeyboardEvent) => {
                        if (e.key === 'Enter') { e.preventDefault(); addCustomBenefits(benefitInput); }
                      }}
                      sx={{ flex: 1 }}
                    />
                    <IconButton
                      onClick={() => addCustomBenefits(benefitInput)}
                      color="primary"
                      disabled={!benefitInput.trim()}
                      sx={{ border: '1px solid', borderColor: 'primary.main', borderRadius: '8px', p: '6px' }}
                    >
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              )}
            </Box>

            {/* Expected Salary Range → salary_target_min on submit */}
            <Box sx={{ width: full }}>
              <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 500, display: 'block', mb: 0.5 }}>
                Expected Salary Range (₦)
                {formData.expected_salary_min && formData.expected_salary_max && !salaryError && (
                  <Box component="span" sx={{ ml: 1, color: 'text.primary', fontWeight: 600 }}>
                    → {Number(formData.expected_salary_min).toLocaleString()} – {Number(formData.expected_salary_max).toLocaleString()}
                  </Box>
                )}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                <Box sx={{ width: third }}>
                  <TextField
                    fullWidth label="Min" type="number" size="small"
                    inputProps={{ min: 0 }}
                    value={formData.expected_salary_min}
                    onChange={e => handleChange('expected_salary_min', e.target.value)}
                  />
                </Box>
                <Typography sx={{ pt: 1, color: '#64748B', fontWeight: 700, flexShrink: 0 }}>–</Typography>
                <Box sx={{ width: third }}>
                  <TextField
                    fullWidth label="Max" type="number" size="small"
                    inputProps={{ min: 0 }}
                    value={formData.expected_salary_max}
                    onChange={e => handleChange('expected_salary_max', e.target.value)}
                    error={salaryError}
                    helperText={salaryError ? 'Max cannot be less than min' : ''}
                  />
                </Box>
              </Box>
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* ── Education ── */}
          {sectionHeader('Education')}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ width: full }}>
              <FormControl fullWidth size="small">
                <InputLabel>Qualification(s)</InputLabel>
                <Select
                  multiple
                  value={formData.qualification}
                  onChange={handleMultiSelectChange('qualification')}
                  input={<OutlinedInput label="Qualification(s)" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {(selected as string[])
                        .filter(v => v !== 'Other')
                        .map(v => <Chip key={v} label={v} size="small" />)}
                      {customQuals.map(v => (
                        <Chip key={v} label={v} size="small" color="primary" variant="outlined" />
                      ))}
                    </Box>
                  )}
                >
                  {QUALIFICATIONS.map(q => <MenuItem key={q} value={q}>{q}</MenuItem>)}
                </Select>
              </FormControl>

              {qualHasOther && (
                <Box sx={{ mt: 1.5 }}>
                  {customQuals.length > 0 && (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                      {customQuals.map(q => (
                        <Chip
                          key={q} label={q} size="small" color="primary" variant="outlined"
                          onDelete={() => removeCustomQual(q)}
                        />
                      ))}
                    </Box>
                  )}
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <TextField
                      size="small"
                      placeholder="Type qualification(s), separate multiple with commas"
                      value={qualInput}
                      onChange={e => setQualInput(e.target.value)}
                      onKeyDown={(e: KeyboardEvent) => {
                        if (e.key === 'Enter') { e.preventDefault(); addCustomQualifications(qualInput); }
                      }}
                      sx={{ flex: 1 }}
                    />
                    <IconButton
                      onClick={() => addCustomQualifications(qualInput)}
                      color="primary"
                      disabled={!qualInput.trim()}
                      sx={{ border: '1px solid', borderColor: 'primary.main', borderRadius: '8px', p: '6px' }}
                    >
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              )}
            </Box>
          </Box>

          {/* Submit */}
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              size="large"
              disableElevation
              disabled={!isFormValid || loading}
              onClick={handleSubmit}
              sx={{
                px: 5, py: 1.5, borderRadius: '12px', fontWeight: 600,
                fontSize: '1rem', textTransform: 'none', minWidth: 160,
              }}
            >
              {loading ? <CircularProgress size={22} sx={{ color: 'white' }} /> : 'Submit Profile'}
            </Button>
          </Box>
        </Card>
      </Container>
    </Box>
  );
}
