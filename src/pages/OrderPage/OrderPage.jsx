import React, { useEffect, useState } from "react";
import { MdDeleteOutline } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { addInforOrder, decreaseAmount, increaseAmount, removeAllOrderProduct, removeOrderProduct } from "../../redux/slides/orderSlide";
import { formatPrice } from "../../utils";
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";

const OrderPage = () => {
    const user = useSelector((state) => state.user);
    const order = useSelector((state) => state.order);
    const [listCheck, setListCheck] = useState([]);
    const [listPrice, setListPrice] = useState([]);
    const [temporaryTotalPrice, setTemporaryTotalPrice] = useState(0);
    const [deliveryFee, setDeliveryFee] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const [step, setStep] = useState(1);
    const dispatch = useDispatch();
    const naigate = useNavigate();

    const handleIncrease = (e) => {
        dispatch(increaseAmount(e.target.id));
    }

    const handleDecrease = (e) => {
        dispatch(decreaseAmount(e.target.id));
    }

    const handleDeleteOrder = (id) => {
        dispatch(removeOrderProduct(id));
    }

    const handleCheckbox = (e) => {
        if (listCheck.includes(e.target.value)) {
            const newList = listCheck.filter((item) => item !== e.target.value);
            setListCheck(newList);
        } else {
            setListCheck([...listCheck, e.target.value]);
        }
    }

    const handleAllCheckbox = (e) => {
        if (e.target.checked) {
            const newList = order?.orderItems?.map((item) => item?.product);
            setListCheck(newList);
        } else {
            setListCheck([]);
        }
    }

    const handleDeleteAll = () => {
        dispatch(removeAllOrderProduct({ idProducts: listCheck }));
    }

    const handleDeliveryFee = () => {
        if (temporaryTotalPrice === 0) {
            setDeliveryFee(0);
        } else if (temporaryTotalPrice > 0 && temporaryTotalPrice < 200000) {
            setDeliveryFee(30000);
        } else if (temporaryTotalPrice >= 200000 && temporaryTotalPrice < 1000000) {
            setDeliveryFee(50000);
        } else if (temporaryTotalPrice >= 1000000 && temporaryTotalPrice < 5000000) {
            setDeliveryFee(75000);
        } else if (temporaryTotalPrice >= 5000000 && temporaryTotalPrice < 10000000) {
            setDeliveryFee(100000);
        } else {
            setDeliveryFee(150000);
        }
    }

    const handleDiscount = () => {
        if (temporaryTotalPrice < 500000) {
            setDiscount(0);
            setStep(1);
        } else if (temporaryTotalPrice >= 500000 && temporaryTotalPrice < 2000000) {
            setDiscount(0.05);
            setStep(2);
        } else if (temporaryTotalPrice >= 2000000) {
            setDiscount(0.1);
            setStep(3);
        }
    }

    const handleOrder = () => {
        if (order?.orderItems?.length === 0) {
            toast.warn("Vui lòng chọn sản phẩm trước khi mua hàng");
        } else if (!user?.name || !user?.phone || !user?.address || !user?.city) {
            toast.warn("Vui lòng cập nhật thông tin cá nhân trước khi mua hàng");
        } else {
            dispatch(addInforOrder({
                name: user?.name,
                phone: user?.phone,
                address: user?.address,
                city: user?.city,
                itemsPrice: temporaryTotalPrice,
                shippingPrice: deliveryFee,
                totalPrice: totalPrice,
                user: user?.id,
            }));
            naigate('/payment');
        }
    }

    useEffect(() => {
        if (order?.orderItems?.length > 0) {
            const listPrices = order?.orderItems?.map((item) => item?.price * item?.amount);
            setListPrice(listPrices);
        } else {
            setListPrice([]);
        }
    }, [listCheck, order]);

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


    return (
        <div className="bg-gray-100">
            <div className="mx-32 p-4 bg-white min-h-screen">
                <h1 className="text-2xl font-semibold mb-2">Giỏ hàng</h1>
                <div className="flex flex-row gap-4">
                    <div className="bg-white p-4 rounded-md shadow-md basis-3/4">
                        {/* Step bar */}
                        <div className="flex items-center justify-between mb-8">
                            {/* Step 1 */}
                            <div className="flex flex-col items-center">
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${step >= 1 ? "bg-blue-600" : "bg-gray-300"
                                        }`}
                                >
                                    1
                                </div>
                                <span
                                    className={`text-sm font-medium text-nowrap ${step >= 1 ? "text-blue-600" : "text-gray-400"
                                        }`}
                                >
                                    Dưới 500.000đ
                                </span>
                                <span
                                    className={`text-sm font-medium text-nowrap ${step >= 1 ? "text-blue-600" : "text-gray-400"
                                        }`}
                                >
                                    Giảm 0%
                                </span>
                            </div>

                            <div
                                className={`w-full h-1 mx-4 ${step >= 2 ? "bg-blue-600" : "bg-gray-300"
                                    }`}
                            ></div>

                            {/* Step 2 */}
                            <div className="flex flex-col items-center">
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${step >= 2 ? "bg-blue-600" : "bg-gray-300"
                                        }`}
                                >
                                    2
                                </div>
                                <span
                                    className={`text-sm font-medium text-nowrap ${step >= 2 ? "text-blue-600" : "text-gray-400"
                                        }`}
                                >
                                    Từ 500.000đ đến
                                </span>
                                <span
                                    className={`text-sm font-medium text-nowrap ${step >= 2 ? "text-blue-600" : "text-gray-400"
                                        }`}
                                >
                                    dưới 2.000.000đ
                                </span>
                                <span
                                    className={`text-sm font-medium text-nowrap ${step >= 2 ? "text-blue-600" : "text-gray-400"
                                        }`}
                                >
                                    Giảm 5%
                                </span>
                            </div>

                            <div
                                className={`w-full h-1 mx-4 ${step === 3 ? "bg-blue-600" : "bg-gray-300"
                                    }`}
                            ></div>

                            {/* Step 3 */}
                            <div className="flex flex-col items-center">
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${step === 3 ? "bg-blue-600" : "bg-gray-300"
                                        }`}
                                >
                                    3
                                </div>
                                <span
                                    className={`text-sm font-medium text-nowrap ${step === 3 ? "text-blue-600" : "text-gray-400"
                                        }`}
                                >
                                    Trên 2.000.000đ
                                </span>
                                <span
                                    className={`text-sm font-medium text-nowrap ${step >= 3 ? "text-blue-600" : "text-gray-400"
                                        }`}
                                >
                                    Giảm 10%
                                </span>
                            </div>
                        </div>
                        {/* Table product */}
                        <table className="w-full text-left">
                            <thead className="border-b">
                                <tr>
                                    <th className="py-3">
                                        <input
                                            id="checkAll"
                                            type="checkbox"
                                            className="form-checkbox"
                                            onChange={(e) => handleAllCheckbox(e)}
                                            checked={listCheck.length === order?.orderItems?.length}
                                        />
                                    </th>
                                    <th className="py-3 w-96">Tất cả ({order?.orderItems?.length} sản phẩm)</th>
                                    <th className="py-3">Đơn giá</th>
                                    <th className="py-3">Số lượng</th>
                                    <th className="py-3">Thành tiền</th>
                                    <th className="py-3">
                                        <button onClick={() => handleDeleteAll()}>
                                            <MdDeleteOutline className="size-4" />
                                        </button>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {order?.orderItems?.map((item) => (
                                    <tr className="border-b" key={item?.product}>
                                        <td className="py-4">
                                            <input
                                                id={item?.product}
                                                type="checkbox"
                                                className="form-checkbox"
                                                value={item?.product}
                                                onChange={(e) => handleCheckbox(e)}
                                                checked={listCheck.includes(item?.product)}
                                            />
                                        </td>
                                        <td className="p-4 flex items-center space-x-4 gap-2 w-96">
                                            <img src={item?.image} alt="Product" className="w-10 h-10 rounded-md flex-shrink-0" />
                                            <span className="truncate block">{item?.name}</span>
                                        </td>
                                        <td className="py-4">
                                            <span className="text-red-500 ml-2">{formatPrice(item?.price)}đ</span>
                                        </td>
                                        <td className="py-4">
                                            <div className="flex items-center">
                                                <button
                                                    id={item?.product}
                                                    className="items-center rounded-md size-8 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                                                    aria-label="Decrement value"
                                                    onClick={(e) => handleDecrease(e)}
                                                >
                                                    -
                                                </button>
                                                <span className="mx-2">{item?.amount}</span>
                                                <button
                                                    id={item?.product}
                                                    className="items-center rounded-md size-8 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                                                    aria-label="Increment value"
                                                    onClick={(e) => handleIncrease(e)}
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </td>
                                        <td className="py-4 text-red-500">{formatPrice(item?.price * item?.amount)}đ</td>
                                        <td className="py-4 text-gray-400"><button onClick={() => handleDeleteOrder(item?.product)}><MdDeleteOutline className="size-4" /></button></td>
                                    </tr>
                                ))}

                            </tbody>
                        </table>
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
                                <span>{formatPrice(deliveryFee)}đ</span>
                            </div>
                            <div className="flex justify-between font-semibold text-xl mt-4">
                                <span>Tổng tiền</span>
                                <span className="text-red-500">{formatPrice(totalPrice)}đ</span>
                            </div>
                            <ToastContainer />
                            <div className="flex justify-center mt-4">
                                <button
                                    onClick={() => handleOrder()}
                                    className="bg-red-500 text-white px-6 py-3 rounded-md text-lg"
                                >
                                    Đặt hàng
                                </button>
                            </div>
                        </div>


                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderPage;