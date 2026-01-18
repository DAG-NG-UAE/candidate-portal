'use client';

import React, { useMemo } from 'react';
import { Box, Typography, Card, Checkbox, FormControlLabel, TextField, Stack, Alert, AlertTitle } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useSelector } from '@/redux/store';

interface FinalReviewStepProps {
    acknowledged: boolean;
    setAcknowledged: (value: boolean) => void;
    signature: string;
    setSignature: (value: string) => void
}

export default function FinalReviewStep({ acknowledged, setAcknowledged, signature, setSignature }: FinalReviewStepProps) {
    const { candidate } = useSelector((state) => state.candidates);
    const { joiningDetails, guarantorDetails } = useSelector((state) => state.offers);

    const currentDate = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    const missingPersonalFields = useMemo(() => {
        const missing: string[] = [];
        if (!joiningDetails) {
            return ['All Personal Information'];
        }

        const requiredFields = [
            { key: 'first_name', label: 'First Name' },
            { key: 'last_name', label: 'Last Name' },
            { key: 'gender', label: 'Gender' },
            { key: 'dob', label: 'Date of Birth' },
            { key: 'place_of_birth', label: 'Place of Birth' },
            { key: 'nationality', label: 'Nationality' },
            { key: 'marital_status', label: 'Marital Status' },
            { key: 'religion', label: 'Religion' },
            { key: 'blood_group', label: 'Blood Group' },
            { key: 'permanent_address', label: 'Permanent Address' },
            { key: 'current_address', label: 'Current Address' },
            { key: 'mobile_nigeria', label: 'Mobile (Nigeria)' },
            { key: 'personal_email', label: 'Personal Email' },
            // Financials
            { key: 'bank_name', label: 'Bank Name' },
            { key: 'account_number', label: 'Account Number' },
            { key: 'account_type', label: 'Account Type' },
            // Identification
            { key: 'passport_number', label: 'Passport Number' },
        ];

        requiredFields.forEach((field) => {
            if (!joiningDetails[field.key]) {
                missing.push(field.label);
            }
        });

        // Check objects if necessary
        if (!joiningDetails.next_of_kin?.name) missing.push('Next of Kin Name');
        if (!joiningDetails.emergency_primary?.name) missing.push('Emergency Contact Name');

        return missing;

    }, [joiningDetails]);

    const missingGuarantorFields = useMemo(() => {
        const missing: string[] = [];
        if (!guarantorDetails) {
            return ['All Guarantor Details'];
        }

        const requiredFields = [
            { key: 'guarantor_full_name', label: 'Full Name' },
            { key: 'email_address', label: 'Email Address' },
            { key: 'phone_number', label: 'Phone Number' },
            { key: 'place_of_work_address', label: 'Work Address' },
            { key: 'house_address', label: 'Home Address' },
            { key: 'income_range', label: 'Income Range' },
            { key: 'relationship_with_employee', label: 'Relationship' },
            { key: 'known_duration', label: 'Known Duration' },
            { key: 'assessment_character', label: 'Character Assessment' },
            { key: 'is_honest', label: 'Honesty Assessment' },
            { key: 'recommend_for_employment', label: 'Recommendation' },
            { key: 'will_stand_as_guarantor', label: 'Will Stand as Guarantor' },
        ];

        requiredFields.forEach((field) => {
             // @ts-ignore
            if (!guarantorDetails[field.key]) {
                missing.push(field.label);
            }
        });

        return missing;
    }, [guarantorDetails]);

    const isAllCompleted = missingPersonalFields.length === 0 && missingGuarantorFields.length === 0;

    return (
        <Box sx={{ maxWidth: '800px', mx: 'auto' }}>

            {/* Status Banner */}
            {isAllCompleted ? (
                <Box sx={{ 
                    bgcolor: '#ecfdf5', 
                    border: '1px solid #a7f3d0', 
                    borderRadius: 2, 
                    p: 2, 
                    mb: 4, 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1.5 
                }}>
                    <CheckCircleOutlineIcon sx={{ color: '#059669' }} />
                    <Typography sx={{ color: '#065f46', fontWeight: 500 }}>
                        All sections completed successfully!
                    </Typography>
                </Box>
            ) : (
                <Alert severity="warning" sx={{ mb: 4, borderRadius: 2 }}>
                    <AlertTitle>Action Required</AlertTitle>
                    Some sections are incomplete. Please review the missing fields below.
                </Alert>
            )}

            {/* Status List */}
            <Stack spacing={2} sx={{ mb: 6 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1, borderBottom: '1px solid #E2E8F0' }}>
                    <Typography sx={{ color: '#64748B' }}>Offer Letter</Typography>
                    <Typography sx={{ color: '#059669'}}>Accepted</Typography>
                </Box>
                
                {/* Personal Information Status */}
                <Box sx={{ py: 1, borderBottom: '1px solid #E2E8F0' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography sx={{ color: '#64748B' }}>Personal Information</Typography>
                        {missingPersonalFields.length === 0 ? (
                            <Typography sx={{ color: '#059669' }}>Completed</Typography>
                        ) : (
                            <Typography sx={{ color: '#DC2626', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <ErrorOutlineIcon fontSize="small" /> Incomplete
                            </Typography>
                        )}
                    </Box>
                    {missingPersonalFields.length > 0 && (
                        <Box sx={{ mt: 1, p: 1.5, bgcolor: '#FEF2F2', borderRadius: 1 }}>
                            <Typography variant="caption" sx={{ color: '#DC2626', fontWeight: 600, display: 'block', mb: 0.5 }}>
                                Missing Fields:
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#991B1B', lineHeight: 1.4 }}>
                                {missingPersonalFields.join(', ')}
                            </Typography>
                        </Box>
                    )}
                </Box>

                {/* Guarantor Details Status */}
                <Box sx={{ py: 1, borderBottom: '1px solid #E2E8F0' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography sx={{ color: '#64748B' }}>Guarantor Details</Typography>
                        {missingGuarantorFields.length === 0 ? (
                            <Typography sx={{ color: '#059669' }}>Completed</Typography>
                        ) : (
                            <Typography sx={{ color: '#DC2626', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <ErrorOutlineIcon fontSize="small" /> Incomplete
                            </Typography>
                        )}
                    </Box>
                    {missingGuarantorFields.length > 0 && (
                        <Box sx={{ mt: 1, p: 1.5, bgcolor: '#FEF2F2', borderRadius: 1 }}>
                            <Typography variant="caption" sx={{ color: '#DC2626', fontWeight: 600, display: 'block', mb: 0.5 }}>
                                Missing Fields:
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#991B1B', lineHeight: 1.4 }}>
                                {missingGuarantorFields.join(', ')}
                            </Typography>
                        </Box>
                    )}
                </Box>
            </Stack>

            {/* Declaration Section */}
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#1E293B' }}>
                Declaration of Truth
            </Typography>
            
            <Card variant="outlined" sx={{ p: 3, bgcolor: '#F8FAFC', borderRadius: 3, mb: 3, border: '1px solid #E2E8F0' }}>
                <Typography sx={{ color: '#475569', lineHeight: 1.6 }}>
                    I declare that the information furnished above is true to the best of my knowledge. I have not concealed any material information, which might impair my fitness or credibility for employment. In case any information is found to be incorrect, the Management will have the right to terminate my services without notice.
                </Typography>
            </Card>

            <FormControlLabel 
                control={
                    <Checkbox 
                        checked={acknowledged} 
                        onChange={(e) => setAcknowledged(e.target.checked)}
                        sx={{ color: '#CBD5E1', '&.Mui-checked': { color: '#2962FF' } }}
                    />
                }
                label={
                    <Typography sx={{ fontWeight: 500, color: acknowledged ? '#1E293B' : '#64748B' }}>
                        I have read and agree to the terms above. <span style={{ color: '#DC2626' }}>*</span>
                    </Typography>
                }
                sx={{ mb: 4 }}
            />

            {/* Signature Fields */}
            <Box sx={{ mb: 2 }}>
                <Typography sx={{ fontWeight: 600, color: '#1E293B', mb: 0.5 }}>
                    Signature <span style={{ color: '#DC2626' }}>*</span>
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mb: 1 }}>
                    Type your full name exactly as it appears in the system
                </Typography>
                <TextField 
                    fullWidth 
                    value={signature}
                    onChange={(e) => setSignature(e.target.value)}
                    variant="outlined"
                    sx={{ 
                        '& .MuiOutlinedInput-root': {
                            bgcolor: '#F8FAFC',
                            '& fieldset': { borderColor: '#E2E8F0' },
                            '&:hover fieldset': { borderColor: '#CBD5E1' },
                            '&.Mui-focused fieldset': { borderColor: '#2962FF' }
                        }
                    }}
                />
            </Box>

            <Box>
                <Typography sx={{ fontWeight: 600, color: '#1E293B', mb: 0.5 }}>Date</Typography>
                <TextField 
                    fullWidth 
                    value={currentDate}
                    disabled
                    variant="outlined"
                    sx={{ 
                        '& .MuiOutlinedInput-root': {
                            bgcolor: '#F1F5F9',
                            '& fieldset': { border: 'none' }
                        }
                    }}
                />
            </Box>
        </Box>
    );
}
