import { instance } from "../utils/axios";
import axios from "axios";

export const axiosJWT = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    timeout: 10000,
    headers: {
        "ngrok-skip-browser-warning": true,
    },
});

export const loginUser = async (data) => {
    const res = await instance.post(`/user/sign-in`, data);
    return res.data;
};

export const registerUser = async (data) => {
    const res = await instance.post(`/user/sign-up`, data);
    return res.data;
};

export const getAllUser = async (access_token) => {
    const res = await axiosJWT.get(`/user/getAll`, {
        headers: {
            token: `Bearer ${access_token}`
        }
    });
    return res.data;
};

export const getDetailsUser = async (id, access_token) => {
    const res = await axiosJWT.get(`/user/getDetails/${id}`, {
        headers: {
            token: `Bearer ${access_token}`
        }
    });
    return res.data;
};

export const refresh_token = async (refresh_token) => {
    const res = await instance.post(`/user/refresh-token`, {
        headers: {
            token: `Bearer ${refresh_token}`
        }
    });
    return res.data;
};

export const logoutUser = async () => {
    const res = await instance.post(`/user/log-out`);
    return res.data;
};

export const updateUser = async (id, data, access_token) => {
    const res = await axiosJWT.put(`/user/update-user/${id}`, data, {
        headers: {
            token: `Bearer ${access_token}`
        }
    });
    return res.data;
};

export const deleteUser = async (id, access_token) => {
    const res = await axiosJWT.delete(`/user/delete-user/${id}`, {
        headers: {
            token: `Bearer ${access_token}`
        }
    });
    return res.data;
}