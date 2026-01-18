'use client';

import React, { useState } from 'react';
import { 
    Box, Typography, Card, TextField, MenuItem, 
    Button, Divider, Radio, RadioGroup, FormControlLabel, FormControl, FormLabel, Checkbox, CircularProgress 
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { GuarantorFormData } from '@/interface/guarantor';
import { useSelector } from '@/redux/store';
import { callGetGuarantorDetails, callSaveGuarantorDetails } from '@/redux/slices/offer';
import { useEffect } from 'react';

const CustomTextField = styled(TextField)({
    '& .MuiOutlinedInput-root': {
        backgroundColor: '#F8FAFC',
        borderRadius: '8px',
        '& fieldset': { borderColor: 'transparent' },
        '&:hover fieldset': { borderColor: '#E2E8F0' },
        '&.Mui-focused': { backgroundColor: '#ffffff' },
        '&.Mui-focused fieldset': { borderColor: '#2962FF' },
        '& input': { padding: '12px 14px', fontSize: '0.9rem', color: '#0F172A' }
    },
});

const NoticeBox = styled(Box)({
    backgroundColor: '#FFF8E1', 
    border: '1px solid #FFE0B2', 
    borderRadius: '8px', 
    padding: '16px', 
    marginBottom: '24px'
});

const SectionHeader = ({ title, mt = 0 }: { title: string, mt?: number }) => (
    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1E293B', mb: 2, mt: mt, textTransform: 'uppercase', fontSize: '0.9rem', borderBottom: '1px solid #E2E8F0', pb: 1 }}>
        {title}
    </Typography>
);

const initialData: GuarantorFormData = {
    guarantor_full_name: '', email_address: '', place_of_work_address: '',
    income_range: '', relationship_with_employee: '', relationship_other: '',
    known_duration: '', known_duration_comment: '',
    assessment_character: '', assessment_comment: '',
    is_honest: '', recommend_for_employment: '', recommend_comment: '',
    will_stand_as_guarantor: '', general_comment: '',
    phone_number: '', house_address: '',
    declaration_agreed: false, digital_signature: '', declaration_date: null
};



export default function GuarantorStep() {
    const [formData, setFormData] = useState<GuarantorFormData>(initialData);
    const { guarantorDetails, loading } = useSelector((state) => state.offers);
    const { candidate } = useSelector((state) => state.candidates);

    useEffect(() => {
        if (!guarantorDetails) {
            callGetGuarantorDetails();
        } else {
             // Merge initialData with fetched data to ensure all keys exist
            setFormData(prev => ({ ...prev, ...guarantorDetails }));
        }
    }, [guarantorDetails]);

    const handleChange = (field: keyof GuarantorFormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [field]: e.target.value }));
    };

    const handleDeclarationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, declaration_agreed: e.target.checked }));
    };

    const handleSubmit = async() => {
        const payload = {
            ...formData,
        };
        console.log("Submitting Guarantor Payload:", JSON.stringify(payload, null, 2));
        await callSaveGuarantorDetails(payload);
    };

    // Helper to render responsive text field
    const renderTextField = (label: string, field: keyof GuarantorFormData, width = '100%', multiline = false) => (
         <Box sx={{ width: width === 'half' ? { xs: '100%', sm: 'calc(50% - 8px)' } : '100%' }}>
            <Typography variant="caption" sx={{ fontWeight: 600, color: '#475569', mb: 0.5, display: 'block' }}>{label}</Typography>
            <CustomTextField 
                fullWidth 
                multiline={multiline}
                rows={multiline ? 3 : 1}
                value={formData[field] as string} 
                onChange={handleChange(field)} 
                variant="outlined"
            />
        </Box>
    );

    const renderRadioGroup = (label: string, field: keyof GuarantorFormData, options: { label: string, value: string }[]) => (
        <Box sx={{ width: '100%', mb: 2 }}>
            <Typography variant="caption" sx={{ fontWeight: 600, color: '#475569', mb: 0.5, display: 'block' }}>{label}</Typography>
            <RadioGroup 
                value={formData[field]} 
                onChange={handleChange(field)}
            >
                {options.map((opt) => (
                    <FormControlLabel 
                        key={opt.value} 
                        value={opt.value} 
                        control={<Radio size="small" />} 
                        label={<Typography variant="body2">{opt.label}</Typography>} 
                    />
                ))}
            </RadioGroup>
        </Box>
    );

    return (
        <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
            <Card variant="outlined" sx={{ p: { xs: 3, md: 5 }, borderRadius: 4, border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#0F172A', textAlign: 'center' }}>
                    GUARANTOR REFERENCE CHECK
                </Typography>
                
                <NoticeBox>
                    <Typography variant="body2" color="warning.main">
                        Our employment process requires that a person seeking employment with us shall produce a credible, responsible and acceptable person as Guarantor. If you are willing to stand as a guarantor for the said applicant, kindly complete this form. Please note that it is dangerous to stand as a guarantor for someone whom you do not know.
                    </Typography>
                </NoticeBox>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {/* Section 1: Details */}
                    <Box>
                        <SectionHeader title="1. Personal Details" />
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                             {renderTextField("1. Guarantor's Full Name", 'guarantor_full_name')}
                             {renderTextField("2. E-mail Address", 'email_address', 'half')}
                             {renderTextField("Telephone Number", 'phone_number', 'half')}
                             {renderTextField("3. Current Place of Work/Business Name & Address", 'place_of_work_address', '100%', true)}
                             {renderTextField("House Address", 'house_address', '100%')}
                        </Box>
                    </Box>

                    {/* Section 2: Financials & Relations */}
                    <Box>
                        <SectionHeader title="2. Financial & Relationship Assessment" mt={2} />
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                             {renderRadioGroup("4. Guarantor's Income Range (Per Annum)", 'income_range', [
                                 {label: "N2M to N5M", value: "2m-5m"},
                                 {label: "N5M to N7M", value: "5m-7m"},
                                 {label: "N7M to N9M", value: "7m-9m"},
                                 {label: "N9M to N12M", value: "9m-12m"},
                                 {label: "N12M to N15M", value: "12m-15m"},
                                 {label: "Above N15M", value: "above-15m"},
                             ])}
                             
                             {renderRadioGroup("5. Relationship with the employee", 'relationship_with_employee', [
                                 {label: "Professional", value: "Professional"},
                                 {label: "Family", value: "Family"},
                                 {label: "Friend", value: "Friend"},
                                 {label: "Others", value: "Others"},
                             ])}
                             {formData.relationship_with_employee === 'Others' && renderTextField("Specify Relationship", 'relationship_other')}
                        </Box>
                    </Box>

                     {/* Section 3: Assessment */}
                     <Box>
                        <SectionHeader title="3. Candidate Assessment" mt={2} />
                         <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                              <Box sx={{ width: '100%' }}>
                                {renderRadioGroup("6. How long have you known the Candidate?", 'known_duration', [
                                     {label: "Less than 3 years", value: "<3"},
                                     {label: "3-5 years", value: "3-5"},
                                     {label: "5-10 years", value: "5-10"},
                                     {label: "Over 10 years", value: ">10"},
                                 ])}
                                 {renderTextField("Comments", 'known_duration_comment', '100%')}
                             </Box>

                             <Box sx={{ width: '100%', mt: 2 }}>
                                {renderRadioGroup("7. Assessment of Conduct/Character and Association", 'assessment_character', [
                                     {label: "Very good", value: "Very good"},
                                     {label: "Good", value: "Good"},
                                     {label: "Satisfactory", value: "Satisfactory"},
                                     {label: "Unsatisfactory", value: "Unsatisfactory"},
                                 ])}
                                 {renderTextField("Comments", 'assessment_comment', '100%')}
                             </Box>

                             <Box sx={{ width: '100%', mt: 2 }}>
                                {renderRadioGroup("8. Do you consider him/her to be Honest?", 'is_honest', [
                                     {label: "Definitely", value: "Definitely"},
                                     {label: "To a large extent", value: "To a large extent"},
                                     {label: "Not Certain", value: "Not Certain"},
                                     {label: "No Comment", value: "No Comment"},
                                 ])}
                             </Box>
                        </Box>
                    </Box>

                     {/* Section 4: Recommendation */}
                     <Box>
                        <SectionHeader title="4. Recommendation" mt={2} />
                         <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                            <Box sx={{ width: '100%' }}>
                                {renderRadioGroup("9. Would you recommend him/her for employment with us?", 'recommend_for_employment', [
                                     {label: "Yes", value: "Yes"},
                                     {label: "No", value: "No"},
                                 ])}
                                 {renderTextField("Why?", 'recommend_comment', '100%')}
                             </Box>

                             <Box sx={{ width: '100%', mt: 2 }}>
                                {renderRadioGroup("10. If you have chosen to stand as his/her guarantor", 'will_stand_as_guarantor', [
                                     {label: "Yes", value: "Yes"},
                                     {label: "No", value: "No"},
                                 ])}
                                 {renderTextField("General Comment", 'general_comment', '100%')}
                             </Box>
                         </Box>
                    </Box>

                    {/* Section 5: Declaration */}
                    <Box sx={{ bgcolor: '#F1F5F9', p: 3, borderRadius: 2, mt: 2 }}>
                        <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 700, mb: 2 }}>Declaration of Indemnity</Typography>
                        <Typography variant="body2" sx={{ lineHeight: 1.8, mb: 2, textAlign: 'justify' }}>
                            I hereby state that all information provided above are true and I confirm that I stand as a
                            Guarantor for <strong>{candidate?.first_name} {candidate?.last_name}</strong> who is being considered for
                            employment in DAG MOTORCYCLE INDUSTRIES NIGERIA LTD. I further state that I
                            irrevocably and unconditionally agree to indemnify DAG MOTORCYCLE INDUSTRIES
                            NIGERIA LTD against the following:
                        </Typography>
                        <Typography variant="body2" sx={{ lineHeight: 1.8, mb: 1, pl: 2 }}>
                            1. Any loss suffered as a result of the employee's action/inaction or dereliction of his duties.
                        </Typography>
                        <Typography variant="body2" sx={{ lineHeight: 1.8, mb: 2, pl: 2 }}>
                            2. Any action arising from the employee's desertion on commission of any offence in the course of his employment.
                        </Typography>
                         <Typography variant="body2" sx={{ lineHeight: 1.8, mb: 3 }}>
                            I further promise to produce him/her at any time his presence may be needed in relation to commission of an offence.
                        </Typography>
                        
                        <FormControlLabel 
                            control={<Checkbox checked={formData.declaration_agreed} onChange={handleDeclarationChange} />} 
                            label={<Typography variant="body2" sx={{ fontWeight: 600 }}>I Agree to the above terms and declaration</Typography>} 
                        />
                        
                         {formData.declaration_agreed && (
                             <Box sx={{ mt: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                 {renderTextField("Signature (Type Full Name)", 'digital_signature', 'half')}
                                 {renderTextField("Date", 'declaration_date', 'half')}
                                 {renderTextField("Telephone Number", 'phone_number', 'half')}
                                 {renderTextField("Email Address", 'email_address', 'half')}
                                 {renderTextField("House Address", 'house_address', '100%')}
                             </Box>
                         )}
                    </Box>
                    
                    <Box sx={{ mt: 2, p: 2, border: '1px dashed #CBD5E1', borderRadius: 2, bgcolor: '#FAFAFA' }}>
                        <Typography variant="caption" sx={{ display: 'block', mb: 1, fontWeight: 700 }}>NB: Acceptable Guarantors:</Typography>
                        <Typography variant="caption" color="text.secondary">
                            Lecturers, Architects, Engineers, Teachers, Doctors, Nurses, Lawyers, Bankers, Accountants, Managers/Deputy Managers of reputable companies, Traditional rulers and clergy from well recognized churches/mosques, senior civil servants not lower than Grade level 8 excluding uniform personnel.
                        </Typography>
                        <Typography variant="caption" sx={{ display: 'block', mt: 1, fontStyle: 'italic' }}>
                            Note: This form should be returned after it has been duly filled and signed by the guarantor together with the guarantor’s passport size photograph and his/her means of identification.
                        </Typography>
                    </Box>

                    <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button 
                            variant="contained" 
                            size="large"
                            onClick={handleSubmit} 
                            disabled={!formData.declaration_agreed || loading}
                            sx={{ 
                                minWidth: 200, 
                                py: 1.5, 
                                textTransform: 'none', 
                                fontWeight: 600, 
                                borderRadius: '8px', 
                                bgcolor: '#2962FF', 
                                '&:hover': { bgcolor: '#1E40AF' }
                            }}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : 'Submit Guarantor Form'}
                        </Button>
                    </Box>

                </Box>
            </Card>
        </Box>
    );
}
