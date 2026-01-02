'use client';

import React, { useState } from 'react';
import { Box, Typography, Card, Checkbox, FormControlLabel, TextField, Divider, Stack } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useSelector } from '@/redux/store';

interface FinalReviewStepProps {
    acknowledged: boolean;
    setAcknowledged: (value: boolean) => void;
    signature: string;
    setSignature: (value: string) => void
}

export default function FinalReviewStep({ acknowledged, setAcknowledged, signature, setSignature }: FinalReviewStepProps) {
    const { candidate } = useSelector((state) => state.candidates);
    // Removed local state hooks
    const currentDate = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

    return (
        <Box sx={{ maxWidth: '800px', mx: 'auto' }}>

            {/* Success Banner */}
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

            {/* Status List */}
            <Stack spacing={2} sx={{ mb: 6 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1, borderBottom: '1px solid #E2E8F0' }}>
                    <Typography sx={{ color: '#64748B' }}>Offer Letter</Typography>
                    <Typography sx={{ color: '#059669'}}>Accepted</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1, borderBottom: '1px solid #E2E8F0' }}>
                    <Typography sx={{ color: '#64748B' }}>Personal Information</Typography>
                    <Typography sx={{ color: '#059669'}}>Completed</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1, borderBottom: '1px solid #E2E8F0' }}>
                    <Typography sx={{ color: '#64748B' }}>Guarantor Details</Typography>
                    <Typography sx={{ color: '#059669'}}>Completed</Typography>
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
