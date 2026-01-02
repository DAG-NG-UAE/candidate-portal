import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { dispatch } from "../dispatchHandle";
import { OfferDetails } from "@/interface/offer";
import {
  getOfferLetter,
  saveJoiningDetails,
  getJoiningDetails,
} from "@/api/offer";

export interface OfferState {
  offerDetails: Partial<OfferDetails> | null;
  joiningDetails: any;
  loading: boolean;
  error: string | null;
}

const initialState: OfferState = {
  offerDetails: null,
  joiningDetails: null,
  loading: false,
  error: null,
};

export const offerSlice = createSlice({
  name: "offers",
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
    setOfferDetails(state, action: PayloadAction<Partial<OfferDetails>>) {
      state.offerDetails = action.payload;
    },
    setJoiningDetails(state, action: PayloadAction<any>) {
      state.joiningDetails = action.payload;
    },
    clearState(state) {
      state.offerDetails = null;
      state.error = null;
      state.loading = false;
    },
  },
});

export const {
  startLoading,
  hasError,
  setOfferDetails,
  setJoiningDetails,
  clearState,
  stopLoading,
} = offerSlice.actions;

export const fetchOfferDetails = async () => {
  try {
    dispatch(startLoading());
    const response = await getOfferLetter();
    dispatch(setOfferDetails(response.data));
  } catch (error: any) {
    dispatch(hasError(error?.response?.data || error));
  } finally {
    dispatch(stopLoading());
  }
};

export const callGetJoiningDetails = async () => {
  try {
    dispatch(startLoading());
    const response = await getJoiningDetails();
    dispatch(setJoiningDetails(response.data));
  } catch (error: any) {
    dispatch(hasError(error?.response?.data || error));
  } finally {
    dispatch(stopLoading());
  }
};

export const callSaveJoiningDetails = async (payload: any) => {
  try {
    dispatch(startLoading());
    await saveJoiningDetails(payload);
  } catch (error: any) {
    dispatch(hasError(error?.response?.data || error));
  } finally {
    dispatch(stopLoading());
  }
};

export default offerSlice.reducer;
