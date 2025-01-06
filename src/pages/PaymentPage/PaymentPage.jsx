import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { formatPrice } from "../../utils";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/ReactToastify.min.css';
import { useMutationHook } from "../../hooks/useMutationHook";
import * as OrderService from "../../services/OrderService";
import * as PaymentService from "../../services/PaymentService";
import { useNavigate } from "react-router-dom";
import { clearAllOrderProduct } from "../../redux/slides/orderSlide";
import { PayPalButton } from "react-paypal-button-v2";

const OrderPage = () => {
    const user = useSelector((state) => state.user);
    const order = useSelector((state) => state.order);
    const [listPrice, setListPrice] = useState([]);
    const [temporaryTotalPrice, setTemporaryTotalPrice] = useState(0);
    const [deliveryFee, setDeliveryFee] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const [delivery, setDelivery] = useState("fast");
    const [payment, setPayment] = useState("cash");
    const [sdkReady, setSdkReady] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const mutation = useMutationHook(
        async (data) => {
            const { userId, access_token, ...rest } = data;
            const res = await OrderService.createOrder(userId, access_token, rest);
            return res;
        }
    )

    const handleDeliveryFee = () => {
        let fee = 0;
        if (temporaryTotalPrice === 0) {
            fee = 0;
        } else if (temporaryTotalPrice > 0 && temporaryTotalPrice < 200000) {
            fee = 30000;
        } else if (temporaryTotalPrice >= 200000 && temporaryTotalPrice < 1000000) {
            fee = 50000;
        } else if (temporaryTotalPrice >= 1000000 && temporaryTotalPrice < 5000000) {
            fee = 75000;
        } else if (temporaryTotalPrice >= 5000000 && temporaryTotalPrice < 10000000) {
            fee = 100000;
        } else {
            fee = 150000;
        }
        if (delivery === "gojek") {
            fee = fee / 2;
        }
        setDeliveryFee(fee);
    }

    useEffect(() => {
        handleDeliveryFee();
    }, [temporaryTotalPrice, delivery]);

    const handleDiscount = () => {
        if (temporaryTotalPrice < 500000) {
            setDiscount(0);
        } else if (temporaryTotalPrice >= 500000 && temporaryTotalPrice < 2000000) {
            setDiscount(0.05);
        } else if (temporaryTotalPrice >= 2000000) {
            setDiscount(0.10);
        }
    }

    const handleChangeDelivery = (e) => {
        setDelivery(e.target.value);
    }

    const handleChangePayment = (e) => {
        setPayment(e.target.value);
    }

    const handleBuy = () => {
        if (user?.access_token && order?.shippingAddress && order?.orderItems?.length > 0) {
            mutation.mutate({
                userId: user?.id,
                shippingAddress: order?.shippingAddress,
                paymentMethod: `${payment === "cash" ? "Thanh toán tiền mặt khi nhận hàng" : "Thanh toán online bằng thẻ tín dụng"}`,
                itemsPrice: temporaryTotalPrice,
                shippingPrice: deliveryFee,
                totalPrice: totalPrice,
                user: user?.id,
                orderItems: order?.orderItems,
                access_token: user?.access_token,
                isPaid: false,
                deliveryMethod: delivery,
                email: user?.email
            }, {
                onSuccess: () => {
                    toast.success("Đặt hàng thành công");
                }
            });
            navigate("/order-success", {
                state: {
                    orders: order?.orderItems,
                    totalPrice: totalPrice,
                    deliveryFee: deliveryFee,
                    discount: discount,
                    temporaryTotalPrice: temporaryTotalPrice,
                    delivery: delivery,
                    payment: payment
                }
            });
            dispatch(clearAllOrderProduct());
        }
    }

    const onSuccessPayment = (details, data) => {
        if (user?.access_token && order?.shippingAddress && order?.orderItems?.length > 0) {
            mutation.mutate({
                userId: user?.id,
                shippingAddress: order?.shippingAddress,
                paymentMethod: `${payment === "cash" ? "Thanh toán tiền mặt khi nhận hàng" : "Thanh toán online bằng thẻ tín dụng"}`,
                itemsPrice: temporaryTotalPrice,
                shippingPrice: deliveryFee,
                totalPrice: totalPrice,
                user: user?.id,
                orderItems: order?.orderItems,
                access_token: user?.access_token,
                isPaid: true,
                paidAt: details.update_time,
                deliveryMethod: delivery,
                email: user?.email
            }, {
                onSuccess: () => {
                    toast.success("Đặt hàng thành công");
                }
            });
            navigate("/order-success", {
                state: {
                    orders: order?.orderItems,
                    totalPrice: totalPrice,
                    deliveryFee: deliveryFee,
                    discount: discount,
                    temporaryTotalPrice: temporaryTotalPrice,
                    delivery: delivery,
                    payment: payment
                }
            });
            dispatch(clearAllOrderProduct());
        }
    }

    useEffect(() => {
        if (order?.orderItems?.length > 0) {
            const listPrices = order?.orderItems?.map((item) => item?.price * item?.amount);
            setListPrice(listPrices);
        } else {
            setListPrice([]);
        }
    }, [order]);

    useEffect(() => {
        if (listPrice.length > 0) {
            const total = listPrice.reduce((a, b) => a + b);
            setTemporaryTotalPrice(total);
        } else {
            setTemporaryTotalPrice(0);
        }
    }, [listPrice]);

    useEffect(() => {
        handleDeliveryFee();
        handleDiscount();
        setTotalPrice(temporaryTotalPrice * (1 - discount) + deliveryFee);
    }, [temporaryTotalPrice, discount, deliveryFee]);

    const addPaypalScript = async () => {
        const { data } = await PaymentService.getConfig();
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.src = `https://www.paypal.com/sdk/js?client-id=${data}`;
        script.async = true;
        script.onload = () => {
            setSdkReady(true);
        };
        document.body.appendChild(script);
    };

    useEffect(() => {
        if (!window.paypal) {
            addPaypalScript();
        } else {
            setSdkReady(true);
        }
    }, []);

    return (
        <div className="bg-gray-100">
            <div className="mx-32 p-4 bg-white min-h-screen">
                <h1 className="text-2xl font-semibold mb-2">Thanh toán</h1>
                <div className="flex flex-row gap-4">
                    <div className="bg-white p-4 rounded-md shadow-md basis-3/4">
                        <div className="mb-6 bg-white p-4 rounded shadow">
                            <h2 className="font-semibold mb-2">Chọn phương thức giao hàng</h2>
                            <div className="space-y-2">
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="radio"
                                        name="shipping"
                                        className="form-radio text-blue-600"
                                        value="fast"
                                        onChange={(e) => handleChangeDelivery(e)}
                                        defaultChecked
                                    />
                                    <span className="ml-2">
                                        <span className="font-semibold text-orange-500">FAST</span>
                                        <span> Giao hàng nhanh</span>
                                    </span>
                                </label>

                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="radio"
                                        name="shipping"
                                        className="form-radio text-blue-600"
                                        value="gojek"
                                        onChange={(e) => handleChangeDelivery(e)}
                                    />
                                    <span className="ml-2">
                                        <span className="font-semibold text-blue-500">GO_JEK</span>
                                        <span> Giao hàng tiết kiệm (<strong className="text-red-500"> giảm 50% phí vận chuyển </strong>)</span>
                                    </span>
                                </label>
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded shadow">
                            <div className="space-y-2">
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="radio"
                                        name="payment"
                                        className="form-radio text-blue-600"
                                        value="cash"
                                        onChange={(e) => handleChangePayment(e)}
                                        defaultChecked
                                    />
                                    <span className="ml-2">
                                        <span>Thanh toán tiền mặt khi nhận hàng</span>
                                    </span>
                                </label>

                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="radio"
                                        name="payment"
                                        className="form-radio text-blue-600"
                                        value="paypal"
                                        onChange={(e) => handleChangePayment(e)}
                                    />
                                    <span className="ml-2">
                                        <span>Thanh toán online bằng paypal</span>
                                    </span>
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className=" flex flex-col  basis-1/4">

                        <div className="bg-white p-4 rounded-md shadow-md">
                            <div className="flex justify-between border-b pb-2">
                                <span>Giao đến: </span>
                                <p className="text-gray-400">{user?.address}, {user?.city}</p>
                            </div>
                            <div className="flex justify-between border-b pb-2">
                                <span>Tạm tính</span>
                                <span>{formatPrice(temporaryTotalPrice)}đ</span>
                            </div>
                            <div className="flex justify-between border-b py-2">
                                <span>Giảm giá</span>
                                <span>{discount * 100}%</span>
                            </div>
                            <div className="flex justify-between border-b py-2">
                                <span>Phí giao hàng</span>
                                {delivery === "gojek" ? (
                                    <span className="text-red-500">{formatPrice(deliveryFee)}đ</span>
                                ) : (
                                    <span>{formatPrice(deliveryFee)}đ</span>
                                )}
                            </div>
                            <div className="flex justify-between font-semibold text-xl mt-4">
                                <span>Tổng tiền</span>
                                <span className="text-red-500">{formatPrice(totalPrice)}đ</span>
                            </div>
                            <ToastContainer />
                            <div className="justify-center mt-4 w-full">
                                {payment === "paypal" && sdkReady ? (
                                    <PayPalButton
                                        amount={totalPrice > 0 ? (totalPrice / 23000).toFixed(2) : 0}
                                        // shippingPreference="NO_SHIPPING" // default is "GET_FROM_FILE"
                                        onSuccess={(details, data) => onSuccessPayment(details, data)}
                                        onError={() => {
                                            toast.error("Đặt hàng thất bại");
                                        }}
                                    />
                                ) : (
                                    <button
                                        onClick={() => handleBuy()}
                                        className="bg-red-500 text-white px-6 py-3 rounded-md text-lg w-full"
                                    >
                                        Đặt hàng
                                    </button>
                                )}
                            </div>
                        </div>


                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderPage;