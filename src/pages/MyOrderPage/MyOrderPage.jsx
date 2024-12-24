import React, { useEffect, useState } from "react";
import * as OrderService from "../../services/OrderService";
import { formatPrice } from "../../utils";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { useMutationHook } from "../../hooks/useMutationHook";
import { ToastContainer, toast } from 'react-toastify';

const MyOrderPage = () => {
    const user = useSelector((state) => state.user);
    const [discount, setDiscount] = useState(0);

    const fetchAllOrder = async () => {
        const res = await OrderService.getOrder(user?.id, user?.access_token);
        return res.data;
    }

    const queryAllOrder = useQuery({ queryKey: ['orders'], queryFn: fetchAllOrder, enabled: !!(user?.id && user?.access_token) });
    const { data, refetch } = queryAllOrder;

    const mutation = useMutationHook(
        (data) => {
            const { id, access_token, order } = data;
            const res = OrderService.cancelOrder(id, access_token, order);
            return res;
        }
    );

    const handleCancelOrder = (order) => {
        mutation.mutate({ id: user?.id, access_token: user?.access_token, order }, {
            onSuccess: () => {
                toast.success("Hủy đơn hàng thành công");
                refetch();
            }
        });
    }

    useEffect(() => {
        if (data) {
            data?.forEach((order) => {
                if (order?.itemsPrice < 500000) {
                    setDiscount(0);
                } else if (order?.itemsPrice >= 500000 && order?.itemsPrice < 2000000) {
                    setDiscount(0.05);
                } else if (order?.itemsPrice >= 2000000) {
                    setDiscount(0.1);
                }
            });
        }
    }, [data]);

    return (
        <div className="bg-gray-100">
            <div className="mx-32 p-4 bg-white min-h-screen">
                <h1 className="text-2xl font-semibold mb-2">Lịch sử mua hàng</h1>
                {data?.map((order, index) => (
                    <div key={index} className="bg-white p-4 rounded-md shadow-lg my-4">

                        <div className="flex flex-col w-full">
                            <h1 className="font-bold">Ngày mua</h1>
                            <span>{new Date(order?.createdAt).toLocaleDateString('vi-VN', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                            })}</span>
                        </div>

                        <div className="flex flex-row gap-4 mt-4">
                            <div className="flex flex-col w-full">
                                <h1 className="font-bold">Địa chỉ giao hàng</h1>
                                <span>{order?.shippingAddress?.address}, {order?.shippingAddress?.city}</span>
                            </div>
                            <div className="flex flex-col w-full">
                                <h1 className="font-bold">Hình thức thanh toán</h1>
                                <span>{order?.paymentMethod}</span>
                                <span className="text-orange-500">{order?.isPaid ? `Đã thanh toán` : `Chưa thanh toán`}</span>
                            </div>
                            <div className="flex flex-col w-full">
                                <h2 className="font-semibold mb-2">Phương thức giao hàng</h2>
                                {order?.deliveryMethod === "fast" ? (
                                    <label className="flex items-center">
                                        <span className="font-semibold text-orange-500">FAST</span>
                                        <span className="ml-2"> Giao hàng nhanh</span>
                                    </label>
                                ) : (
                                    <label className="flex items-center">
                                        <span className="ml-2">
                                            <span className="font-semibold text-blue-500">GO_JEK</span>
                                            <span> Giao hàng tiết kiệm</span>
                                        </span>
                                    </label>
                                )}
                            </div>
                            <div className="flex flex-col w-full">
                                <h1 className="font-semibold">Trạng thái đơn hàng</h1>
                                <span className="text-blue-500">{order?.isDelivered ? `Đã giao hàng` : `Đang giao hàng`}</span>
                            </div>
                        </div>
                        <table className="w-full text-left mt-6">
                            <thead className="border-b">
                                <tr>
                                    <th className="py-3 w-[50%]">Tất cả sản phẩm</th>
                                    <th className="py-3 w-[20%] text-center">Đơn giá</th>
                                    <th className="py-3 w-[10%] text-center">Số lượng</th>
                                    <th className="py-3 w-[20%] text-center">Thành tiền</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order?.orderItems.map((item, index) => (
                                    <tr className="border-b" key={index}>
                                        <td className="p-4 flex items-center space-x-4 gap-2 w-auto">
                                            <img src={item?.image} alt="Product" className="w-10 h-10 rounded-md flex-shrink-0" />
                                            <span>{item?.name}</span>
                                        </td>
                                        <td className="py-4 text-center">
                                            <span className="text-red-500">
                                                {formatPrice(item?.price)}đ
                                            </span>
                                        </td>
                                        <td className="py-4 text-center">
                                            <span className="mx-2">{item?.amount}</span>
                                        </td>
                                        <td className="py-4 text-center">
                                            <span className="text-red-500">
                                                {formatPrice(item?.price * item?.amount)}đ
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="flex flex-col gap-1 mt-6 text-right">
                            <div className="flex flex-col w-full">
                                <h1 className="font-semibold text-red-400">Giảm giá</h1>
                                <span>{discount * 100}%</span>
                            </div>
                            <div className="flex flex-col w-full">
                                <h1 className="font-semibold text-red-400">Phí giao hàng</h1>
                                <span>{formatPrice(order?.shippingPrice)}đ</span>
                            </div>
                            <div className="flex flex-col w-full">
                                <h1 className="font-semibold text-red-400">Tổng tiền</h1>
                                <span>{formatPrice(order?.totalPrice)}đ</span>
                            </div>
                        </div>
                        {!order?.isPaid && (
                            <div className="w-full text-right">
                                <button
                                    onClick={() => handleCancelOrder(order)}
                                    className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 mt-4"
                                >
                                    Hủy đơn hàng
                                </button>
                                <ToastContainer />
                            </div>
                        )}
                    </div>
                ))}

            </div>
        </div>
    );
};

export default MyOrderPage;