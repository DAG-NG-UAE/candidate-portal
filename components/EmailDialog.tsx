import React, { useState, useEffect } from 'react';
import { 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogActions, 
    Button, 
    TextField, 
    Typography, 
    Box,
    IconButton,
    Divider,
    InputAdornment
} from '@mui/material';
import { CandidateDetails } from '../interface/candidate';

interface EmailDialogProps {
    open: boolean;
    onClose: () => void;
    candidate: CandidateDetails | null;
    onSubmit: (data: { message: string, contactEmail: string, contactPhone: string }) => void;
}

const EmailDialog: React.FC<EmailDialogProps> = ({ open, onClose, candidate, onSubmit }) => {
    const [message, setMessage] = useState('');
    const [contactEmail, setContactEmail] = useState('');
    const [contactPhone, setContactPhone] = useState('');

    useEffect(() => {
        if (open && candidate) {
            setContactEmail(candidate.email || '');
            setContactPhone(candidate.phone_number || '');
            setMessage('');
        }
    }, [open, candidate]);

    const handleSubmit = () => {
        onSubmit({
            message,
            contactEmail,
            contactPhone
        });
    };

    return (
        <Dialog 
            open={open} 
            onClose={onClose}
            maxWidth="sm" 
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: '16px',
                    overflow: 'hidden'
                }
            }}
        >
            <Box sx={{ bgcolor: '#F8FAFC', px: 3, py: 2, borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" sx={{ color: '#1E293B', fontWeight: 600 }}>
                    Request Revision
                </Typography>
                <Button onClick={onClose} sx={{ minWidth: 'auto', p: 1, color: '#64748B' }}>
                    ✕
                </Button>
            </Box>
            
            <DialogContent sx={{ p: 3 }}>
                <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', mb: 1.5, alignItems: 'center' }}>
                        <Typography variant="body2" sx={{ color: '#64748B', width: 60, fontWeight: 500 }}>
                            To: 
                        </Typography>
                        <Box sx={{ bgcolor: '#E2E8F0', px: 1.5, py: 0.5, borderRadius: '6px', fontSize: '0.9rem', color: '#475569' }}>
                            HR Department
                        </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                         <Typography variant="body2" sx={{ color: '#64748B', width: 60, fontWeight: 500 }}>
                            From: 
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#1E293B' }}>
                            {candidate?.email}
                        </Typography>
                    </Box>
                </Box>
                
                <Divider sx={{ mb: 3 }} />

                <Typography variant="subtitle2" sx={{ mb: 1, color: '#1E293B', fontWeight: 600 }}>
                    What would you like to revise?
                </Typography>
                <TextField
                    autoFocus
                    multiline
                    minRows={4}
                    fullWidth
                    placeholder="Please minimize the scope of your request to help us process it faster..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    sx={{ 
                        mb: 4,
                        '& .MuiOutlinedInput-root': {
                            bgcolor: '#F8FAFC'
                        }
                    }}
                />

                <Box sx={{ bgcolor: '#F1F5F9', p: 2.5, borderRadius: '12px' }}>
                    <Typography variant="subtitle2" sx={{ mb: 2, color: '#1E293B', fontWeight: 600 }}>
                        How should HR contact you?
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
                        <TextField
                            label="Preferred Email"
                            variant="outlined"
                            size="small"
                            fullWidth
                            value={contactEmail}
                            onChange={(e) => setContactEmail(e.target.value)}
                            sx={{ bgcolor: 'white' }}
                        />
                        <TextField
                            label="Preferred Phone Number"
                            variant="outlined"
                            size="small"
                            fullWidth
                            value={contactPhone}
                            onChange={(e) => setContactPhone(e.target.value)}
                            sx={{ bgcolor: 'white' }}
                        />
                    </Box>
                </Box>

            </DialogContent>

            <DialogActions sx={{ p: 3, pt: 0, justifyContent: 'space-between' }}>
                <Button 
                    onClick={onClose}
                    variant="outlined"
                    sx={{ 
                        borderColor: '#E2E8F0',
                        color: '#64748B',
                        borderRadius: '8px',
                         '&:hover': {
                            borderColor: '#CBD5E1',
                            bgcolor: '#F8FAFC'
                        },
                    }}
                >
                    Discard
                </Button>
                <Button 
                    variant="contained"
                    disabled={!message.trim()}
                    onClick={handleSubmit}
                    sx={{ 
                        borderRadius: '8px',
                        bgcolor: '#2962FF',
                        boxShadow: 'none',
                        px: 4,
                         '&:hover': {
                            bgcolor: '#1E40AF',
                             boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
                        }
                    }}
                >
                    Send Request
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EmailDialog;