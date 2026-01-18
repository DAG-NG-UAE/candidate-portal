import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { dispatch } from "../dispatchHandle";
import { OfferDetails } from "@/interface/offer";
import {
  getOfferLetter,
  saveJoiningDetails,
  getJoiningDetails,
  getGuarantorDetails,
  saveGuarantorDetails,
  submitDetails,
  rejectOffer,
  acceptOffer,
  saveDocuments,
  deleteUploadedDocument,
} from "@/api/offer";
import { GuarantorFormData } from "@/interface/guarantor";
import { enqueueSnackbar } from "notistack";

export interface OfferState {
  offerDetails: Partial<OfferDetails> | null;
  joiningDetails: any;
  guarantorDetails: Partial<GuarantorFormData> | null;
  loading: boolean;
  error: string | null;
}

const initialState: OfferState = {
  offerDetails: null,
  joiningDetails: null,
  guarantorDetails: null,
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
    setGuarantorDetails(
      state,
      action: PayloadAction<Partial<GuarantorFormData>>
    ) {
      state.guarantorDetails = action.payload;
    },
    clearState(state) {
      state.offerDetails = null;
      state.joiningDetails = null;
      state.guarantorDetails = null;
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
  setGuarantorDetails,
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

export const callGetGuarantorDetails = async () => {
  try {
    dispatch(startLoading());
    const response = await getGuarantorDetails();
    dispatch(setGuarantorDetails(response.data));
  } catch (error: any) {
    dispatch(hasError(error?.response?.data || error));
  } finally {
    dispatch(stopLoading());
  }
};

export const callSaveGuarantorDetails = async (payload: any) => {
  try {
    dispatch(startLoading());
    const result = await saveGuarantorDetails(payload);
    if (result.success) {
      enqueueSnackbar("Guarantor details saved successfully", {
        variant: "success",
      });
    } else {
      enqueueSnackbar(result.message, { variant: "error" });
    }
  } catch (error: any) {
    dispatch(hasError(error?.response?.data || error));
    enqueueSnackbar(error?.response?.data?.message, { variant: "error" });
  } finally {
    dispatch(stopLoading());
  }
};

export const callSubmitDetails = async (digitalSignature: string) => {
  try {
    dispatch(startLoading());
    const result = await submitDetails(digitalSignature);
    if (result.success) {
      return true;
    }
    return false;
  } catch (error: any) {
    dispatch(hasError(error?.response?.data || error));
    return false;
  } finally {
    dispatch(stopLoading());
  }
};

export const callRejectOffer = async (reason: string) => {
  try {
    dispatch(startLoading());
    const result = await rejectOffer(reason);
    if (result.success) {
      return true;
    }
    return false;
  } catch (error: any) {
    dispatch(hasError(error?.response?.data || error));
    return false;
  } finally {
    dispatch(stopLoading());
  }
};

export const callAcceptOffer = async () => {
  try {
    dispatch(startLoading());
    const result = await acceptOffer();
    if (result.success) {
      return true;
    }
    return false;
  } catch (error: any) {
    dispatch(hasError(error?.response?.data || error));
    return false;
  } finally {
    dispatch(stopLoading());
  }
};

export const callSaveDocuments = async (formData: FormData) => {
  try {
    dispatch(startLoading());
    const result = await saveDocuments(formData);
    if (result.success) {
      enqueueSnackbar("Documents uploaded successfully", {
        variant: "success",
      });
      return true;
    } else {
      enqueueSnackbar(result.message || "Failed to upload documents", {
        variant: "error",
      });
      return false;
    }
  } catch (error: any) {
    dispatch(hasError(error?.response?.data || error));
    enqueueSnackbar(error?.message || "Error uploading documents", {
      variant: "error",
    });
    return false;
  } finally {
    dispatch(stopLoading());
  }
};

export const deleteDocument = async (payload: {
  candidateId: string;
  offerId: string;
  documentId: string;
}) => {
  try {
    dispatch(startLoading());
    const result = await deleteUploadedDocument(payload);
    if (result.success) {
      enqueueSnackbar("Document deleted successfully", {
        variant: "success",
      });
      return true;
    } else {
      enqueueSnackbar(result.message || "Failed to delete document", {
        variant: "error",
      });
      return false;
    }
  } catch (error: any) {
    dispatch(hasError(error?.response?.data || error));
    enqueueSnackbar(error?.message || "Error deleting document", {
      variant: "error",
    });
    return false;
  } finally {
    dispatch(stopLoading());
  }
};
export default offerSlice.reducer;
