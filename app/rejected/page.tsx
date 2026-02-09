'use client';

import React from 'react';
import { Box, Typography, Container, Button, Link, IconButton } from '@mui/material';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function RejectedPage() {
    return (
        <Box sx={{ 
            minHeight: '100vh', 
            display: 'flex', 
            flexDirection: 'column',
            bgcolor: '#F5F7FA',
            color: '#1A1A1A',
            fontFamily: '"Outfit", "Inter", sans-serif',
        }}>
            {/* Header */}
            <Box sx={{ 
                p: 3, 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                maxWidth: '1200px',
                width: '100%',
                margin: '0 auto'
            }}>
                {/* <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ 
                        width: 32, 
                        height: 32, 
                        bgcolor: '#2D5BFF', 
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold'
                    }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="white"/>
                            <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: '-0.5px' }}>
                        Whimsical Wanderer
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 4 }}>
                    <Link href="#" underline="none" sx={{ color: '#4A4A4A', fontWeight: 500, fontSize: '0.9rem' }}>Careers</Link>
                    <Link href="#" underline="none" sx={{ color: '#4A4A4A', fontWeight: 500, fontSize: '0.9rem' }}>About</Link>
                </Box> */}
            </Box>

            {/* Main Content */}
            <Container maxWidth="sm" sx={{ 
                flex: 1, 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'center', 
                alignItems: 'center',
                textAlign: 'center',
                pb: 10
            }}>
                {/* Image Container */}
                <Box sx={{ 
                    mb: 6,
                    position: 'relative',
                    width: 280,
                    height: 280,
                    bgcolor: 'white',
                    p: 2,
                    boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
                    transform: 'rotate(-2deg)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1
                }}>
                    <Box 
                        component="img"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDnU_R_qW4uioXNajryIXU5TndARPgtxU2ZFzqAlVeIVSO8n9ER2yN7BQCf6ExmA_jnNrxQ0nRgi0B4QogpGyx-4tau2EQRtOSVw-9osjKBkGsplpLLLq_vTW9v5MVorRBk7ZB7KmYOkPEh4DbG_nXAK-Tb96CGD6O3b9RVZVSIdBYj69R_keHsuS20VsvaxHi0dl65WM9ZEqKIKkfsZ7NdFgdnAWirwsABeaERT4JoVVxyKPEELxEcXIAGXBuY9Dx2TX4nGYHf1bxw"
                        sx={{ 
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                        }}
                    />
                </Box>

                <Typography variant="h2" sx={{ 
                    fontWeight: 800, 
                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                    mb: 2,
                    lineHeight: 1.1,
                    letterSpacing: '-1px'
                }}>
                     We’re going to miss you.
                </Typography>

                <Typography variant="body1" sx={{ 
                    color: '#666', 
                    fontSize: '1.1rem', 
                    maxWidth: '450px',
                    mb: 5,
                    lineHeight: 1.6
                }}>
                    We’re bummed we won’t be working together, but we’re so excited for your next big adventure. Go knock 'em dead!
                </Typography>

                <Button 
                    variant="contained" 
                    startIcon={<LinkedInIcon />}
                    sx={{ 
                        bgcolor: '#2D5BFF',
                        color: 'white',
                        textTransform: 'none',
                        px: 4,
                        py: 1.5,
                        borderRadius: '50px',
                        fontSize: '1rem',
                        fontWeight: 600,
                        mb: 3,
                        '&:hover': {
                            bgcolor: '#1A4DFF',
                        }
                    }}
                >
                    Keep in touch on LinkedIn
                </Button>
            </Container>

           
        </Box>
    );
}
