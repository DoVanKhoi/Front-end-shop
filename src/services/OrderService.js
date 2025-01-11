import { instance } from '../utils/axios';

export const createOrder = async (id, access_token, data) => {
    const res = await instance.post(`/order/create/${id}`, data, {
        headers: {
            token: `Bearer ${access_token}`
        }
    });
    return res.data;
}

export const getOrder = async (id, access_token) => {
    const res = await instance.get(`/order/get-all-order/${id}`, {
        headers: {
            token: `Bearer ${access_token}`
        }
    });
    return res.data;
}

export const cancelOrder = async (id, access_token, order) => {
    const res = await instance.delete(`/order/delete-order/${id}`, {
        headers: {
            token: `Bearer ${access_token}`
        },
        data: order
    });
    return res.data;
}

export const getAllOrder = async (access_token) => {
    const res = await instance.get(`/order/get-all-history-order`, {
        headers: {
            token: `Bearer ${access_token}`
        }
    });
    return res.data;
}

export const updateOrder = async (id) => {
    const res = await instance.put(`/order/update-order/${id}`);
    return res.data;
}