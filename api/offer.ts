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
      payload
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
      }
    );
    return response.data;
  } catch (error) {
    return error;
  }
};
