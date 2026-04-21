// this is supposed to serve as the candidate slice

import { CandidateDetails } from "@/interface/candidate";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { dispatch } from "../dispatchHandle";
import { verifyToken } from "@/api/offer";

export interface CandidateState{ 
    candidate: CandidateDetails | null; 
    loading: boolean; 
    error: string | null; 
}

const initialState: CandidateState = { 
    candidate: null,
    loading: false, 
    error: null, 
}

export const candidateSlice  = createSlice({ 
    name: 'candidates', 
    initialState, 
    reducers: { 
        startLoading(state) {
            state.loading = true;
            state.error = null;
        },
        hasError(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        stopLoading(state) {
            state.loading = false;
        },
        setCandidate(state, action: PayloadAction<CandidateDetails>) {
            state.candidate = action.payload;
        },
        clearState(state) {
            state.candidate = null,
            state.loading = false;
            state.error = null;
        },
    }
})

export const { startLoading, hasError, stopLoading, setCandidate, clearState } = candidateSlice.actions;

export const verifyCandidateToken = async (token: string) => { 
    try {
        dispatch(startLoading());
        const response = await verifyToken(token);

        if (response?.type === 'NOT_FOUND') {
            dispatch(hasError({ message: response.message }));
            return;
        }

        // Success shape: { success: true, data: [...] }
        const candidates = response?.data;
        if (!candidates || candidates.length === 0) {
            dispatch(clearState());
            window.location.href = '/success';
            return;
        }
        dispatch(setCandidate(candidates[0]));
    } catch (error:any) {
        const message = error?.response?.data?.message || error?.message || 'Unable to verify your link. Please try again or contact HR.';
        dispatch(hasError({ message }));
    } finally {
        dispatch(stopLoading());
    }
}
export default candidateSlice.reducer;