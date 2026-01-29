"use client"
import React, { useEffect, useState, Suspense } from 'react';
import { Box, Typography, Button, Card, List, ListItem, ListItemIcon, ListItemText, Container, CircularProgress } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ApartmentIcon from '@mui/icons-material/Apartment';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Confetti from 'react-confetti';
import { useSelector } from '@/redux/store';
import { verifyCandidateToken } from '@/redux/slices/candidate';
import PreOfferDocuments from '@/components/pre-offer/PreOfferDocuments';

function WelcomeContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const { loading, candidate, error } = useSelector((state) => state.candidates);
  const [showConfetti, setShowConfetti] = useState(false);

  const [windowDimension, setWindowDimension] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWindowDimension({ width: window.innerWidth, height: window.innerHeight });
      
      const handleResize = () => {
        setWindowDimension({ width: window.innerWidth, height: window.innerHeight });
      };

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  useEffect(() => {
    if (token) {
      verifyCandidateToken(token);
    }
  }, [token]);

  

  useEffect(() => {
    if (candidate) {
      setShowConfetti(true);

      // Stop the confetti after 5 seconds
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 10000);

      // Cleanup timer if the component unmounts
      return () => clearTimeout(timer);
    }
  }, [candidate]);

  const documents = [
    "Valid ID card (Passport/Driver's License)",
    "Bank account details",
    "Passport-size photograph",
    "Guarantor information"
  ];

  const isButtonEnabled = !!candidate && !loading;

  if (candidate && candidate.purpose !== 'offer') {
    return <PreOfferDocuments candidate={candidate} />;
  }

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'radial-gradient(circle at 10% 20%, rgb(239, 246, 255) 0%, rgb(255, 255, 255) 90%)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Confetti if candidate is verified */}
      {showConfetti && (
        <Confetti 
          width={windowDimension.width} 
          height={windowDimension.height} 
          recycle={true}
          numberOfPieces={200}
          
        />
      )}

      {/* Decorative Background Elements matching the vibe */}
      <Box sx={{ position: 'absolute', top: '10%', left: '5%', width: 10, height: 10, borderRadius: '50%', bgcolor: '#90caf9' }} />
      <Box sx={{ position: 'absolute', top: '20%', right: '15%', width: 8, height: 18, borderRadius: 4, bgcolor: '#ffcc80', transform: 'rotate(45deg)' }} />
      <Box sx={{ position: 'absolute', bottom: '15%', left: '20%', width: 6, height: 20, bgcolor: '#a5d6a7' }} />
      <Box sx={{ position: 'absolute', bottom: '30%', right: '10%', width: 12, height: 12, borderRadius: '50%', bgcolor: '#f48fb1' }} />

      <Container maxWidth="sm">
        <Card sx={{ textAlign: 'center', p: 4, position: 'relative', zIndex: 1, boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}>
          {/* Loading Overlay */}
          {loading && (
             <Box sx={{ 
               position: 'absolute', 
               top: 0, 
               left: 0, 
               right: 0, 
               bottom: 0, 
               bgcolor: 'rgba(255,255,255,0.8)', 
               zIndex: 20, 
               display: 'flex', 
               alignItems: 'center', 
               justifyContent: 'center',
               borderRadius: 'inherit'
             }}>
               <CircularProgress />
             </Box>
           )}

          <Box 
            sx={{ 
              width: 80, 
              height: 80, 
              bgcolor: 'primary.main', 
              borderRadius: '24px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              mx: 'auto',
              mb: 3,
              boxShadow: '0 10px 20px rgba(41, 98, 255, 0.3)'
            }}
          >
            <ApartmentIcon sx={{ fontSize: 40, color: 'white' }} />
          </Box>

          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, color: '#1E293B' }}>
            Congratulations!
          </Typography>
          
          <Typography variant="body1" sx={{ color: '#64748B', mb: 4, px: 2 }}>
            Welcome to the team. Let's get you started with your onboarding journey.
          </Typography>

          <Card 
            variant="outlined" 
            sx={{ 
              bgcolor: '#F8FAFC', 
              border: 'none', 
              mb: 4,
              textAlign: 'left',
              p: 2
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <span style={{ fontSize: '1.2rem' }}>📋</span> Please prepare these documents:
            </Typography>
            <List dense>
              {documents.map((doc, index) => (
                <ListItem key={index} disableGutters sx={{ py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <CheckCircleOutlineIcon color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={doc} 
                    primaryTypographyProps={{ 
                      variant: 'body2',
                      color: 'text.secondary',
                      fontWeight: 500
                    }} 
                  />
                </ListItem>
              ))}
            </List>
          </Card>

          <Button 
            component={isButtonEnabled ? Link : 'button'}
            href={isButtonEnabled ? "/onboarding" : undefined}
            disabled={!isButtonEnabled}
            variant="contained" 
            fullWidth 
            size="large"
            disableElevation
            sx={{ 
              py: 1.5, 
              fontSize: '1rem',
              fontWeight: 600,
              borderRadius: '12px',
              textTransform: 'none'
            }}
          >
            {loading ? "Verifying Token..." : (isButtonEnabled ? "Begin Onboarding" : "Waiting for Verification")}
          </Button>

          {error && (
            <Typography color="error" variant="body2" sx={{ mt: 2 }}>
                {(error as any)?.message || (typeof error === 'string' ? error : 'Verification failed. Please check your link.')}
            </Typography>
          )}

        </Card>
      </Container>
    </Box>
  );
}

export default function WelcomePage() {
  return (
    <Suspense fallback={
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    }>
      <WelcomeContent />
    </Suspense>
  );
}
