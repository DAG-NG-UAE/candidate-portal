'use client';

import React from 'react';
import { Box, Typography, Button, Card, CardContent, List, ListItem, ListItemIcon, ListItemText, Container, Stack } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ApartmentIcon from '@mui/icons-material/Apartment';
import Link from 'next/link';

export default function WelcomePage() {
  const documents = [
    "Valid ID card (Passport/Driver's License)",
    "Bank account details",
    "Passport-size photograph",
    "Guarantor information"
  ];

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
      {/* Decorative Background Elements matching the vibe */}
      <Box sx={{ position: 'absolute', top: '10%', left: '5%', width: 10, height: 10, borderRadius: '50%', bgcolor: '#90caf9' }} />
      <Box sx={{ position: 'absolute', top: '20%', right: '15%', width: 8, height: 18, borderRadius: 4, bgcolor: '#ffcc80', transform: 'rotate(45deg)' }} />
      <Box sx={{ position: 'absolute', bottom: '15%', left: '20%', width: 6, height: 20, bgcolor: '#a5d6a7' }} />
      <Box sx={{ position: 'absolute', bottom: '30%', right: '10%', width: 12, height: 12, borderRadius: '50%', bgcolor: '#f48fb1' }} />

      <Container maxWidth="sm">
        <Card sx={{ textAlign: 'center', p: 4, position: 'relative', zIndex: 1, boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}>
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
            component={Link}
            href="/onboarding"
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
            Begin Onboarding
          </Button>
        </Card>
      </Container>
    </Box>
  );
}
