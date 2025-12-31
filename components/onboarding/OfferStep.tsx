'use client';

import React from 'react';
import { Box, Typography, Card, Divider, Stack, Button } from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import DownloadIcon from '@mui/icons-material/Download';

export default function OfferStep() {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 700, color: '#1E293B' }}>
          Offer Letter Review
        </Typography>
        <Typography variant="body2" sx={{ color: '#64748B' }}>
          Please review your offer letter carefully before accepting
        </Typography>
      </Box>

      <Card sx={{ p: { xs: 3, md: 5 }, borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', position: 'relative' }}>
          
        {/* Download Button */}
        <Button
            startIcon={<DownloadIcon />}
            variant="outlined"
            size="small"
            sx={{ 
                position: 'absolute', 
                top: 24, 
                right: 24,
                display: { xs: 'none', sm: 'flex' },
                borderRadius: '8px',
                textTransform: 'none',
                borderColor: '#E2E8F0',
                color: '#64748B',
                '&:hover': {
                    borderColor: '#CBD5E1',
                    bgcolor: '#F8FAFC'
                }
            }}
        >
            Download PDF
        </Button>

        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box 
            sx={{ 
              width: 56, 
              height: 56, 
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
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main', mb: 0.5, textTransform: 'uppercase', letterSpacing: 1 }}>
            Offer of Employment
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {currentDate}
          </Typography>
        </Box>

        <Divider sx={{ mb: 4, borderColor: '#F1F5F9' }} />

        <Box sx={{ color: '#334155', mb: 2 }}>
          <Typography paragraph variant="body2" sx={{ lineHeight: 1.8 }}>
            Dear [Candidate Name],
          </Typography>
          <Typography paragraph variant="body2" sx={{ lineHeight: 1.8 }}>
            We are pleased to offer you the position of <strong>Software Engineer</strong> at <strong>TechCorp Inc.</strong>
          </Typography>
          
          <Box sx={{ mt: 3, p: 3, bgcolor: '#F8FAFC', borderRadius: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, color: '#1E293B' }}>
              Position Details:
              </Typography>
              <Stack spacing={1}>
                  <Typography variant="body2">• <strong>Job Title:</strong> Software Engineer</Typography>
                  <Typography variant="body2">• <strong>Department:</strong> Engineering</Typography>
                  <Typography variant="body2">• <strong>Start Date:</strong> January 15, 2026</Typography>
              </Stack>
          </Box>

          {/* Dummy content to make it scrollable as requested */}
          <Typography paragraph variant="body2" sx={{ lineHeight: 1.8, mt: 3 }}>
            Compensation: You will be paid a starting salary of $120,000 per year, payable in accordance with the Company’s standard payroll schedule.
          </Typography>
          <Typography paragraph variant="body2" sx={{ lineHeight: 1.8 }}>
            Benefits: You will be eligible to participate in the Company’s employee benefit plans and programs, including medical, dental, and vision coverage, 401(k) plan, and paid time off, subject to the terms and conditions of such plans.
          </Typography>
          <Typography paragraph variant="body2" sx={{ lineHeight: 1.8 }}>
            Employment at Will: Your employment with the Company is for no specific period of time. Your employment with the Company will be "at will," meaning that either you or the Company may terminate your employment at any time and for any reason, with or without cause.
          </Typography>
          <Typography paragraph variant="body2" sx={{ lineHeight: 1.8 }}>
            Confidentiality: You agree effectively to keep secret and confidential all non-public information concerning the Company that you acquire during the course of your employment.
          </Typography>
           <Typography paragraph variant="body2" sx={{ lineHeight: 1.8 }}>
            We look forward to having you join our team. If you have any questions, please do not hesitate to reach out.
          </Typography>
        </Box>
      </Card>
    </Box>
  );
}
