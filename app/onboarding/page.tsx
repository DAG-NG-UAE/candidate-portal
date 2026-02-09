'use client';

import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Container, Stepper, Step, StepLabel, Paper, Slide, Dialog, DialogTitle, DialogContentText, DialogContent, TextField, MenuItem, DialogActions } from '@mui/material';
import OfferStep from '../../components/onboarding/OfferStep';
import PersonalInfoStep from '../../components/onboarding/PersonalInfoStep';
import GuarantorStep from '../../components/onboarding/GuarantorStep';
import DocumentUploadStep from '../../components/onboarding/DocumentUploadStep';
import FinalReviewStep from '../../components/onboarding/FinalReviewStep';
import EmailDialog from '../../components/EmailDialog';

import { useDispatch, useSelector } from '@/redux/store';
import { RootState } from '@reduxjs/toolkit/query';
import { callSubmitDetails, fetchOfferDetails, clearState as clearOfferState, callRejectOffer, callAcceptOffer, callSaveDocuments, callGetJoiningDetails } from '@/redux/slices/offer';
import { clearState as clearCandidateState } from '@/redux/slices/candidate';
import { useRouter } from 'next/navigation';
// import { RequestRevision } from '@/api/offer';


const steps = ['Offer', 'Personal Info', 'Guarantor', 'Documents', 'Final Review'];

export default function OnboardingPage() {
  const [activeStep, setActiveStep] = useState(0); 
  const dispatch = useDispatch();
  const router = useRouter();
  const {candidate} = useSelector((state) => state.candidates)
  const {offerDetails, joiningDetails} = useSelector((state) => state.offers)
  
  // Document Upload State
  const [passportFile, setPassportFile] = useState<File | null>(null);
  const [certificateFiles, setCertificateFiles] = useState<File[]>([]);
  const [proofFiles, setProofFiles] = useState<File[]>([]);

  // Final Review State
  const [acknowledged, setAcknowledged] = useState(false);
  const [signature, setSignature] = useState('');

  const [openRejectModal, setOpenRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectionSafetyWord, setRejectionSafetyWord] = useState('');

  const [openRevisionDialog, setOpenRevisionDialog] = useState(false);

  console.log(candidate)

  useEffect(() => { 
    if(candidate || offerDetails == null){ 
        // we want to get the offer letter for the candidate 
        fetchOfferDetails()
    }
    // Also fetch joining details to show existing documents
    callGetJoiningDetails();
  }, [candidate])

//   console.log(`the offer details are ${JSON.stringify(offerDetails)}`)
  const handleNext = () => {
    //we want to accept the offer
    callAcceptOffer()
    setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handleBack = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSaveDocuments = async () => {
    const formData = new FormData();
        if (candidate?.candidate_id) {
          
            formData.append('candidateId', candidate.candidate_id);
        }
      
      if (passportFile) {
          formData.append('passport', passportFile);
      }
      certificateFiles.forEach((file) => {
          formData.append('certificates', file);
      });
      proofFiles.forEach((file) => {
          formData.append('proof', file);
      });
      // Add other necessary details if required by backend, e.g. candidate ID
       
      if(candidate?.offer_id){ 
        console.log(`the offer id is ${candidate.offer_id}`)
        formData.append('offerId', candidate.offer_id);
      }

      console.log("FormData entries:");
      // FormData cannot be stringified directly; we must iterate to see contents
      // @ts-ignore
      for (const [key, value] of formData.entries()) {
          console.log(`${key}:`, value);
      }

      await callSaveDocuments(formData);
  };

  const handleFinalSubmit = async () => {
    const success = await callSubmitDetails(signature);
    if (success) {
        dispatch(clearOfferState());
        dispatch(clearCandidateState());
        router.push('/dashboard');
    }
  };

  const handleDeclineClick = () => {
    setRejectionSafetyWord('');
    setOpenRejectModal(true);
  };

  const handleRevisionRequest = () => { 
    setOpenRevisionDialog(true);
  }

//   const handleRevisionSubmit = async (data: { message: string, contactEmail: string, contactPhone: string }) => {
//       console.log('Revision Requested:', data);
//       const result = await RequestRevision(data);
//       console.log('Revision Request Result:', result);
//       if(result.success){
//         setOpenRevisionDialog(false);
//         //we want to tell them that the revision request was successful
        
//       }
//       // TODO: Call backend API to submit revision request
//       setOpenRevisionDialog(false);
//   };

  const handleCloseRejectModal = () => {
    setOpenRejectModal(false);
  };

  const handleConfirmReject = async () => {
    if (!rejectionReason) return;
    
    const success = await callRejectOffer(rejectionReason);
    if (success) {
        dispatch(clearOfferState());
        dispatch(clearCandidateState());
        setOpenRejectModal(false);
        // Navigate to a thank you/exit page or back to home
        router.push('/rejected'); 
    }
  };

  const rejectionReasons = [
    'Salary/Compensation not competitive',
    'Accepted another offer',
    'Personal/Family reasons',
    'Role/Responsibility mismatch'
  ];


  const getStepContent = (step: number) => {
      switch (step) {
          case 0:
              return <OfferStep />;
          case 1:
              return <PersonalInfoStep />;
          case 2:
              return <GuarantorStep />;
          case 3:
                      return <DocumentUploadStep 
                        passportFile={passportFile}
                        setPassportFile={setPassportFile}
                        certificateFiles={certificateFiles}
                        setCertificateFiles={setCertificateFiles}
                        proofFiles={proofFiles}
                        setProofFiles={setProofFiles}
                        onSave={handleSaveDocuments}
                        joiningDetails={joiningDetails}
                        candidateId={candidate?.candidate_id}
                        offerId={candidate?.offer_id}
                     />;
          case 4:
              return <FinalReviewStep 
                        acknowledged={acknowledged} 
                        setAcknowledged={setAcknowledged} 
                        signature={signature} 
                        setSignature={setSignature} 
                     />;
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
                Complete all steps to accept the offer
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
                        
                        {/* <Button 
                            variant="outlined"
                            size="large"
                            color="error"
                            onClick={handleRevisionRequest}
                            sx={{ 
                                minWidth: 120,
                                borderRadius: '10px',
                                textTransform: 'none'
                             }}
                         >
                             Request Revision
                         </Button> */}

                         <Button 
                            variant="outlined"
                            size="large"
                            color="error"
                            onClick={handleDeclineClick}
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
                            disabled={offerDetails?.status == 'revision_requested'}
                            sx={{ 
                                minWidth: 160,
                                borderRadius: '10px',
                                textTransform: 'none',
                                boxShadow: 'none'
                            }}
                        >
                            {offerDetails?.status == 'revision_requested' ? 'Continuation Locked (Revision Pending)' : 'Accept & Continue'}
                        </Button>
                    </Box>
                ) : (
                    <Button 
                        variant="contained"
                        size="large"
                        onClick={activeStep === steps.length - 1 ? handleFinalSubmit : handleNext}
                         disabled={
                            (activeStep === steps.length - 1 && (!acknowledged || !signature)) ||
                            (activeStep === 3 && !(
                                (passportFile || joiningDetails?.documents?.passport) && 
                                (certificateFiles.length > 0 || (joiningDetails?.documents?.certificates && joiningDetails.documents.certificates.length > 0)) &&
                                (proofFiles.length > 0 || (joiningDetails?.documents?.proof && joiningDetails.documents.proof.length > 0))
                            )) 
                            || (activeStep === 4 && offerDetails?.status == 'revision_requested')
                        }
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
                        {activeStep === steps.length - 1 ? offerDetails?.status == 'revision_requested' ? 'Submission Locked (Revision Pending)' : 'Finalize and Submit' : 'Continue'}
                    </Button>
                )}
            </Box>
        </Container>
      </Paper>

       <Dialog open={openRejectModal} onClose={handleCloseRejectModal} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ color: '#EF4444', fontWeight: 600 }}>Decline Offer</DialogTitle>
        <DialogContent>
            <DialogContentText sx={{ mb: 3 }}>
                Are you sure you want to decline this offer? 
                This action is irreversible and will end the onboarding process. 
                The offer will be formally rejected.
            </DialogContentText>
            <TextField
                select
                autoFocus
                margin="dense"
                id="reason"
                label="Reason for Declining"
                fullWidth
                variant="outlined"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
            >
                {rejectionReasons.map((option) => (
                    <MenuItem key={option} value={option}>
                        {option}
                    </MenuItem>
                ))}
            </TextField>
            <Box sx={{ mt: 2 }}>
                <DialogContentText sx={{ mb: 1, fontSize: '0.9rem', color: '#64748B' }}>
                    To confirm, please type <strong>DECLINE</strong> below:
                </DialogContentText>
                <TextField
                    placeholder="DECLINE"
                    fullWidth
                    variant="outlined"
                    value={rejectionSafetyWord}
                    onChange={(e) => setRejectionSafetyWord(e.target.value)}
                    size="small"
                />
            </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
            <Button onClick={handleCloseRejectModal} sx={{ color: '#64748B' }}>
                Cancel
            </Button>
            <Button 
                onClick={handleConfirmReject} 
                variant="contained" 
                color="error"
                disabled={!rejectionReason || rejectionSafetyWord.trim() !== 'DECLINE'}
                sx={{ boxShadow: 'none' }}
            >
                Confirm Decline
            </Button>
        </DialogActions>
      </Dialog>

      {/* <EmailDialog 
        open={openRevisionDialog}
        onClose={() => setOpenRevisionDialog(false)}
        candidate={candidate}
        onSubmit={handleRevisionSubmit}
      /> */}

      
    </Box>
  );
}
