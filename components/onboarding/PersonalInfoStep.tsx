'use client';

import React from 'react';
import { styled } from '@mui/material/styles';
import { Box, Typography, Card, Stack, TextField, InputLabel } from '@mui/material';

const CustomTextField = styled(TextField)({
    '& .MuiOutlinedInput-root': {
        backgroundColor: '#F8FAFC',
        borderRadius: '8px',
        '& fieldset': {
            borderColor: 'transparent',
        },
        '&:hover fieldset': {
            borderColor: '#E2E8F0',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#2962FF',
            backgroundColor: '#fff',
        },
        '& input': {
            padding: '12px 14px', // Reduced padding for smaller input height
            fontSize: '0.9rem',
        }

    },
});

const CustomLabel = styled(InputLabel)({
    marginBottom: '6px',
    fontWeight: 600,
    color: '#0F172A',
    fontSize: '0.8rem',
    transform: 'none',
    position: 'static',
});

export default function PersonalInfoStep() {
    return (
        <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
            <Card variant="outlined" sx={{ p: { xs: 3, md: 5 }, borderRadius: 4, border: '1px solid #E2E8F0', boxShadow: '0px 4px 6px -1px rgba(0,0,0,0.05)' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: '#0F172A', fontSize: '1.1rem' }}>
                    Personal Information
                </Typography>

                <Stack spacing={2.5}>
                    <Box>
                        <CustomLabel shrink>Full Name</CustomLabel>
                        <CustomTextField 
                            fullWidth 
                            placeholder="Enter your full name" 
                            variant="outlined"
                        />
                    </Box>
                    <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
                        <Box sx={{ flex: 1 }}>
                            <CustomLabel shrink>Email Address</CustomLabel>
                            <CustomTextField 
                                fullWidth 
                                placeholder="your.email@example.com" 
                                variant="outlined"
                                defaultValue="isabella.k@example.com"
                            />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                            <CustomLabel shrink>Phone Number</CustomLabel>
                            <CustomTextField 
                                fullWidth 
                                placeholder="+1 (555) 000-0000" 
                                variant="outlined"
                            />
                        </Box>
                    </Box>
                    <Box>
                        <CustomLabel shrink>Home Address</CustomLabel>
                        <CustomTextField 
                            fullWidth 
                            placeholder="Street address" 
                            variant="outlined" 
                        />
                    </Box>
                    {/* Added more fields to demonstrate scroll requirement if needed, but keeping it clean for now */}
                </Stack>
            </Card>
        </Box>
    );
}
