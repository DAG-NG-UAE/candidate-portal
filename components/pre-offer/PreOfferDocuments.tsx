"use client";

import React, { useEffect, useState } from 'react';
import {
    Box, Typography, Card, Button, List, ListItem, ListItemIcon,
    ListItemText, Chip, CircularProgress, IconButton, Link, Container, Divider
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import DescriptionIcon from '@mui/icons-material/Description';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

import { getCandidateDocuments, getPreOfferDocuments, savePreOfferDocument } from '@/api/offer';
import { CandidateDetails } from '@/interface/candidate';
import { useSnackbar } from 'notistack';

// Styled input for file upload
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

interface PreOfferDoc {
    pre_offer_requested_docs: {
        id: string; // e.g. "payslip"
        url: string | null;
        type: string;
        status: 'awaiting_upload' | 'uploaded' | 'approved' | 'rejected' | 'pending_review';
        updatedAt: string;
        displayName: string;
        comment?: string;
    }[]
}

interface PreOfferDocumentsProps {
    candidate: CandidateDetails;
}

export default function PreOfferDocuments({ candidate }: PreOfferDocumentsProps) {
    const [documents, setDocuments] = useState<PreOfferDoc>();
    const [loading, setLoading] = useState(true);
    const [uploadingState, setUploadingState] = useState<{ [key: string]: boolean }>({});
    const { enqueueSnackbar } = useSnackbar();

    const fetchDocuments = async () => {
        if (!candidate.candidate_id) return;
        setLoading(true);
        try {
            const result = await getPreOfferDocuments(candidate.candidate_id);
            if (result && (result.success || result.data)) {
                setDocuments(result.data);
            } else {
                console.error("Failed to fetch documents", result);
                enqueueSnackbar("Could not load required documents.", { variant: 'error' });
            }
        } catch (error) {
            console.error("Error fetching documents:", error);
            enqueueSnackbar("An error occurred while loading documents.", { variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, [candidate.candidate_id]);

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, docId: string) => {
        const file = event.target.files?.[0];
        if (!file) return;

        event.target.value = '';

        setUploadingState(prev => ({ ...prev, [docId]: true }));

        const formData = new FormData();
        formData.append('candidateId', candidate.candidate_id);
        formData.append('file', file);
        formData.append('docId', docId);

        try {
            console.log("Uploading document", Object.fromEntries(formData.entries()));
            const response = await savePreOfferDocument(formData);
            if (response && (response.success || response.data)) {
                enqueueSnackbar(`${file.name} uploaded successfully`, { variant: 'success' });
                fetchDocuments();
            } else {
                enqueueSnackbar(response?.message || "Upload failed", { variant: 'error' });
            }
        } catch (error) {
            console.error("Upload error:", error);
            enqueueSnackbar("An error occurred during upload.", { variant: 'error' });
        } finally {
            setUploadingState(prev => ({ ...prev, [docId]: false }));
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved': return 'success';
            case 'uploaded':
            case 'pending_review': return 'info';
            case 'rejected': return 'error';
            case 'awaiting_upload': return 'warning';
            default: return 'default';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'approved': return 'Approved';
            case 'uploaded': return 'Uploaded';
            case 'pending_review': return 'In Review';
            case 'rejected': return 'Action Required';
            case 'awaiting_upload': return 'Pending Upload';
            default: return status.replace('_', ' ');
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'radial-gradient(circle at 50% 10%, rgb(241, 245, 249) 0%, rgb(255, 255, 255) 100%)',
                py: 4
            }}
        >
            <Container maxWidth="md">
                <Card
                    elevation={0}
                    sx={{
                        p: { xs: 3, md: 5 },
                        borderRadius: 4,
                        boxShadow: '0 20px 40px rgba(0,0,0,0.06)',
                        border: '1px solid rgba(0,0,0,0.05)'
                    }}
                >
                    <Box sx={{ mb: 4, textAlign: 'center' }}>
                        <Box
                            sx={{
                                width: 64,
                                height: 64,
                                borderRadius: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mx: 'auto',
                                mb: 2,
                                background: 'rgba(37, 99, 235, 0.1)',
                                color: 'primary.main'
                            }}
                        >
                            <DescriptionIcon sx={{ fontSize: 32 }} />
                        </Box>
                        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, color: '#1E293B' }}>
                            Required Documents
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#64748B', maxWidth: 600, mx: 'auto' }}>
                            To proceed with your offer process, we need you to upload the following documents.
                            Please ensure scans are clear and readable.
                        </Typography>
                    </Box>

                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <List sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {documents?.pre_offer_requested_docs.map((doc) => (
                                <ListItem
                                    key={doc.id}
                                    sx={{
                                        bgcolor: '#fff',
                                        borderRadius: 3,
                                        border: '1px solid',
                                        borderColor: doc.status === 'rejected' ? '#FECACA' : '#E2E8F0',
                                        p: 2.5,
                                        flexWrap: 'wrap',
                                        gap: 2,
                                        transition: 'all 0.2s',
                                        '&:hover': {
                                            borderColor: 'primary.main',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                                        }
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, minWidth: 200 }}>
                                        <Box
                                            sx={{
                                                width: 48,
                                                height: 48,
                                                borderRadius: '12px',
                                                bgcolor: '#F8FAFC',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: '#64748B'
                                            }}
                                        >
                                            <InsertDriveFileIcon />
                                        </Box>
                                        <Box>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1E293B' }}>
                                                {doc.displayName}
                                            </Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                                <Chip
                                                    label={getStatusLabel(doc.status)}
                                                    size="small"
                                                    sx={{
                                                        fontWeight: 600,
                                                        borderRadius: '6px',
                                                        height: 24,
                                                        bgcolor: (theme) => {
                                                            const colorKey = getStatusColor(doc.status);
                                                            // @ts-ignore
                                                            const paletteColor = theme.palette[colorKey];

                                                            if (paletteColor) {
                                                                return alpha(paletteColor.main, 0.1);
                                                            }
                                                            return alpha(theme.palette.text.primary, 0.05);
                                                        },
                                                        color: (theme) => {
                                                            const colorKey = getStatusColor(doc.status);
                                                            // @ts-ignore
                                                            const paletteColor = theme.palette[colorKey];
                                                            return paletteColor ? paletteColor.main : theme.palette.text.primary;
                                                        },
                                                        '& .MuiChip-label': { px: 1 }
                                                    }}
                                                />
                                                {doc.updatedAt && (
                                                    <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                                                        • Updated {new Date(doc.updatedAt).toLocaleDateString()}
                                                    </Typography>
                                                )}
                                            </Box>
                                            {doc.comment && doc.status === 'rejected' && (
                                                <Typography variant="body2" color="error" sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <ErrorOutlineIcon fontSize="inherit" /> {doc.comment}
                                                </Typography>
                                            )}
                                        </Box>
                                    </Box>

                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        {doc.url && (
                                            <Button
                                                variant="outlined"
                                                size="medium"
                                                onClick={() => getCandidateDocuments(doc.url!)}
                                                sx={{
                                                    borderRadius: '10px',
                                                    color: 'text.secondary',
                                                    borderColor: 'divider',
                                                    textTransform: 'none'
                                                }}
                                            >
                                                View
                                            </Button>
                                        )}

                                        {(doc.status === 'awaiting_upload' || doc.status === 'rejected') && (
                                            <Button
                                                component="label"
                                                variant="contained"
                                                startIcon={uploadingState[doc.id] ? <CircularProgress size={20} color="inherit" /> : <CloudUploadIcon />}
                                                disabled={uploadingState[doc.id]}
                                                sx={{
                                                    borderRadius: '10px',
                                                    textTransform: 'none',
                                                    minWidth: 120,
                                                    bgcolor: doc.status === 'rejected' ? 'error.main' : 'primary.main',
                                                    '&:hover': {
                                                        bgcolor: doc.status === 'rejected' ? 'error.dark' : 'primary.dark'
                                                    }
                                                }}
                                            >
                                                {uploadingState[doc.id] ? 'Uploading...' : (doc.status === 'rejected' ? 'Re-upload' : 'Upload')}
                                                <VisuallyHiddenInput
                                                    type="file"
                                                    onChange={(e) => handleFileUpload(e, doc.id)}
                                                />
                                            </Button>
                                        )}

                                        {(doc.status === 'uploaded' || doc.status === 'pending_review' || doc.status === 'approved') && (
                                            <Box sx={{ color: 'success.main' }}>
                                                <CheckCircleIcon fontSize="large" color="success" />
                                            </Box>
                                        )}
                                    </Box>
                                </ListItem>
                            ))}
                        </List>
                    )}

                    <Box sx={{ mt: 4, textAlign: 'center' }}>
                        <Button
                            disabled={documents?.pre_offer_requested_docs.some(d => d.status === 'awaiting_upload' || d.status === 'rejected')}
                            variant="contained"
                            size="large"
                            sx={{
                                borderRadius: '12px',
                                px: 4,
                                py: 1.5,
                                textTransform: 'none',
                                fontSize: '1rem'
                            }}
                        >
                            All Documents Submitted
                        </Button>
                        {documents?.pre_offer_requested_docs.some(d => d.status === 'awaiting_upload' || d.status === 'rejected') && (
                            <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
                                Please upload all required documents to proceed.
                            </Typography>
                        )}
                    </Box>

                </Card>
            </Container>
        </Box>
    );
}
