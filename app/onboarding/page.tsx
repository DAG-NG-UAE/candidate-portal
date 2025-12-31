'use client';

import React, { useState } from 'react';
import { Box, Typography, Button, Container, Stepper, Step, StepLabel, Paper, Slide } from '@mui/material';
import OfferStep from '../../components/onboarding/OfferStep';
import PersonalInfoStep from '../../components/onboarding/PersonalInfoStep';
import GuarantorStep from '../../components/onboarding/GuarantorStep';

const steps = ['Offer', 'Personal Info', 'Guarantor', 'Final Review'];

export default function OnboardingPage() {
  const [activeStep, setActiveStep] = useState(0); 

  const handleNext = () => {
    setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handleBack = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };

  const getStepContent = (step: number) => {
      switch (step) {
          case 0:
              return <OfferStep />;
          case 1:
              return <PersonalInfoStep />;
          case 2:
              return <GuarantorStep />;
          case 3:
              return (
                  <Box sx={{ textAlign: 'center', py: 8 }}>
                      <Typography variant="h5">Final Review</Typography>
                      <Typography color="text.secondary">Review all your details before submitting.</Typography>
                  </Box>
              );
          default:
              return null;
      }
  };

  return (
    <Box sx={{ 
        height: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
        bgcolor: '#F8FAFC' 
    }}>
      {/* Scrollable Content Area */}
      <Box sx={{ flex: 1, overflowY: 'auto' }}>
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ mb: 4, textAlign: { xs: 'center', md: 'left' } }}>
                <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#1E293B', fontSize: '1.75rem' }}>
                Onboarding Journey
                </Typography>
                <Typography variant="body1" sx={{ color: '#64748B' }}>
                Complete all steps to join the team
                </Typography>
            </Box>

            <Box sx={{ width: '100%', mb: 6 }}>
                <Stepper activeStep={activeStep} alternativeLabel>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel 
                                StepIconProps={{
                                    sx: { 
                                        '&.Mui-completed': { color: '#2962FF' },
                                        '&.Mui-active': { color: '#2962FF' },
                                    }
                                }}
                            >
                                {label}
                            </StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </Box>

            {/* Step Content */}
            <Box sx={{ mb: 10 }}> 
                {getStepContent(activeStep)}
            </Box>
        </Container>
      </Box>

      {/* Sticky Bottom Actions */}
      <Paper 
        elevation={0}
        sx={{ 
            p: 2, 
            borderTop: '1px solid #E2E8F0',
            position: 'sticky',
            bottom: 0,
            zIndex: 10,
            bgcolor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(8px)'
        }}
      >
        <Container maxWidth="lg">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Button 
                    variant="outlined"
                    size="large"
                    onClick={handleBack}
                    disabled={activeStep === 0}
                    sx={{ 
                        minWidth: 120,
                        borderColor: '#E2E8F0',
                        color: '#64748B',
                        borderRadius: '10px',
                        '&:hover': {
                            borderColor: '#CBD5E1',
                            bgcolor: '#F8FAFC'
                        },
                        // Hide back button on first step if desired, or keep disabled
                        visibility: activeStep === 0 ? 'hidden' : 'visible'
                    }}
                >
                    Back
                </Button>

                {activeStep === 0 ? (
                    <Box sx={{ display: 'flex', gap: 2 }}>
                         <Button 
                            variant="outlined"
                            size="large"
                            color="error"
                            sx={{ 
                                minWidth: 120,
                                borderRadius: '10px',
                                textTransform: 'none'
                             }}
                         >
                             Decline
                         </Button>
                         <Button 
                            variant="contained"
                            size="large"
                            onClick={handleNext}
                            sx={{ 
                                minWidth: 160,
                                borderRadius: '10px',
                                textTransform: 'none',
                                boxShadow: 'none'
                            }}
                        >
                            Accept & Continue
                        </Button>
                    </Box>
                ) : (
                    <Button 
                        variant="contained"
                        size="large"
                        onClick={handleNext}
                        sx={{ 
                            minWidth: 160,
                            borderRadius: '10px',
                            fontWeight: 600,
                            boxShadow: 'none',
                            bgcolor: '#2962FF',
                            textTransform: 'none',
                            '&:hover': {
                                bgcolor: '#1E40AF',
                            }
                        }}
                    >
                        {activeStep === steps.length - 1 ? 'Submit' : 'Continue'}
                    </Button>
                )}
            </Box>
        </Container>
      </Paper>
    </Box>
  );
}
