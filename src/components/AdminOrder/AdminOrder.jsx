import React, { useEffect, useState } from "react";
import * as OrderService from "../../services/OrderService";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { formatPrice } from "../../utils";
import { useMutationHook } from "../../hooks/useMutationHook";

const AdminOrder = () => {
    const user = useSelector((state) => state.user);
    const [orders, setOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedMonth, setSelectedMonth] = useState("");
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [idUpdate, setIdUpdate] = useState("");
    const [isShowModalConfirm, setIsShowModalConfirm] = useState(false);

    const fetchOrderAll = async (access_token) => {
        const res = await OrderService.getAllOrder(access_token);
        return res.data;
    }

    const queryAllOrder = useQuery({ queryKey: ['orders'], queryFn: () => fetchOrderAll(user?.access_token) });
    const { data, refetch } = queryAllOrder;

    const mutation = useMutationHook(
        async (id) => {
            const res = await OrderService.updateOrder(id);
            return res;
        }
    )

    useEffect(() => {
        if (data) {
            setOrders(data);
        }
    }, [data]);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    }

    const handleMonthChange = (e) => {
        setSelectedMonth(e.target.value);
    };

    const handleUpdateOrder = (e) => {
        setIdUpdate(e.target.id);
        setIsShowModalConfirm(true);
    }

    const hideModalConfirm = () => {
        setIsShowModalConfirm(false);
    }

    const handleConfirmUpdate = async (e) => {
        e.preventDefault();
        mutation.mutate(idUpdate, {
            onSettled: () => {
                refetch();
            }
        });
        hideModalConfirm();
    }

    useEffect(() => {
        const filteredOrders = () => {
            return orders.filter((order) => {
                const matchesSearch = order?.shippingAddress?.name?.toLowerCase().includes(searchTerm.toLowerCase());
                const matchesMonth = selectedMonth ? new Date(order?.createdAt).getMonth() + 1 === parseInt(selectedMonth) : true;
                return matchesSearch && matchesMonth;
            });

        };
        setFilteredOrders(filteredOrders());
    }, [orders, searchTerm, selectedMonth]);

    useEffect(() => {
        if (isShowModalConfirm) {
            document.getElementById('confirmUpdateModal').classList.remove('hidden');
        } else {
            document.getElementById('confirmUpdateModal').classList.add('hidden');
        }
    }, [isShowModalConfirm]);

    return (
        <div className="p-4">
            <h1 className="text-center text-4xl font-semibold">Quản lý đơn hàng</h1>
            <div className="mt-10 mx-4 h-fit">
                <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
                    <div className="w-full md:w-1/2">
                        <form id="search-user" className="flex items-center">
                            <label htmlFor="simple-search" className="sr-only">Tìm kiếm</label>
                            <div className="relative w-full">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <svg aria-hidden="true" className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    id="simple-search"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2"
                                    placeholder="Tìm kiếm người dùng"
                                    value={searchTerm}
                                    onChange={(e) => handleSearch(e)}
                                    required=""
                                />
                            </div>
                        </form>
                    </div>
                    <div className="w-full md:w-1/4">
                        <select
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2"
                            value={selectedMonth}
                            onChange={(e) => handleMonthChange(e)}
                        >
                            <option value="">Tất cả các tháng</option>
                            {[...Array(12).keys()].map(month => (
                                <option key={month + 1} value={month + 1}>
                                    Tháng {month + 1}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* <!-- Table --> */}
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <table className="w-full text-sm text-left text-gray-500 ">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    Tên khách hàng
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Sản phẩm đã mua
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Tổng tiền
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Hình thức thanh toán
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Đã thanh toán
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Trạng thái đơn hàng
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.map((order) => (
                                <tr key={order?._id} className="odd:bg-white even:bg-gray-50 border-b">
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                        {order?.shippingAddress?.name}
                                    </th>
                                    <td className="px-6 py-4">
                                        {order?.orderItems?.map((item) => (
                                            <div key={item?._id} className="flex flex-col">
                                                <p className="ml-2">{item?.name}</p>
                                            </div>
                                        ))}
                                    </td>
                                    <td className="px-6 py-4">
                                        {formatPrice(order?.totalPrice)}
                                    </td>
                                    <td className="px-6 py-4">
                                        {order?.paymentMethod === 'Thanh toán online bằng thẻ tín dụng' ? 'Paypal' : 'Tiền mặt'}
                                    </td>
                                    <td className="px-6 py-4">
                                        {order?.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}
                                    </td>
                                    <td className="flex items-center px-6 py-4">
                                        {order?.isDelivered ? 'Đã giao hàng' : 'Chưa giao hàng'}
                                        {order?.isDelivered ? '✓' : (
                                            <button
                                                id={order?._id}
                                                className="ml-4 bg-primary-500 text-white px-4 py-2 rounded-lg"
                                                onClick={(e) => handleUpdateOrder(e)}
                                            >
                                                Xác nhận giao hàng
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal confirm order */}
            <div id="confirmUpdateModal" tabIndex="-1" className="hidden overflow-y-auto overflow-x-hidden bg-gray-900 bg-opacity-50 fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 max-h-full h-screen">
                <div className="relative left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 p-4 max-w-2xl">
                    <div className="relative p-4 bg-white rounded-lg shadow">
                        <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5">
                            <h3 className="text-lg font-semibold text-gray-900">Xác nhận giao hàng</h3>
                            <button
                                type="button"
                                onClick={() => hideModalConfirm()}
                                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                            >
                                <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                        </div>
                        <div>
                            <p className="text-gray-700 text-sm">Bạn có chắc là đơn hàng này đã thanh toán và được giao không?</p>
                            <div className="mt-4 flex justify-end space-x-3">
                                <button
                                    type="button"
                                    id={idUpdate}
                                    onClick={(e) => handleConfirmUpdate(e)}
                                    className="text-white bg-primary-700 hover:bg-primary-800 rounded-lg text-sm p-1.5"
                                >
                                    Xác nhận
                                </button>
                                <button
                                    type="button"
                                    onClick={() => hideModalConfirm()}
                                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5"
                                >
                                    Hủy
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminOrder;