import axiosInstance from "./axiosInstance";

export const verifyToken = async(token: string) => { 
    try {
        const response = await axiosInstance.get(`/offer/verify?token=${token}`);
        return response.data; // the response of this is the candidate details an like the poisition and name as well as the session that starts if it is successful 
    } catch (error) {
        return error;
    }
}

export const getOfferLetter = async () => { 
    try {
        const response = await axiosInstance.get(`/offer/details`);
        return response.data;
    } catch (error) {
        return error;
    }
}