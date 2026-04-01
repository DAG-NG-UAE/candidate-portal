import axiosInstance from "./axiosInstance";

export const verifyToken = async (token: string) => {
  try {
    const response = await axiosInstance.get(`/offer/verify?token=${token}`);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const getOfferLetter = async () => {
  try {
    const response = await axiosInstance.get(`/offer/details`);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const getJoiningDetails = async () => {
  try {
    const response = await axiosInstance.get(`/offer/joining/details`);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const saveJoiningDetails = async (payload: any) => {
  try {
    const response = await axiosInstance.patch(`/offer/joining/save`, payload);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const getGuarantorDetails = async () => {
  try {
    const response = await axiosInstance.get(`/offer/guarantor/details`);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const saveGuarantorDetails = async (payload: any) => {
  try {
    const response = await axiosInstance.patch(
      `/offer/guarantor/save`,
      payload,
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

export const submitDetails = async (digitalSignature: string) => {
  try {
    const response = await axiosInstance.post(`/offer/submit`, {
      digital_signature: digitalSignature,
    });
    return response.data.data;
  } catch (error) {
    return error;
  }
};

export const rejectOffer = async (reason: string) => {
  try {
    const response = await axiosInstance.post(`/offer/reject`, {
      reason_for_rejecting: reason,
    });
    return response.data;
  } catch (error) {
    return error;
  }
};

export const acceptOffer = async () => {
  try {
    const response = await axiosInstance.post(`/offer/accept`);
    return response.data;
  } catch (error) {
    return error;
  }
};

export const saveDocuments = async (formData: FormData) => {
  try {
    const response = await axiosInstance.post(
      `/application/document/save`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

export const savePreOfferDocument = async (formData: FormData) => {
  try {
    const response = await axiosInstance.post(
      `/application/pre-offer/save`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteUploadedDocument = async (payload: {
  candidateId: string;
  offerId: string;
  documentId: string;
}) => {
  try {
    const response = await axiosInstance.delete(
      `/application/document/delete?candidateId=${payload.candidateId}&offerId=${payload.offerId}&documentId=${payload.documentId}`,
    );
    return response.data.data;
  } catch (error) {
    return error;
  }
};

export const getPreOfferDocuments = async (candidateId: string) => {
  try {
    const response = await axiosInstance.get(
      `/offer/pre/docs?candidateId=${candidateId}`,
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCandidateDocuments = async (url: string) => {
  try {
    const response = await axiosInstance.get(`/candidate/public/documents?url=${url}`);
    console.log("The response from get candidate documents is ", response.data.data)
    window.open(response.data.data.value, '_blank')
    // return response.data.data.value;
  } catch (error) {
    console.error("Error fetching candidate documents", error);
    throw error;
  }
}

export const getSignatureDisplay = async (signature_path: string): Promise<string> => {
  try {
    const response = await axiosInstance.get("/signature/display", {
      params: { signature_path },
    });
    return response.data.data.signatureUrl;
  } catch (error) {
    console.error("Error fetching signature display URL:", error);
    throw error;
  }
};
