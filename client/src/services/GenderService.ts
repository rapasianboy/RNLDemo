import AxiosInstance from "./AxiosInstance";

interface GenderPayload {
  gender: string;
}

const GenderService = {
  loadGenders: async () => AxiosInstance.get("/gender/loadGenders"),

  storeGender: async (data: GenderPayload) => AxiosInstance.post("/gender/storeGender", data),

  getGender: async (genderId: string | number) => AxiosInstance.get(`/gender/getGender/${genderId}`),

  updateGender: async (genderId: string | number, data: GenderPayload) =>
    AxiosInstance.put(`/gender/updateGender/${genderId}`, data),

  deleteGender: async (genderId: string | number) => AxiosInstance.delete(`/gender/deleteGender/${genderId}`)
};

export default GenderService;