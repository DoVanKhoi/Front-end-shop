import React from "react";
import { formatPrice } from "../../utils";
import { useLocation } from "react-router-dom";

const OrderSuccessPage = () => {
    const location = useLocation();

    return (
        <div className="bg-gray-100">
            <div className="mx-32 p-4 bg-white min-h-screen">
                <h1 className="text-2xl font-semibold mb-2">Thông tin đơn hàng</h1>

                <div className="bg-white p-4 rounded-md shadow-md">
                    <div className="flex flex-row gap-4">
                        <div className="bg-white p-4 rounded shadow w-full">
                            <h2 className="font-semibold mb-2">Phương thức giao hàng</h2>
                            {location?.state?.delivery === "fast" ? (
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
                        <div className="bg-white p-4 rounded shadow w-full">
                            <h2 className="font-semibold mb-2">Phương thức thanh toán</h2>
                            {location?.state?.payment === "cash" ? (
                                <label className="flex items-center">
                                    <span>Thanh toán tiền mặt khi nhận hàng</span>
                                </label>
                            ) : (
                                <label className="flex items-center">
                                    <span>Thanh toán online bằng thẻ tín dụng</span>
                                </label>
                            )}
                        </div>
                    </div>
                    <table className="w-full text-left">
                        <thead className="border-b">
                            <tr>
                                <th className="py-3 w-[50%]">Tất cả sản phẩm</th>
                                <th className="py-3 w-[20%] text-center">Đơn giá</th>
                                <th className="py-3 w-[10%] text-center">Số lượng</th>
                                <th className="py-3 w-[20%] text-center">Thành tiền</th>
                            </tr>
                        </thead>
                        <tbody>
                            {location?.state?.orders?.map((item) => (
                                <tr className="border-b" key={item?.product}>
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
                    <div className="mt-4 bg-white p-4 rounded shadow w-full text-right">
                        <h2 className="font-semibold mb-2">
                            Phí vận chuyển: <span className="font-normal">{formatPrice(location?.state?.deliveryFee)}đ</span>
                        </h2>
                        <h2 className="font-semibold mb-2">
                            Giảm giá: <span className="font-normal">{formatPrice(location?.state?.discount * 100)}%</span>
                        </h2>
                        <h2 className="font-semibold mb-2 text-red-500">
                            Tổng cộng: <span className="font-normal">{formatPrice(location?.state?.totalPrice)}đ</span>
                        </h2>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccessPage;