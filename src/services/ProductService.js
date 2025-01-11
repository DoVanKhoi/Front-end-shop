import { instance } from "../utils/axios";

export const getAllProduct = async () => {
    const res = await instance.get(`/product/get-all`);
    return res.data;
};

export const getProductById = async (id) => {
    const res = await instance.get(`/product/details/${id}`);
    return res.data;
}

export const createProduct = async (data) => {
    const res = await instance.post(`/product/create`, data);
    return res.data;
};

export const updateProduct = async (id, data, access_token) => {
    const res = await instance.put(`/product/update/${id}`, data, {
        headers: {
            token: `Bearer ${access_token}`
        }
    });
    return res.data;
};

export const deleteProduct = async (id) => {
    const res = await instance.delete(`/product/delete/${id}`);
    return res.data;
};