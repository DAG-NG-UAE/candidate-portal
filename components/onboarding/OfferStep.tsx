'use client';
import React, { useRef } from 'react';
import { Box, Typography, Card, Divider, Stack, Button, CircularProgress } from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import DownloadIcon from '@mui/icons-material/Download';
import { useSelector } from '@/redux/store';

export default function OfferStep() {
  const { offerDetails, loading } = useSelector((state) => state.offers);
  const { candidate } = useSelector((state) => state.candidates);
  const pdfRef = useRef<HTMLDivElement>(null);

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handleDownload = async () => {
    if (!pdfRef.current || !offerDetails) return;

    try {
      // @ts-ignore
      const html2pdf = (await import('html2pdf.js')).default;
      
      const opt = {
        margin: [15, 15] as [number, number],
        filename: `Offer_Letter_${candidate?.first_name || 'Candidate'}_${candidate?.last_name || ''}.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, letterRendering: true },
        jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
      };

      html2pdf().set(opt).from(pdfRef.current).save();
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  if (loading || !offerDetails) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

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

      <Card 
        ref={pdfRef}
        sx={{ p: { xs: 3, md: 5 }, borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', position: 'relative' }}
      >
          
        {/* Download Button */}
        <Button
            startIcon={<DownloadIcon />}
            variant="outlined"
            size="small"
            onClick={handleDownload}
            data-html2canvas-ignore="true"
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
          <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main', mb: 0.5, textTransform: 'uppercase', letterSpacing: 1 }}>
            {offerDetails.company_name}
          </Typography>
          {/* <Typography variant="caption" color="text.secondary">
            {offerDetails?.commencement_date ? new Date(offerDetails.commencement_date).toLocaleDateString() : ''}
          </Typography> */}
        </Box>

        <Divider sx={{ mb: 4, borderColor: '#F1F5F9' }} />

          <Box sx={{ color: '#334155', mb: 2 }}>
          <Typography paragraph variant="body2" sx={{ lineHeight: 1.8 }}>
            Dear {candidate?.first_name} {candidate?.last_name},
          </Typography>
          <Typography paragraph variant="body2" sx={{ lineHeight: 1.8 }}>
            We are pleased to offer you the position of <strong>{offerDetails?.position}</strong> at <strong>{offerDetails?.company_name}</strong>.
          </Typography>
          
          {/* <Box sx={{ mt: 3, p: 3, bgcolor: '#F8FAFC', borderRadius: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1.5, color: '#1E293B' }}>
              Position Details:
              </Typography>
              <Stack spacing={1}>
                  <Typography variant="body2">• <strong>Job Title:</strong> {offerDetails?.position}</Typography>
                  <Typography variant="body2">• <strong>Location:</strong> {offerDetails?.location}</Typography>
                  <Typography variant="body2">• <strong>Start Date:</strong> {offerDetails?.commencement_date ? new Date(offerDetails.commencement_date).toLocaleDateString() : ''}</Typography>
              </Stack>
          </Box> */}

          <Box sx={{ mt: 4 }}>
            {(offerDetails?.clauses || []).map((clause) => (
              <Box key={clause.clause_id} sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1, color: '#1E293B' }}>
                  {clause.title}
                </Typography>
                <Typography variant="body2" sx={{ lineHeight: 1.8, whiteSpace: 'pre-line' }}>
                  {clause.content}
                </Typography>
              </Box>
            ))}
          </Box>
          
          <Typography paragraph variant="body2" sx={{ lineHeight: 1.8, mt: 4 }}>
            We look forward to having you join our team. If you have any questions, please do not hesitate to reach out.
          </Typography>
        </Box>
      </Card>
    </Box>
  );
}
