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
        dispatch(setCandidate(response.data[0]));
    } catch (error:any) {
        dispatch(hasError(error?.response?.data || error));
    } finally {
        dispatch(stopLoading());
    }
}
export default candidateSlice.reducer;