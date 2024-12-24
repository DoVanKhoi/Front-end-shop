import axios from "axios";

export const axiosJWT = axios.create();

export const createOrder = async (id, access_token, data) => {
    const res = await axiosJWT.post(`${process.env.REACT_APP_API_URL}/order/create/${id}`, data, {
        headers: {
            token: `Bearer ${access_token}`
        }
    });
    return res.data;
}

export const getOrder = async (id, access_token) => {
    const res = await axiosJWT.get(`${process.env.REACT_APP_API_URL}/order/get-all-order/${id}`, {
        headers: {
            token: `Bearer ${access_token}`
        }
    });
    return res.data;
}

export const cancelOrder = async (id, access_token, order) => {
    const res = await axiosJWT.delete(`${process.env.REACT_APP_API_URL}/order/delete-order/${id}`, {
        headers: {
            token: `Bearer ${access_token}`
        },
        data: order
    });
    return res.data;
}