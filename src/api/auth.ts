import api from "@/lib/axios";

export const registerUser = async ({
  name,
  email,
  password,
}: {
  name: string;
  email: string;
  password: string;
}) => {
  try {
    const response = await api.post("/auth/register", {
      name,
      email,
      password,
    });
    return response.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || "Registration failed");
  }
};

export const loginUser = async (credentials: {
  email: string;
  password: string;
}) => {
  try {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || "Login failed");
  }
};

export const logoutUser = async () => {
  try {
    await api.post("/auth/logout");
    return true;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || "Logout failed");
  }
};

export const refreshAccessToken = async () => {
  try {
    const response = await api.post("/auth/refresh");
    return response.data;
  } catch (err: any) {
    throw new Error(
      err.response?.data?.message || "Failed to refresh accesstoken",
    );
  }
};
