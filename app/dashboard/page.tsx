"use client";

import React, { useEffect, Suspense, useRef, useState } from "react";
import {
  Box,
  Typography,
  Container,
  Card,
  Button,
  LinearProgress,
  IconButton,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  CircularProgress,
  useTheme,
  Paper,
} from "@mui/material";
import {
  NotificationsNone,
  HelpOutline,
  CheckCircle,
  ErrorOutline,
  AccessTime,
  Lock,
  Description,
  HistoryEdu,
  Person,
  Home,
  School,
  Badge,
  OpenInNew,
} from "@mui/icons-material";
import { useSelector, useDispatch } from "@/redux/store";
import { verifyCandidateToken } from "@/redux/slices/candidate";
import {
  callGetJoiningDetails,
  callGetGuarantorDetails,
  fetchOfferDetails,
  callSaveDocuments,
} from "@/redux/slices/offer";
import { useSearchParams, useRouter } from "next/navigation";
import { API_BASE_URL } from "@/api/axiosInstance";
import { useSnackbar } from "notistack";

function DashboardContent() {
  const theme = useTheme();
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  
  const { loading: candidateLoading, candidate, error } = useSelector(
    (state) => state.candidates
  );
  const {
    joiningDetails,
    guarantorDetails,
    offerDetails,
    loading: offerLoading,
  } = useSelector((state) => state.offers);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [replacingDoc, setReplacingDoc] = useState<{ id: string; type: string } | null>(null);

  useEffect(() => {
    if (token) {
      verifyCandidateToken(token);
    }
  }, [token]);

  useEffect(() => {
    if (candidate) {
      const fetchData = async () => {
        await callGetJoiningDetails();
        await callGetGuarantorDetails();
        await fetchOfferDetails();
      };
      fetchData();
    }
  }, [candidate]);

  const getFullUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    const base = API_BASE_URL?.replace(/\/+$/, '') || '';
    const path = url.replace(/^\/+/, '');
    return `${base}/${path}`;
  };

  const handleReplaceClick = (docId: string, type: string) => {
    setReplacingDoc({ id: docId, type });
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && replacingDoc && candidate && offerDetails?.offer_id) {
        const formData = new FormData();
        formData.append("candidateId", candidate.candidate_id);
        formData.append("offerId", offerDetails.offer_id);
        formData.append("documentId", replacingDoc.id);
        formData.append(replacingDoc.type, file);

        await callSaveDocuments(formData);
        await callGetJoiningDetails()
       enqueueSnackbar("Document replaced successfully", { variant: "success" });
       
    }
    // Reset state and input
    setReplacingDoc(null);
    if (event.target) event.target.value = '';
  };

  if (candidateLoading || (candidate && !joiningDetails && offerLoading)) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#F0F4FA",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", p: 3, bgcolor: "#F0F4FA" }}>
        <Card sx={{ p: 4, textAlign: "center", maxWidth: 400, borderRadius: 4 }}>
          <ErrorOutline color="error" sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="h5" gutterBottom fontWeight={700}>Verification Failed</Typography>
          <Typography color="text.secondary" mb={3}>
            {typeof error === "string" ? error : "Invalid or expired session. Please use the link sent to your email."}
          </Typography>
          <Button variant="contained" onClick={() => router.push('/')}>Go to Home</Button>
        </Card>
      </Box>
    );
  }

  if (!candidate) {
      return (
        <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "#F0F4FA" }}>
            <Typography variant="h6" color="text.secondary">Please wait while we verify your session...</Typography>
        </Box>
      )
  }

  const firstName = candidate.first_name || "Candidate";
  const fullName = `${candidate.first_name || ""} ${candidate.last_name || ""}`;

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case "APPROVED":
      case "VERIFIED":
      case "ACCEPTED":
      case "SUBMITTED":
        return "success";
      case "REJECTED":
        return "error";
      case "UNDER REVIEW":
      case "PENDING":
        return "warning";
      default:
        return "default";
    }
  };

  const getCategorizedDocs = () => {
    const categories = [
        { id: 'identity', title: "IDENTITY & CITIZENSHIP", icon: <Badge />, docs: [] as any[] },
        { id: 'education', title: "EDUCATION & CERTIFICATES", icon: <School />, docs: [] as any[] },
        { id: 'residency', title: "PROOF OF RESIDENCY", icon: <Home />, docs: [] as any[] },
    ];

    const docs = joiningDetails?.documents || {};
    
    Object.entries(docs).forEach(([key, value]) => {
        if (!value) return;
        const docList = Array.isArray(value) ? value : [value];
        
        docList.forEach((d: any) => {
            let targetCategoryId = 'residency';
            let displayName = d.fileName || key;

            if (key === 'passport') {
                targetCategoryId = 'identity';
                displayName = "Passport Image";
            } else if (key === 'certificates') {
                targetCategoryId = 'education';
                displayName = d.fileName || "Academic Certificate";
            } else if (key === 'proof') {
                const lowerName = d.fileName?.toLowerCase() || '';
                if (lowerName.includes('nin')) {
                    targetCategoryId = 'identity';
                    displayName = "NIN Slip";
                } else if (lowerName.includes('utility')) {
                    targetCategoryId = 'residency';
                    displayName = "Utility Bill";
                } else {
                    targetCategoryId = 'residency';
                    displayName = d.fileName || "Proof of Document";
                }
            }

            const cat = categories.find(c => c.id === targetCategoryId);
            if (cat) {
                cat.docs.push({
                    _id: d._id,
                    dbKey: key, // Added to know which field to use for upload
                    name: displayName,
                    fileName: d.fileName,
                    url: d.url,
                    status: d.status || "SUBMITTED",
                    attention: d.status === 'REJECTED',
                    locked: d.status === 'APPROVED',
                    reason: d.comment
                });
            }
        });
    });

    return categories;
  };

  const docCategories = getCategorizedDocs();
  const allDocs = docCategories.flatMap(cat => cat.docs);
  const completedDocs = allDocs.filter(d => ['APPROVED', 'VERIFIED', 'SUBMITTED', 'ACCEPTED'].includes(d.status.toUpperCase())).length;
  const completionRate = allDocs.length > 0 ? Math.round((completedDocs / allDocs.length) * 100) : 0;

  const milestones: { label: string; status: string; reason?: string | null }[] = [
    { label: "Offer Terms", status: offerDetails?.status === 'accepted' ? 'ACCEPTED' : 'PENDING' },
    { label: "Personal Information", status: joiningDetails ? 'SUBMITTED' : 'PENDING' },
    { label: "Guarantor Details", status: guarantorDetails ? 'SUBMITTED' : 'PENDING' },
    ...allDocs.slice(0, 2).map(d => ({ label: d.name, status: d.status, reason: d.attention ? d.reason : null }))
  ].slice(0, 5);

  return (
    <Box sx={{ bgcolor: "#F0F4FA", minHeight: "100vh", pb: 10 }}>
      {/* Hidden file input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        style={{ display: 'none' }} 
        onChange={onFileChange}
        accept=".pdf,.jpg,.jpeg,.png"
      />

      {/* Header */}
      <Box
        sx={{
          bgcolor: "white",
          borderBottom: "1px solid #E2E8F0",
          py: 1.5,
          px: { xs: 2, md: 4 },
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box sx={{ bgcolor: "#2563EB", width: 36, height: 36, borderRadius: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 900 }}>🚀</Typography>
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 800, fontSize: "1.1rem", color: '#1E293B' }}>Onboarding Portal</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Divider orientation="vertical" flexItem sx={{ mx: 1, height: 24 }} />
          <Box sx={{ textAlign: "right", mr: 1, display: { xs: 'none', sm: 'block' } }}>
            <Typography variant="body2" sx={{ fontWeight: 800, lineHeight: 1.2 }}>{fullName}</Typography>
            <Typography variant="caption" sx={{ color: '#64748B', fontWeight: 600 }}>Candidate</Typography>
          </Box>
          <Avatar sx={{ width: 40, height: 40, ml: 1, bgcolor: '#DBEAFE', color: 'primary.main', fontWeight: 800 }}>{fullName.charAt(0)}</Avatar>
        </Box>
      </Box>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        {/* Banner Section */}
        <Paper
          elevation={0}
          sx={{
            background: "linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)",
            color: "white",
            p: { xs: 3, md: 4 }, 
            borderRadius: 4,
            mb: 4,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Box sx={{ position: "relative", zIndex: 1 }}>
            <Chip
              label="CURRENT STEP: VERIFICATION"
              size="small"
              sx={{ 
                  bgcolor: "rgba(255,255,255,0.15)", 
                  color: "white", 
                  fontWeight: 700, 
                  mb: 1.5, 
                  borderRadius: "4px",
                  fontSize: '0.65rem'
              }}
            />
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, fontSize: { xs: '1.5rem', md: '2.25rem' } }}>
              Hi {firstName}, we are reviewing <br/>your documents...
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
               <AccessTime sx={{ color: '#FBBF24', fontSize: 20 }} />
               <Typography variant="body1" sx={{ opacity: 0.9, fontWeight: 500, fontSize: '1rem' }}>
                Status: <Box component="span" sx={{ color: "#FBBF24", fontWeight: 700 }}>Under Review</Box>
              </Typography>
            </Box>
          </Box>
          <Box sx={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
        </Paper>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
          {/* Left Column: Progress */}
          <Box sx={{ flex: { xs: '1 1 100%', md: '0 0 calc(33.33% - 16px)' } }}>
            <Card sx={{ p: 4, borderRadius: 5 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>Onboarding Progress</Typography>

              <Box sx={{ mb: 4 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: "text.secondary" }}>Overall Completion</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 800, color: "primary.main" }}>{completionRate}%</Typography>
                </Box>
                <LinearProgress variant="determinate" value={completionRate} sx={{ height: 8, borderRadius: 4, bgcolor: "#E2E8F0" }} />
              </Box>

              <List sx={{ "& .MuiListItem-root": { px: 0, py: 2 } }}>
                {milestones.map((m, i) => (
                  <React.Fragment key={i}>
                    <ListItem alignItems="flex-start" sx={{ flexDirection: "column" }}>
                      <Box sx={{ display: "flex", width: "100%", alignItems: "center" }}>
                        <ListItemIcon sx={{ minWidth: 40, color: m.status === 'REJECTED' ? 'error.main' : 'success.main' }}>
                          {m.status === 'REJECTED' ? <ErrorOutline sx={{ fontSize: 24 }} /> : <CheckCircle sx={{ fontSize: 24 }} />}
                        </ListItemIcon>
                        <ListItemText
                          primary={m.label}
                          primaryTypographyProps={{ variant: "body2", fontWeight: 700 }}
                          secondary={m.status}
                          secondaryTypographyProps={{ variant: "caption", fontWeight: 800, sx: { color: getStatusColor(m.status) + ".main" } }}
                        />
                      </Box>
                      {m.reason && (
                        <Box sx={{ bgcolor: "rgba(239, 68, 68, 0.04)", p: 2, borderRadius: 3, mt: 1.5, borderLeft: "4px solid", borderColor: "error.main", width: '100%' }}>
                          <Typography variant="caption" sx={{ color: "#991B1B", fontWeight: 500 }}>Reason: "{m.reason}"</Typography>
                        </Box>
                      )}
                    </ListItem>
                    {i < milestones.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </Card>
          </Box>

          {/* Right Column: Document Center */}
          <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 66.66%' } }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>Document Center</Typography>
              {allDocs.some(d => d.attention) && (
                <Chip label="ATTENTION REQUIRED" size="small" sx={{ bgcolor: "#FEE2E2", color: "#991B1B", fontWeight: 800, borderRadius: 2 }} />
              )}
            </Box>

            {docCategories.map((category, idx) => (
              category.docs.length > 0 && (
                <Box key={idx} sx={{ mb: 5 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2.5 }}>
                    <Box sx={{ bgcolor: '#DBEAFE', p: 0.8, borderRadius: 2, display: 'flex' }}>
                        {React.cloneElement(category.icon as React.ReactElement, { sx: { fontSize: 18, color: "primary.main" } })}
                    </Box>
                    <Typography variant="overline" sx={{ fontWeight: 800, color: "#64748B", letterSpacing: 1.5 }}>{category.title}</Typography>
                  </Box>

                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                    {category.docs.map((doc, dIdx) => (
                      <Box key={dIdx} sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)' } }}>
                        <Card variant="outlined" sx={{ p: 3, borderRadius: 5, border: doc.attention ? "2px solid #FCA5A5" : "1px solid #E2E8F0", height: '100%', position: 'relative' }}>
                          <Box sx={{ display: "flex", gap: 2.5 }}>
                            <Box sx={{ width: 56, height: 56, borderRadius: 3, bgcolor: doc.status === "REJECTED" ? "#FEE2E2" : "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                              <Description sx={{ color: doc.status === "REJECTED" ? "#EF4444" : "#2563EB", fontSize: 28 }} />
                            </Box>
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: 'flex-start', mb: 0.5 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#1E293B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {doc.name}
                                </Typography>
                                {doc.locked && <Lock sx={{ fontSize: 16, color: "#94A3B8" }} />}
                              </Box>
                              <Typography variant="caption" sx={{ color: "#64748B", display: "block", mb: 2, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {doc.fileName || "Awaiting processing..."}
                              </Typography>
                              
                              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <Chip label={doc.status} size="small" sx={{ height: 22, fontSize: "0.65rem", fontWeight: 900, borderRadius: 1.5, bgcolor: getStatusChipBg(doc.status), color: getStatusChipText(doc.status) }} />
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    {doc.url && (
                                        <Button 
                                            size="small" 
                                            variant="text" 
                                            startIcon={<OpenInNew sx={{ fontSize: 14 }} />}
                                            href={getFullUrl(doc.url)}
                                            target="_blank"
                                            sx={{ textTransform: "none", fontWeight: 800, fontSize: '0.75rem' }}
                                        >
                                            View
                                        </Button>
                                    )}
                                    {doc.attention && (
                                        <Button 
                                            size="small" 
                                            variant="contained" 
                                            onClick={() => handleReplaceClick(doc._id, doc.dbKey)}
                                            sx={{ textTransform: "none", fontWeight: 800, fontSize: '0.75rem', boxShadow: 'none' }}
                                        >
                                            Replace
                                        </Button>
                                    )}
                                </Box>
                              </Box>
                            </Box>
                          </Box>
                        </Card>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

const getStatusChipBg = (status: string) => {
    switch (status?.toUpperCase()) {
        case 'APPROVED': return '#DCFCE7';
        case 'REJECTED': return '#FEE2E2';
        case 'UNDER REVIEW': return '#FEF3C7';
        case 'PENDING': return '#F1F5F9';
        default: return '#F1F5F9';
    }
}

const getStatusChipText = (status: string) => {
    switch (status?.toUpperCase()) {
        case 'APPROVED': return '#166534';
        case 'REJECTED': return '#991B1B';
        case 'UNDER REVIEW': return '#92400E';
        case 'PENDING': return '#475569';
        default: return '#475569';
    }
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<CircularProgress />}>
      <DashboardContent />
    </Suspense>
  );
}
