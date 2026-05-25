import AxiosInstance from "./AxiosInstance";

export interface StoreUserPayload {
  first_name: string;
  middle_name: string;
  last_name: string;
  suffix_name: string;
  gender_id: number;
  birth_date: string;
  username: string;
  password: string;
  password_confirmation: string;
  profile_picture?: File | null;
}

export interface UpdateUserPayload {
  first_name: string;
  middle_name: string;
  last_name: string;
  suffix_name: string;
  gender_id: number;
  birth_date: string;
  username: string;
  profile_picture?: File | null;
  remove_profile_picture?: boolean;
}

const UserService = {
  loadUsers: async (page = 1, search = "") =>
    AxiosInstance.get(`/user/loadUsers?page=${page}&search=${encodeURIComponent(search)}`),
  getUser: async (userId: number) => AxiosInstance.get(`/user/getUser/${userId}`),
  storeUser: async (payload: StoreUserPayload) => {
    const formData = new FormData();

    formData.append("first_name", payload.first_name);
    formData.append("middle_name", payload.middle_name);
    formData.append("last_name", payload.last_name);
    formData.append("suffix_name", payload.suffix_name);
    formData.append("gender_id", String(payload.gender_id));
    formData.append("birth_date", payload.birth_date);
    formData.append("username", payload.username);
    formData.append("password", payload.password);
    formData.append("password_confirmation", payload.password_confirmation);

    if (payload.profile_picture) {
      formData.append("profile_picture", payload.profile_picture);
    }

    return AxiosInstance.post("/user/storeUser", formData);
  },
  updateUser: async (userId: number, payload: UpdateUserPayload) => {
    const formData = new FormData();

    formData.append("first_name", payload.first_name);
    formData.append("middle_name", payload.middle_name);
    formData.append("last_name", payload.last_name);
    formData.append("suffix_name", payload.suffix_name);
    formData.append("gender_id", String(payload.gender_id));
    formData.append("birth_date", payload.birth_date);
    formData.append("username", payload.username);
    formData.append("_method", "PUT");
    formData.append("remove_profile_picture", payload.remove_profile_picture ? "1" : "0");

    if (payload.profile_picture) {
      formData.append("profile_picture", payload.profile_picture);
    }

    return AxiosInstance.post(`/user/updateUser/${userId}`, formData);
  },
  deleteUser: async (userId: number) => AxiosInstance.delete(`/user/deleteUser/${userId}`),
};

export default UserService;
