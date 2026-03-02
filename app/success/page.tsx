'use client';

import React, { useEffect, useState } from 'react';
import { Box, Typography, Container, Paper, Button } from '@mui/material';
import ReactConfetti from 'react-confetti';

export default function SuccessPage() {
    const [windowDimension, setWindowDimension] = useState({ width: 0, height: 0 });
    const [recycle, setRecycle] = useState(true);

    useEffect(() => {
        setWindowDimension({ width: window.innerWidth, height: window.innerHeight });
        
        const handleResize = () => {
             setWindowDimension({ width: window.innerWidth, height: window.innerHeight });
        };

        window.addEventListener('resize', handleResize);

        // Stop confetti after 10 seconds
        const timer = setTimeout(() => {
            setRecycle(false);
        }, 10000);

        // Play clap sound
        const audio = new Audio('/sounds/clap.mp3');
        audio.play().catch(e => {
            console.log('Audio play failed:', e);
            // Optional: Show a UI hint that sound was blocked
        });

        return () => {
            window.removeEventListener('resize', handleResize);
            clearTimeout(timer);
        };
    }, []);

    const handleReplay = () => {
        setRecycle(true);
        setTimeout(() => setRecycle(false), 10000);
        const audio = new Audio('/sounds/clap.mp3');
        audio.play().catch(e => console.log('Audio play failed:', e));
    };

    return (
        <Box sx={{ 
            height: '100vh', 
            display: 'flex', 
            flexDirection: 'column',
            bgcolor: '#F8FAFC',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden'
        }}>
            <ReactConfetti 
                width={windowDimension.width} 
                height={windowDimension.height} 
                recycle={recycle}
            />
            
            <Container maxWidth="sm">
                <Paper elevation={0} sx={{ 
                    p: 6, 
                    textAlign: 'center', 
                    borderRadius: '24px',
                    border: '1px solid #E2E8F0',
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(8px)'
                }}>
                    <Typography variant="h1" sx={{ fontSize: '4rem', mb: 2 }}>
                        🎉
                    </Typography>
                    <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#1E293B', fontWeight: 700 }}>
                        Congratulations!
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#64748B', fontSize: '1.1rem', mb: 4 }}>
                        You have successfully submitted your onboarding details. 
                        We are thrilled to welcome you to the team!
                    </Typography>
                    <Button 
                        variant="outlined" 
                        onClick={handleReplay}
                        sx={{ 
                            textTransform: 'none',
                            borderRadius: '10px',
                            color: '#64748B',
                            borderColor: '#CBD5E1',
                            '&:hover': {
                                borderColor: '#94A3B8',
                                bgcolor: '#F1F5F9'
                            }
                        }}
                    >
                        Celebrate Again!
                    </Button>
                </Paper>
            </Container>
        </Box>
    );
}
