import { instance } from "../utils/axios";

export const getConfig = async () => {
    const res = await instance.get(`/payment/config`);
    return res.data;
}