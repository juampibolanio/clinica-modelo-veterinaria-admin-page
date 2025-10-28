import axiosInstance from "../../../libs/axios";

const BASE = "/api/users";

export const getAllUsers = async () => {
  const { data } = await axiosInstance.get(BASE);
  return data; // List<UserResponse>
};
