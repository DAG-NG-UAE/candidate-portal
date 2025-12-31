'use client';

import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import { Box, Typography, Card, Stack, Collapse, TextField, InputLabel, Button } from '@mui/material';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';

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
            padding: '12px 14px',
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

const OptionCard = styled(Card, {
    shouldForwardProp: (prop) => prop !== 'selected'
})<{ selected?: boolean }>(({ theme, selected }) => ({
    padding: '20px',
    borderRadius: '16px',
    border: selected ? '2px solid #2962FF' : '1px solid #E2E8F0',
    backgroundColor: selected ? '#EFF6FF' : '#fff',
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    boxShadow: 'none',
    '&:hover': {
        borderColor: selected ? '#2962FF' : '#CBD5E1',
    },
}));

export default function GuarantorStep() {
    const [guarantorOption, setGuarantorOption] = useState<'A' | 'B' | null>(null);

    const handleOptionSelect = (option: 'A' | 'B') => {
        setGuarantorOption(prev => prev === option ? null : option);
    };

    return (
        <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
            <Card variant="outlined" sx={{ p: { xs: 3, md: 5 }, borderRadius: 4, border: '1px solid #E2E8F0', boxShadow: '0px 4px 6px -1px rgba(0,0,0,0.05)' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: '#0F172A', fontSize: '1.1rem' }}>
                    Guarantor Information
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748B', mb: 4 }}>
                    Please choose how you would like to proceed with guarantor details
                </Typography>

                <Stack spacing={2}>
                    {/* Option A */}
                    <OptionCard 
                        selected={guarantorOption === 'A'} 
                        onClick={() => handleOptionSelect('A')}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                            <Box 
                                sx={{ 
                                    minWidth: 40, 
                                    height: 40, 
                                    borderRadius: '10px', 
                                    bgcolor: guarantorOption === 'A' ? '#2962FF' : '#F1F5F9',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: guarantorOption === 'A' ? '#fff' : '#64748B',
                                    transition: 'colors 0.2s'
                                }}
                            >
                                <ChatBubbleOutlineIcon fontSize="small"  />
                            </Box>
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0F172A', mb: 0.5, fontSize: '0.95rem' }}>
                                    Option A: Send link to Guarantor
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#64748B', lineHeight: 1.5, fontSize: '0.85rem' }}>
                                    We'll send a secure link via WhatsApp or Email to your guarantor. They can fill in their details directly.
                                </Typography>
                            </Box>
                        </Box>

                        <Collapse in={guarantorOption === 'A'}>
                            <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid #E2E8F0', cursor: 'default' }} onClick={(e) => e.stopPropagation()}>
                                <Stack spacing={2}>
                                    <Box>
                                        <CustomLabel shrink>Guarantor's Email</CustomLabel>
                                        <CustomTextField 
                                            fullWidth 
                                            placeholder="guarantor@example.com" 
                                            variant="outlined"
                                        />
                                    </Box>
                                    <Box>
                                        <CustomLabel shrink>Guarantor's WhatsApp Number (Optional)</CustomLabel>
                                        <CustomTextField 
                                            fullWidth 
                                            placeholder="+1 (555) 000-0000" 
                                            variant="outlined"
                                        />
                                    </Box>
                                    <Button 
                                        variant="contained" 
                                        startIcon={<EmailOutlinedIcon />}
                                        size="small"
                                        sx={{ 
                                            alignSelf: 'flex-start', 
                                            mt: 1,
                                            boxShadow: 'none',
                                            fontWeight: 600,
                                            py: 1,
                                            px: 2,
                                            borderRadius: '8px',
                                            textTransform: 'none'
                                        }}
                                    >
                                        Send Link to Guarantor
                                    </Button>
                                </Stack>
                            </Box>
                        </Collapse>
                    </OptionCard>

                    {/* Option B */}
                    <OptionCard 
                        selected={guarantorOption === 'B'} 
                        onClick={() => handleOptionSelect('B')}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                            <Box 
                                sx={{ 
                                    minWidth: 40, 
                                    height: 40, 
                                    borderRadius: '10px', 
                                    bgcolor: guarantorOption === 'B' ? '#2962FF' : '#F1F5F9',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: guarantorOption === 'B' ? '#fff' : '#64748B',
                                    transition: 'colors 0.2s'
                                }}
                            >
                                <PersonOutlineIcon fontSize="small" />
                            </Box>
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0F172A', mb: 0.5, fontSize: '0.95rem' }}>
                                    Option B: I have the details, I will fill it myself
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#64748B', lineHeight: 1.5, fontSize: '0.85rem' }}>
                                    Fill in your guarantor's information directly if you have all the details available.
                                </Typography>
                            </Box>
                        </Box>

                        <Collapse in={guarantorOption === 'B'}>
                            <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid #E2E8F0', cursor: 'default' }} onClick={(e) => e.stopPropagation()}>
                                <Stack spacing={2}>
                                    <Box>
                                        <CustomLabel shrink>Guarantor's Full Name</CustomLabel>
                                        <CustomTextField 
                                            fullWidth 
                                            placeholder="Enter full name" 
                                            variant="outlined"
                                        />
                                    </Box>
                                    <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
                                        <Box sx={{ flex: 1 }}>
                                            <CustomLabel shrink>Email Address</CustomLabel>
                                            <CustomTextField 
                                                fullWidth 
                                                placeholder="email@example.com" 
                                                variant="outlined"
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
                                    <Box>
                                        <CustomLabel shrink>Relationship to You</CustomLabel>
                                        <CustomTextField 
                                            fullWidth 
                                            placeholder="e.g., Parent, Sibling, Friend" 
                                            variant="outlined" 
                                        />
                                    </Box>
                                    <Box>
                                        <CustomLabel shrink>Employer</CustomLabel>
                                        <CustomTextField 
                                            fullWidth 
                                            placeholder="Current employer" 
                                            variant="outlined" 
                                        />
                                    </Box>
                                </Stack>
                            </Box>
                        </Collapse>
                    </OptionCard>
                </Stack>
            </Card>
        </Box>
    );
}
