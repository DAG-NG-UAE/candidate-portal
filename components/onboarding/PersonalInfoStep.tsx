'use client';

import React, { useState, useEffect } from 'react';
import { 
    Box, Typography, TextField, MenuItem, 
    Accordion, AccordionSummary, AccordionDetails, 
    Button, Checkbox, FormControlLabel, IconButton, Divider, Stack, CircularProgress 
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { JoiningFormData } from '@/interface/joining';
import { callSaveJoiningDetails, callGetJoiningDetails } from '@/redux/slices/offer';
import { useSelector } from '@/redux/store';

const initialFormData: JoiningFormData = {
    first_name: '', last_name: '', middle_name: '', gender: '', dob: null,
    place_of_birth: '', country_of_birth: '', nationality: '', marital_status: '', religion: '', blood_group: '',
    languages: [],
    permanent_address: '', current_address: '', mobile_nigeria: '', personal_email: '',
    passport_number: '', passport_issue_date: null, passport_expiry_date: null, passport_place_of_issue: '',
    has_driving_license: 'No', driving_license_number: '',
    bank_name: '', account_number: '', account_type: '', pension_fund_account: '', gross_salary: 'Confidential',
    relatives_in_company: { has_relative: 'No', name: '', relation: '', dept: '' },
    family_members: [],
    next_of_kin: { name: '', relationship: '', age: 0, address: '', phone: '' },
    emergency_primary: { name: '', relationship: '', address: '', phone: '' },
    references: [{ name: '', contact_no: '' }, { name: '', contact_no: '' }],
    employment_history: [],
    educational_history: [],
    trainings_certifications: []
};

const sections = [
    { id: 'personal', title: 'Section 2: Personal Details' },
    { id: 'contact', title: 'Section 3: Contact & Address' },
    { id: 'identification', title: 'Section 4: Identification & Licenses' },
    { id: 'financials', title: 'Section 5: Financials' },
    { id: 'family', title: 'Section 6: Family & Next of Kin' },
    { id: 'emergency', title: 'Section 7: Emergency Contacts & References' },
    { id: 'history', title: 'Section 8: History' }
];

export default function JoiningForm() {
    const { joiningDetails } = useSelector((state: any) => state.offers);
    const [formData, setFormData] = useState<JoiningFormData>(initialFormData);
    const [expanded, setExpanded] = useState<string | false>('personal');
    const [completedSections, setCompletedSections] = useState<Set<string>>(new Set());
    const [loadingSection, setLoadingSection] = useState<string | null>(null);

    useEffect(() => {
        callGetJoiningDetails();
    }, []);

    useEffect(() => {
        if (joiningDetails) {
            const formatDate = (dateStr: string | null) => dateStr ? dateStr.split('T')[0] : null;

            setFormData(prev => ({
                ...prev,
                ...joiningDetails,
                // Override simple fields that match
                first_name: joiningDetails.first_name || prev.first_name,
                last_name: joiningDetails.last_name || prev.last_name,
                middle_name: joiningDetails.middle_name || prev.middle_name,
                gender: joiningDetails.gender || prev.gender,
                dob: formatDate(joiningDetails.dob), // Ensure format YYYY-MM-DD
                place_of_birth: joiningDetails.place_of_birth || prev.place_of_birth,
                country_of_birth: joiningDetails.country_of_birth || prev.country_of_birth,
                nationality: joiningDetails.nationality || prev.nationality,
                marital_status: joiningDetails.marital_status || prev.marital_status,
                religion: joiningDetails.religion || prev.religion,
                blood_group: joiningDetails.blood_group || prev.blood_group,
                
                // Contact
                permanent_address: joiningDetails.permanent_address || prev.permanent_address,
                current_address: joiningDetails.current_address || prev.current_address,
                mobile_nigeria: joiningDetails.mobile_nigeria || prev.mobile_nigeria,
                personal_email: joiningDetails.personal_email || prev.personal_email,

                // Identification
                passport_number: joiningDetails.passport_number || prev.passport_number,
                passport_place_of_issue: joiningDetails.passport_place_of_issue || prev.passport_place_of_issue,
                passport_issue_date: formatDate(joiningDetails.passport_issue_date),
                passport_expiry_date: formatDate(joiningDetails.passport_expiry_date),
                has_driving_license: joiningDetails.has_driving_license ? 'Yes' : 'No', // boolean to Yes/No
                driving_license_number: joiningDetails.driving_license_number || prev.driving_license_number,
                
                // Financials
                bank_name: joiningDetails.bank_name || prev.bank_name,
                account_number: joiningDetails.account_number || prev.account_number,
                account_type: joiningDetails.account_type || prev.account_type,
                pension_fund_account: joiningDetails.pension_fund_account || prev.pension_fund_account,
                
                // Arrays and Objects - Ensure we use API data if available, else empty/default
                languages: (joiningDetails.languages && joiningDetails.languages.length > 0) ? joiningDetails.languages : prev.languages,
                family_members: (joiningDetails.family_members && joiningDetails.family_members.length > 0) ? joiningDetails.family_members : prev.family_members,
                employment_history: (joiningDetails.employment_history && joiningDetails.employment_history.length > 0) ? joiningDetails.employment_history : prev.employment_history,
                educational_history: (joiningDetails.educational_history && joiningDetails.educational_history.length > 0) ? joiningDetails.educational_history : prev.educational_history,
                
                // Objects - check if empty
                next_of_kin: (joiningDetails.next_of_kin && Object.keys(joiningDetails.next_of_kin).length > 0) ? {
                    ...joiningDetails.next_of_kin,
                    age: joiningDetails.next_of_kin.age || joiningDetails.next_of_kin.share_percentage || 0
                } : prev.next_of_kin,
                emergency_primary: (joiningDetails.emergency_primary && Object.keys(joiningDetails.emergency_primary).length > 0) ? joiningDetails.emergency_primary : prev.emergency_primary,
                relatives_in_company: (joiningDetails.relatives_in_company && Object.keys(joiningDetails.relatives_in_company).length > 0) ? joiningDetails.relatives_in_company : prev.relatives_in_company,
                references: (joiningDetails.job_references && joiningDetails.job_references.length > 0) ? joiningDetails.job_references : prev.references,
            }));
        }
    }, [joiningDetails]);

    const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpanded(isExpanded ? panel : false);
    };

    const handleFieldChange = (field: keyof JoiningFormData | string, value: any, nestedField?: string) => {
        setFormData(prev => {
            if (nestedField) {
                if (field === 'relatives_in_company' || field === 'next_of_kin' || field === 'emergency_primary') {
                    return { ...prev, [field]: { ...(prev[field as keyof JoiningFormData] as any), [nestedField]: value } };
                }
            }
            return { ...prev, [field]: value };
        });
    };
    
    // Generic handlers for arrays
    const addArrayItem = <T,>(field: keyof JoiningFormData, initialItem: T) => {
        setFormData(prev => ({
            ...prev,
            [field]: [...(prev[field] as any[]), initialItem]
        }));
    };

    const removeArrayItem = (field: keyof JoiningFormData, index: number) => {
        setFormData(prev => ({
            ...prev,
            [field]: (prev[field] as any[]).filter((_, i) => i !== index)
        }));
    };

    const updateArrayItem = (field: keyof JoiningFormData, index: number, subField: string, value: any) => {
        setFormData(prev => {
            const newArray = [...(prev[field] as any[])];
            newArray[index] = { ...newArray[index], [subField]: value };
            return { ...prev, [field]: newArray };
        });
    };

    const markComplete = async (sectionId: string) => {
        setLoadingSection(sectionId);
        try {
        let payload = {};
        switch (sectionId) {
            case 'personal':
                payload = {
                    middle_name: formData.middle_name,
                    gender: formData.gender,
                    dob: formData.dob,
                    place_of_birth: formData.place_of_birth,
                    country_of_birth: formData.country_of_birth,
                    nationality: formData.nationality,
                    marital_status: formData.marital_status,
                    religion: formData.religion,
                    blood_group: formData.blood_group,
                    languages: formData.languages
                };
                break;
            case 'contact':
                payload = {
                    permanent_address: formData.permanent_address,
                    current_address: formData.current_address,
                    mobile_nigeria: formData.mobile_nigeria,
                    personal_email: formData.personal_email
                };
                break;
            case 'identification':
                payload = {
                    passport_number: formData.passport_number,
                    passport_issue_date: formData.passport_issue_date,
                    passport_expiry_date: formData.passport_expiry_date,
                    passport_place_of_issue: formData.passport_place_of_issue,
                    has_driving_license: formData.has_driving_license == 'No' ? false : true,
                    driving_license_number: formData.driving_license_number
                };
                break;
            case 'financials':
                payload = {
                    bank_name: formData.bank_name,
                    account_number: formData.account_number,
                    account_type: formData.account_type,
                    pension_fund_account: formData.pension_fund_account
                };
                break;
            case 'family':
                payload = {
                    relatives_in_company: formData.relatives_in_company,
                    family_members: formData.family_members,
                    next_of_kin: formData.next_of_kin
                };
                break;
            case 'emergency':
                payload = {
                    emergency_primary: formData.emergency_primary,
                    job_references: formData.references
                };
                break;
            case 'history':
                payload = {
                    employment_history: formData.employment_history,
                    educational_history: formData.educational_history,
                    trainings_certifications: formData.trainings_certifications
                };
                break;
        }

        console.log(`Saving ${sectionId} section payload:`, JSON.stringify(payload, null, 2), payload);

        await callSaveJoiningDetails(payload)
        const newCompleted = new Set(completedSections);
        newCompleted.add(sectionId);
        setCompletedSections(newCompleted);
        
        const currIndex = sections.findIndex(s => s.id === sectionId);
        if (currIndex < sections.length - 1) {
            setExpanded(sections[currIndex + 1].id);
        } else {
            setExpanded(false);
        }

        } catch (error) {
            console.error(error);
        } finally {
            setLoadingSection(null);
        }
    };

    // Helper: Half width on small screens and up, full width on extra small
    // Using gap=2 (16px). 50% - 8px.
    const renderTextField = (label: string, value: any, onChange: (val: string) => void, type: string = "text", width = 'half') => (
        <Box sx={{ width: { xs: '100%', sm: width === 'full' ? '100%' : width === 'third' ? 'calc(33.33% - 11px)' : 'calc(50% - 8px)' } }}>
            <TextField
                fullWidth label={label} value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                variant="outlined" size="small" type={type}
                InputLabelProps={{ shrink: true }}
            />
        </Box>
    );

    const renderSelect = (label: string, value: any, onChange: (val: string) => void, options: string[], width = 'half') => (
        <Box sx={{ width: { xs: '100%', sm: width === 'full' ? '100%' : width === 'third' ? 'calc(33.33% - 11px)' : 'calc(50% - 8px)' } }}>
            <TextField
                select fullWidth label={label} value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                variant="outlined" size="small"
            >
                {options.map((opt) => (
                    <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                ))}
            </TextField>
        </Box>
    );

    return (
        <Box sx={{ maxWidth: '900px', mx: 'auto', pb: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, color: '#1E293B' }}>
                Joining Form
            </Typography>

            {/* Section 2: Personal Details */}
            <Accordion expanded={expanded === 'personal'} onChange={handleChange('personal')} variant="outlined" sx={{ borderRadius: 2, mb: 2, borderColor: completedSections.has('personal') ? 'green' : undefined }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between', pr: 2 }}>
                        <Typography sx={{ fontWeight: 600 }}>Section 2: Personal Details</Typography>
                        {completedSections.has('personal') && <CheckCircleIcon color="success" />}
                    </Box>
                </AccordionSummary>
                <AccordionDetails>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                        {renderTextField("Middle Name", formData.middle_name, v => handleFieldChange("middle_name", v))}
                        {renderSelect("Gender", formData.gender, v => handleFieldChange("gender", v), ["Male", "Female", "Other"])}
                        {renderTextField("Date of Birth", formData.dob, v => handleFieldChange("dob", v), "date")}
                        {renderTextField("Place of Birth", formData.place_of_birth, v => handleFieldChange("place_of_birth", v))}
                        {renderSelect("Country of Birth", formData.country_of_birth, v => handleFieldChange("country_of_birth", v), ["Nigeria", "Ghana", "Kenya", "USA", "UK", "Others"])}
                        {renderTextField("Nationality", formData.nationality, v => handleFieldChange("nationality", v))}
                        {renderSelect("Marital Status", formData.marital_status, v => handleFieldChange("marital_status", v), ["Single", "Married", "Divorced", "Widowed"])}
                        {renderTextField("Religion", formData.religion, v => handleFieldChange("religion", v))}
                        {renderSelect("Blood Group", formData.blood_group, v => handleFieldChange("blood_group", v), ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"])}
                        
                        {/* Languages */}
                        <Box sx={{ width: '100%' }}>
                            <Typography variant="subtitle2" sx={{ mb: 1 }}>Languages</Typography>
                            {formData.languages.map((lang, index) => (
                                <Box key={index} sx={{ display: 'flex', gap: 2, mb: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                                    <Box sx={{ flex: 2, minWidth: '150px' }}>
                                        <TextField fullWidth placeholder="Language" size="small" value={lang.language} onChange={(e) => updateArrayItem('languages', index, 'language', e.target.value)} />
                                    </Box>
                                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                        <FormControlLabel control={<Checkbox size="small" checked={lang.read} onChange={(e) => updateArrayItem('languages', index, 'read', e.target.checked)} />} label="Read" />
                                        <FormControlLabel control={<Checkbox size="small" checked={lang.write} onChange={(e) => updateArrayItem('languages', index, 'write', e.target.checked)} />} label="Write" />
                                        <FormControlLabel control={<Checkbox size="small" checked={lang.speak} onChange={(e) => updateArrayItem('languages', index, 'speak', e.target.checked)} />} label="Speak" />
                                    </Box>
                                    <IconButton onClick={() => removeArrayItem('languages', index)} color="error"><DeleteOutlineIcon /></IconButton>
                                </Box>
                            ))}
                            <Button startIcon={<AddCircleOutlineIcon />} onClick={() => addArrayItem('languages', { language: '', read: false, write: false, speak: false })}>Add Language</Button>
                        </Box>
                        
                        <Box sx={{ width: '100%' }}>
                            {loadingSection === 'personal' ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center' }}><CircularProgress size={24} /></Box>
                            ) : (
                                <Button variant="contained" onClick={() => markComplete('personal')}>Save & Next</Button>
                            )}
                        </Box>
                    </Box>
                </AccordionDetails>
            </Accordion>

            {/* Section 3: Contact */}
            <Accordion expanded={expanded === 'contact'} onChange={handleChange('contact')} variant="outlined" sx={{ borderRadius: 2, mb: 2 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                     <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between', pr: 2 }}>
                        <Typography sx={{ fontWeight: 600 }}>Section 3: Contact & Address</Typography>
                        {completedSections.has('contact') && <CheckCircleIcon color="success" />}
                    </Box>
                </AccordionSummary>
                <AccordionDetails>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                        <Box sx={{ width: '100%' }}>
                            <TextField fullWidth multiline rows={2} label="Permanent Address" value={formData.permanent_address} onChange={e => handleFieldChange('permanent_address', e.target.value)} />
                        </Box>
                        <Box sx={{ width: '100%' }}>
                            <TextField fullWidth multiline rows={2} label="Current Address" value={formData.current_address} onChange={e => handleFieldChange('current_address', e.target.value)} />
                        </Box>
                        {renderTextField("Mobile (Nigeria)", formData.mobile_nigeria, v => handleFieldChange("mobile_nigeria", v))}
                        {renderTextField("Personal Email", formData.personal_email, v => handleFieldChange("personal_email", v), "email")}
                         <Box sx={{ width: '100%' }}>
                            {loadingSection === 'contact' ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center' }}><CircularProgress size={24} /></Box>
                            ) : (
                                <Button variant="contained" onClick={() => markComplete('contact')}>Save & Next</Button>
                            )}
                        </Box>
                    </Box>
                </AccordionDetails>
            </Accordion>

            {/* Section 4: Identification */}
            <Accordion expanded={expanded === 'identification'} onChange={handleChange('identification')} variant="outlined" sx={{ borderRadius: 2, mb: 2 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between', pr: 2 }}>
                        <Typography sx={{ fontWeight: 600 }}>Section 4: Identification & Licenses</Typography>
                        {completedSections.has('identification') && <CheckCircleIcon color="success" />}
                    </Box>
                </AccordionSummary>
                <AccordionDetails>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                        {renderTextField("Passport Number", formData.passport_number, v => handleFieldChange("passport_number", v))}
                        {renderTextField("Place of Issue", formData.passport_place_of_issue, v => handleFieldChange("passport_place_of_issue", v))}
                        {renderTextField("Issue Date", formData.passport_issue_date, v => handleFieldChange("passport_issue_date", v), "date")}
                        {renderTextField("Expiry Date", formData.passport_expiry_date, v => handleFieldChange("passport_expiry_date", v), "date")}
                        
                        {renderSelect("Have Nigeria Driving License?", formData.has_driving_license, v => handleFieldChange("has_driving_license", v), ["Yes", "No"])}
                        {formData.has_driving_license === 'Yes' && renderTextField("License Number", formData.driving_license_number, v => handleFieldChange("driving_license_number", v))}
                        
                         <Box sx={{ width: '100%' }}>
                            {loadingSection === 'identification' ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center' }}><CircularProgress size={24} /></Box>
                            ) : (
                                <Button variant="contained" onClick={() => markComplete('identification')}>Save & Next</Button>
                            )}
                        </Box>
                    </Box>
                </AccordionDetails>
            </Accordion>

             {/* Section 5: Financials */}
             <Accordion expanded={expanded === 'financials'} onChange={handleChange('financials')} variant="outlined" sx={{ borderRadius: 2, mb: 2 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between', pr: 2 }}>
                        <Typography sx={{ fontWeight: 600 }}>Section 5: Financials</Typography>
                        {completedSections.has('financials') && <CheckCircleIcon color="success" />}
                    </Box>
                </AccordionSummary>
                <AccordionDetails>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                        {renderTextField("Bank Name", formData.bank_name, v => handleFieldChange("bank_name", v))}
                        {renderTextField("Account Number", formData.account_number, v => handleFieldChange("account_number", v))}
                        {renderSelect("Account Type", formData.account_type, v => handleFieldChange("account_type", v), ["Savings", "Current"])}
                        {renderTextField("Pension Fund Account", formData.pension_fund_account, v => handleFieldChange("pension_fund_account", v))}
                        <Box sx={{ width: { xs: '100%', sm: 'calc(50% - 8px)' } }}>
                            <TextField fullWidth label="Gross Salary" value={formData.gross_salary} disabled />
                        </Box>
                        <Box sx={{ width: '100%' }}>
                            {loadingSection === 'financials' ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center' }}><CircularProgress size={24} /></Box>
                            ) : (
                                <Button variant="contained" onClick={() => markComplete('financials')}>Save & Next</Button>
                            )}
                        </Box>
                    </Box>
                </AccordionDetails>
            </Accordion>

            {/* Section 6: Family */}
            <Accordion expanded={expanded === 'family'} onChange={handleChange('family')} variant="outlined" sx={{ borderRadius: 2, mb: 2 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between', pr: 2 }}>
                        <Typography sx={{ fontWeight: 600 }}>Section 6: Family & Next of Kin</Typography>
                        {completedSections.has('family') && <CheckCircleIcon color="success" />}
                    </Box>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography variant="subtitle2" gutterBottom>Relatives in Company</Typography>
                     <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                        {renderSelect("Any Relatives here?", formData.relatives_in_company.has_relative, v => handleFieldChange("relatives_in_company", v, "has_relative"), ["Yes", "No"], 'full')}
                        {formData.relatives_in_company.has_relative === 'Yes' && (
                            <>
                                {renderTextField("Name", formData.relatives_in_company.name, v => handleFieldChange("relatives_in_company", v, "name"), "text", 'third')}
                                {renderSelect("Relation", formData.relatives_in_company.relation, v => handleFieldChange("relatives_in_company", v, "relation"), ["Father", "Mother", "Brother", "Sister", "Uncle", "Aunty", "Cousin"], 'third')}
                                {renderTextField("Department", formData.relatives_in_company.dept, v => handleFieldChange("relatives_in_company", v, "dept"), "text", 'third')}
                            </>
                        )}
                    </Box>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle2" gutterBottom>Family Members</Typography>
                    {formData.family_members.map((mem, i) => (
                        <Box key={i} sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2, alignItems: 'center' }}>
                            <Box sx={{ width: { xs: '45%', sm: '15%' } }}><TextField fullWidth size="small" label="Relation" value={mem.relation_type} onChange={e => updateArrayItem("family_members", i, "relation_type", e.target.value)} /></Box>
                            <Box sx={{ width: { xs: '45%', sm: '25%' } }}><TextField fullWidth size="small" label="Name" value={mem.name} onChange={e => updateArrayItem("family_members", i, "name", e.target.value)} /></Box>
                            <Box sx={{ width: { xs: '45%', sm: '15%' } }}><TextField fullWidth size="small" type="date" label="DOB" InputLabelProps={{shrink:true}} value={mem.dob} onChange={e => updateArrayItem("family_members", i, "dob", e.target.value)} /></Box>
                             <Box sx={{ width: { xs: '45%', sm: '15%' } }}><TextField fullWidth size="small" label="Gender" value={mem.gender} onChange={e => updateArrayItem("family_members", i, "gender", e.target.value)} /></Box>
                            <Box sx={{ width: { xs: '80%', sm: '15%' } }}><TextField fullWidth size="small" label="Profession" value={mem.profession} onChange={e => updateArrayItem("family_members", i, "profession", e.target.value)} /></Box>
                            <Box sx={{ width: 'auto' }}><IconButton onClick={() => removeArrayItem("family_members", i)}><DeleteOutlineIcon /></IconButton></Box>
                        </Box>
                    ))}
                    <Button startIcon={<AddCircleOutlineIcon />} onClick={() => addArrayItem('family_members', { relation_type: '', name: '', dob: '', gender: '', profession: '' })}>Add Family Member</Button>

                     <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle2" gutterBottom>Next of Kin</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                        {renderTextField("Name", formData.next_of_kin.name, v => handleFieldChange("next_of_kin", v, "name"), "text", 'third')}
                        {renderTextField("Relationship", formData.next_of_kin.relationship, v => handleFieldChange("next_of_kin", v, "relationship"), "text", 'third')}
                        {renderTextField("Age", formData.next_of_kin.age, v => handleFieldChange("next_of_kin", v, "age"), "number", 'third')}
                        {renderTextField("Address", formData.next_of_kin.address, v => handleFieldChange("next_of_kin", v, "address"), "text", 'half')}
                        {renderTextField("Phone", formData.next_of_kin.phone, v => handleFieldChange("next_of_kin", v, "phone"), "text", 'half')}
                    </Box>
                     <Box sx={{ mt: 2 }}>
                        {loadingSection === 'family' ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center' }}><CircularProgress size={24} /></Box>
                        ) : (
                            <Button variant="contained" onClick={() => markComplete('family')}>Save & Next</Button>
                        )}
                    </Box>
                </AccordionDetails>
            </Accordion>
            
            {/* Section 7: Emergency & Refs */}
            <Accordion expanded={expanded === 'emergency'} onChange={handleChange('emergency')} variant="outlined" sx={{ borderRadius: 2, mb: 2 }}>
                 <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between', pr: 2 }}>
                        <Typography sx={{ fontWeight: 600 }}>Section 7: Emergency Contacts & References</Typography>
                        {completedSections.has('emergency') && <CheckCircleIcon color="success" />}
                    </Box>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography variant="subtitle2">Primary Emergency Contact</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                       {renderTextField("Name", formData.emergency_primary.name, v => handleFieldChange("emergency_primary", v, "name"))}
                       {renderTextField("Relationship", formData.emergency_primary.relationship, v => handleFieldChange("emergency_primary", v, "relationship"))}
                       {renderTextField("Address", formData.emergency_primary.address, v => handleFieldChange("emergency_primary", v, "address"))}
                       {renderTextField("Phone", formData.emergency_primary.phone, v => handleFieldChange("emergency_primary", v, "phone"))}
                    </Box>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle2" gutterBottom>References (Name two individuals who can provide professional references)</Typography>
                     {formData.references.map((ref, i) => (
                        <Box key={i} sx={{ mb: 1 }}>
                             <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>Reference {i+1}</Typography>
                             <Box sx={{ display: 'flex', gap: 2 }}>
                                 <Box sx={{ width: '50%' }}><TextField fullWidth size="small" label="Name" value={ref.name} onChange={e => updateArrayItem('references', i, 'name', e.target.value)} /></Box>
                                 <Box sx={{ width: '50%' }}><TextField fullWidth size="small" label="Contact No" value={ref.contact_no} onChange={e => updateArrayItem('references', i, 'contact_no', e.target.value)} /></Box>
                             </Box>
                        </Box>
                    ))}
                    <Box sx={{ mt: 2 }}>
                        {loadingSection === 'emergency' ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center' }}><CircularProgress size={24} /></Box>
                        ) : (
                            <Button variant="contained" onClick={() => markComplete('emergency')}>Save & Next</Button>
                        )}
                    </Box>
                </AccordionDetails>
            </Accordion>

            {/* Section 8: History */}
             <Accordion expanded={expanded === 'history'} onChange={handleChange('history')} variant="outlined" sx={{ borderRadius: 2, mb: 2 }}>
                 <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between', pr: 2 }}>
                        <Typography sx={{ fontWeight: 600 }}>Section 8: History</Typography>
                        {completedSections.has('history') && <CheckCircleIcon color="success" />}
                    </Box>
                </AccordionSummary>
                <AccordionDetails>
                     <Typography variant="subtitle2">Employment History</Typography>
                     {formData.employment_history.map((emp, i) => (
                         <Box key={i} sx={{ mb: 2, p: 2, border: '1px solid #eee', borderRadius: 2 }}>
                             <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                                 <Box sx={{ width: { xs: '100%', sm: 'calc(33.33% - 11px)' } }}><TextField size="small" fullWidth label="Company" value={emp.company_name} onChange={e => updateArrayItem('employment_history', i, 'company_name', e.target.value)}/></Box>
                                 <Box sx={{ width: { xs: '100%', sm: 'calc(33.33% - 11px)' } }}><TextField size="small" fullWidth label="Designation" value={emp.last_designation} onChange={e => updateArrayItem('employment_history', i, 'last_designation', e.target.value)}/></Box>
                                 <Box sx={{ width: { xs: '100%', sm: 'calc(33.33% - 11px)' } }}><TextField size="small" fullWidth label="Reason for Leaving" value={emp.reason_for_leaving} onChange={e => updateArrayItem('employment_history', i, 'reason_for_leaving', e.target.value)}/></Box>
                                 <Box sx={{ width: 'calc(50% - 8px)' }}><TextField size="small" type="date" fullWidth label="Joined" InputLabelProps={{shrink:true}} value={emp.doj} onChange={e => updateArrayItem('employment_history', i, 'doj', e.target.value)}/></Box>
                                 <Box sx={{ width: 'calc(50% - 8px)' }}><TextField size="small" type="date" fullWidth label="Left" InputLabelProps={{shrink:true}} value={emp.dol} onChange={e => updateArrayItem('employment_history', i, 'dol', e.target.value)}/></Box>
                                 <Box sx={{ width: '100%' }}><Button size="small" color="error" onClick={() => removeArrayItem('employment_history', i)}>Remove</Button></Box>
                             </Box>
                         </Box>
                     ))}
                     <Button startIcon={<AddCircleOutlineIcon />} onClick={() => addArrayItem('employment_history', { company_name: '', doj: '', dol: '', last_designation: '', reason_for_leaving: '' })}>Add Employment</Button>
                     
                     <Divider sx={{ my: 2 }} />
                     
                     <Typography variant="subtitle2">Educational History</Typography>
                     {formData.educational_history.map((edu, i) => (
                         <Box key={i} sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
                             <Box sx={{ flex: 1, minWidth: '150px' }}><TextField size="small" fullWidth label="Qualification" value={edu.qualification} onChange={e => updateArrayItem('educational_history', i, 'qualification', e.target.value)}/></Box>
                             <Box sx={{ flex: 1, minWidth: '150px' }}><TextField size="small" fullWidth label="Institute" value={edu.institute} onChange={e => updateArrayItem('educational_history', i, 'institute', e.target.value)}/></Box>
                             <Box sx={{ flex: 1, minWidth: '150px' }}><TextField size="small" fullWidth label="Specialization" value={edu.specialization} onChange={e => updateArrayItem('educational_history', i, 'specialization', e.target.value)}/></Box>
                             <Box sx={{ width: '100px' }}><TextField size="small" fullWidth label="Year" value={edu.passing_year} onChange={e => updateArrayItem('educational_history', i, 'passing_year', e.target.value)}/></Box>
                             <IconButton onClick={() => removeArrayItem('educational_history', i)}><DeleteOutlineIcon /></IconButton>
                         </Box>
                     ))}
                     <Button startIcon={<AddCircleOutlineIcon />} onClick={() => addArrayItem('educational_history', { qualification: '', institute: '', specialization: '', passing_year: '' })}>Add Education</Button>
                     
                     <Box sx={{ mt: 2 }}>
                        {loadingSection === 'history' ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center' }}><CircularProgress size={24} /></Box>
                        ) : (
                            <Button variant="contained" onClick={() => markComplete('history')}>Save & Finish</Button>
                        )}
                    </Box>
                </AccordionDetails>
            </Accordion>
        </Box>
    );
}
