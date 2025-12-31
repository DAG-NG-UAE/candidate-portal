'use client';

import React from 'react';
import { Box, Typography, Button, Card, Divider, Container, Stack } from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import Link from 'next/link';

export default function OfferPage() {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F9FAFB', py: 4 }}>
      <Container maxWidth="md">
        <Box sx={{ mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, color: '#1E293B' }}>
            Offer Letter Review
            </Typography>
            <Typography variant="body1" sx={{ color: '#64748B' }}>
            Please review your offer letter carefully before accepting
            </Typography>
        </Box>

        <Card sx={{ p: 6, mb: 4, borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Box 
              sx={{ 
                width: 64, 
                height: 64, 
                bgcolor: '#E3F2FD', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                mx: 'auto',
                mb: 2,
                color: 'primary.main'
              }}
            >
              <DescriptionIcon fontSize="large" />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main', mb: 1, textTransform: 'uppercase', letterSpacing: 1 }}>
              Offer of Employment
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {currentDate}
            </Typography>
          </Box>

          <Divider sx={{ mb: 4, borderColor: '#F1F5F9' }} />

          <Box sx={{ color: '#334155', mb: 4 }}>
            <Typography paragraph>
              Dear [Candidate Name],
            </Typography>
            <Typography paragraph>
              We are pleased to offer you the position of <strong>Software Engineer</strong> at <strong>TechCorp Inc.</strong>
            </Typography>
            
            <Box sx={{ mt: 4, p: 3, bgcolor: '#F8FAFC', borderRadius: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#1E293B' }}>
                Position Details:
                </Typography>
                <Stack spacing={1.5}>
                    <Typography>• <strong>Job Title:</strong> Software Engineer</Typography>
                    <Typography>• <strong>Department:</strong> Engineering</Typography>
                    <Typography>• <strong>Start Date:</strong> January 15, 2026</Typography>
                </Stack>
            </Box>
          </Box>
        </Card>

        <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
          <Button 
            variant="outlined" 
            fullWidth 
            size="large"
            sx={{ 
                py: 1.5,
                borderColor: '#CBD5E1', 
                color: '#475569',
                borderRadius: '12px',
                '&:hover': {
                    borderColor: '#94A3B8',
                    bgcolor: '#F1F5F9'
                }
            }}
          >
            Decline Offer
          </Button>
          <Button 
            component={Link}
            href="/onboarding"
            variant="contained" 
            fullWidth 
            size="large"
             sx={{ 
              py: 1.5, 
              borderRadius: '12px',
              fontWeight: 600,
              boxShadow: '0 4px 12px rgba(41, 98, 255, 0.2)'
            }}
          >
            Accept & Continue
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
