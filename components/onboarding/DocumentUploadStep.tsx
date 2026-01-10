'use client';

import React, { useEffect } from 'react';
import { 
    Box, Typography, Card, Button, IconButton, 
    List, ListItem, ListItemIcon, ListItemText, ListItemSecondaryAction,
    Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});



const PassportPreview = styled(Box)({
    width: '150px',
    height: '180px', 
    border: '2px solid #E2E8F0',
    borderRadius: '8px',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    position: 'relative',
    transition: 'all 0.2s',
    '& img': {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    }
});

interface DocumentUploadStepProps {
    passportFile: File | null;
    setPassportFile: (file: File | null) => void;
    certificateFiles: File[];
    setCertificateFiles: React.Dispatch<React.SetStateAction<File[]>>;
    onSave: () => void;
}

export default function DocumentUploadStep({
    passportFile,
    setPassportFile,
    certificateFiles,
    setCertificateFiles,
    onSave
}: DocumentUploadStepProps) {
    const [passportPreview, setPassportPreview] = React.useState<string | null>(null);

    useEffect(() => {
        if (passportFile) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPassportPreview(reader.result as string);
            };
            reader.readAsDataURL(passportFile);
        } else {
            setPassportPreview(null);
        }
    }, [passportFile]);

    const handlePassportChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setPassportFile(file);
        }
    };

    const handleCertificatesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const newFiles = Array.from(event.target.files);
            // Append new files to existing ones
            setCertificateFiles((prev) => [...prev, ...newFiles]);
        }
    };

    const removeCertificate = (index: number) => {
        setCertificateFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const removePassport = () => {
        setPassportFile(null);
    };

    const hasUploads = passportFile !== null || certificateFiles.length > 0;

    return (
        <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 700, color: '#1E293B' }}>
                        Document Upload
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#64748B' }}>
                        Please upload your passport photograph and relevant certificates.
                    </Typography>
                </Box>
                 <Button 
                    variant="contained" 
                    onClick={onSave}
                    disabled={!hasUploads}
                    sx={{ borderRadius: '8px' }}
                >
                    Save Documents
                </Button>
            </Box>

            <Card variant="outlined" sx={{ p: { xs: 3, md: 5 }, borderRadius: 4, mb: 3 }}>
                {/* Passport Section */}
                <Box sx={{ mb: 6 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1, color: '#1E293B' }}>
                        1. Passport Photograph <Typography component="span" color="error">*</Typography>
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Upload a recent passport-sized photograph with a white background.
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 4, alignItems: 'center' }}>
                        <PassportPreview sx={{ 
                            borderColor: passportPreview ? 'primary.main' : '#E2E8F0',
                            boxShadow: passportPreview ? '0 4px 12px rgba(41, 98, 255, 0.15)' : 'none'
                        }}>
                            {passportPreview ? (
                                <img src={passportPreview} alt="Passport Preview" />
                            ) : (
                                <Box sx={{ textAlign: 'center', p: 1 }}>
                                    <PhotoCameraIcon sx={{ color: '#CBD5E1', fontSize: 40, mb: 1 }} />
                                    <Typography variant="caption" sx={{ color: '#94A3B8', display: 'block', lineHeight: 1.2 }}>
                                        Passport<br/>Preview
                                    </Typography>
                                </Box>
                            )}
                        </PassportPreview>

                        <Box sx={{ flex: 1 }}>
                            <Button
                                component="label"
                                variant={passportFile ? "outlined" : "contained"}
                                startIcon={<CloudUploadIcon />}
                                sx={{ mb: 2, minWidth: 200 }}
                            >
                                {passportFile ? 'Change Photo' : 'Upload Passport'}
                                <VisuallyHiddenInput type="file" onChange={handlePassportChange} accept="image/*" />
                            </Button>
                            
                            {passportFile && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <CheckCircleIcon color="success" fontSize="small" />
                                    <Typography variant="body2" sx={{ color: '#64748B' }}>
                                        {passportFile.name}
                                    </Typography>
                                    <IconButton size="small" onClick={removePassport} color="error" sx={{ ml: 1 }}>
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </Box>
                            )}
                            <Typography variant="caption" display="block" sx={{ mt: 1, color: '#94A3B8' }}>
                                Format: JPG, PNG. Max size: 2MB.
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                <Divider sx={{ my: 4 }} />

                {/* Certificates Section */}
                <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1, color: '#1E293B' }}>
                        2. Certificates & Credentials
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Upload all relevant certificates (Degree, HND, Professional Certifications, etc.). You can upload multiple files.
                    </Typography>

                    <Box 
                        component="label"
                        sx={{
                            border: '2px dashed #E2E8F0',
                            borderRadius: '16px',
                            p: 4,
                            textAlign: 'center',
                            cursor: 'pointer',
                            display: 'block',
                            transition: 'all 0.2s ease-in-out',
                            backgroundColor: '#F8FAFC',
                            '&:hover': {
                                borderColor: 'primary.main',
                                backgroundColor: '#F1F5F9',
                            },
                        }}
                    >
                        <CloudUploadIcon sx={{ fontSize: 48, color: '#CBD5E1', mb: 2 }} />
                        <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600, color: '#1E293B', mb: 0.5 }}>
                            Click to upload documents
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#64748B' }}>
                            SVG, PNG, JPG or PDF
                        </Typography>
                        <VisuallyHiddenInput type="file" multiple onChange={handleCertificatesChange} accept=".pdf,.png,.jpg,.jpeg" />
                    </Box>

                    {certificateFiles.length > 0 && (
                        <Box sx={{ mt: 4 }}>
                            <Typography variant="subtitle2" sx={{ mb: 2, color: '#1E293B' }}>
                                Uploaded Documents ({certificateFiles.length})
                            </Typography>
                            <List disablePadding>
                                {certificateFiles.map((file, index) => (
                                    <ListItem 
                                        key={index} 
                                        sx={{ 
                                            bgcolor: '#F8FAFC', 
                                            mb: 1, 
                                            borderRadius: 2, 
                                            border: '1px solid #E2E8F0' 
                                        }}
                                    >
                                        <ListItemIcon>
                                            <InsertDriveFileIcon sx={{ color: '#2962FF' }} />
                                        </ListItemIcon>
                                        <ListItemText 
                                            primary={file.name} 
                                            secondary={`${(file.size / 1024 / 1024).toFixed(2)} MB`}
                                            primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                                        />
                                        <ListItemSecondaryAction>
                                            <IconButton edge="end" aria-label="delete" onClick={() => removeCertificate(index)}>
                                                <DeleteIcon color="action" />
                                            </IconButton>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                ))}
                            </List>
                        </Box>
                    )}
                </Box>
            </Card>
        </Box>
    );
}

// Remove the import from the bottom if it was part of the original write...
// The previous write concluded with `import { Divider } from '@mui/material';` which was weird. 
// I will ensure this replacement is clean.
