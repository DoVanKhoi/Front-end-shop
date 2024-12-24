import React, { useEffect, useState } from "react";
import { useMutationHook } from "../../hooks/useMutationHook";
import * as UserService from "../../services/UserService";
import { getBase64 } from "../../utils";
import { useSelector } from "react-redux";

const UpdateUserComponent = (props) => {
    const { hideModalEdit, editId, refetchData } = props;
    const [isValid, setIsValid] = useState(false);
    const user = useSelector((state) => state.user);

    const [stateUser, setStateUser] = useState({
        name: '',
        email: '',
        phone: 0,
        address: '',
        city: '',
        avatar: '',
    });

    const fetchUserById = async (id, access_token) => {
        const res = await UserService.getDetailsUser(id, access_token);
        return res.data;
    }

    const mutation = useMutationHook(
        async (data) => {
            const { editId, stateUser, access_token } = data;
            const res = await UserService.updateUser(editId, stateUser, access_token);
            return res;
        }
    )

    const handleHideModalEdit = () => {
        hideModalEdit();
    }

    const handleChangeName = (e) => {
        setStateUser({ ...stateUser, name: e.target.value });
    }

    const handleChangeEmail = (e) => {
        setStateUser({ ...stateUser, email: e.target.value });
    }

    const handleChangePhone = (e) => {
        setStateUser({ ...stateUser, phone: e.target.value });
    }

    const handleChangeAddress = (e) => {
        setStateUser({ ...stateUser, address: e.target.value });
    }

    const handleChangeCity = (e) => {
        setStateUser({ ...stateUser, city: e.target.value });
    }

    const handleChangeAvatar = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const previewUrl = await getBase64(file);
            setStateUser({ ...stateUser, avatar: previewUrl });
        }
    };

    const handleUpdateUser = (e) => {
        e.preventDefault();
        if (!stateUser.name || !stateUser.email) {
            setIsValid(true);
        } else {
            setIsValid(false);
            mutation.mutate({ editId, stateUser, access_token: user?.access_token });
            hideModalEdit();
            refetchData();
        }
    }

    useEffect(() => {
        if (editId) {
            fetchUserById(editId, user?.access_token).then((res) => {
                setStateUser({
                    name: res.name,
                    email: res.email,
                    phone: res.phone || 0,
                    address: res.address || '',
                    city: res.city || '',
                    avatar: res.avatar || '',
                });
            });
        }
    }, [editId, user]);

    useEffect(() => {
        setIsValid(false);
    }, [stateUser]);

    return (
        <>
            {/* <!-- Modal content --> */}
            <div className="relative p-4 bg-white rounded-lg shadow">
                {/* <!-- Modal header --> */}
                <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5">
                    <h3 className="text-lg font-semibold text-gray-900">Cập nhật người dùng</h3>
                    <button
                        type="button"
                        onClick={() => handleHideModalEdit()}
                        className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                    >
                        <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        <span className="sr-only">Đóng</span>
                    </button>
                </div>
                {/* <!-- Modal body --> */}
                <form id="modal-add-product" action="#">
                    <div className="grid gap-4 mb-4 grid-cols-2">
                        <div>
                            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">Tên</label>
                            <input
                                id="name"
                                type="text"
                                name="name"
                                value={stateUser.name}
                                onChange={(e) => handleChangeName(e)}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                placeholder="User name"
                                autoComplete="off"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Email</label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={stateUser.email}
                                onChange={(e) => handleChangeEmail(e)}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                placeholder="Email"
                                autoComplete="off"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-900">Số điện thoại</label>
                            <input
                                id="phone"
                                type="number"
                                name="phone"
                                value={stateUser.phone}
                                onChange={(e) => handleChangePhone(e)}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                placeholder="Phone"
                                autoComplete="off"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="address" className="block mb-2 text-sm font-medium text-gray-900">Địa chỉ</label>
                            <input
                                id="address"
                                type="text"
                                name="address"
                                value={stateUser.address}
                                onChange={(e) => handleChangeAddress(e)}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                placeholder="Address"
                                autoComplete="off"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="city" className="block mb-2 text-sm font-medium text-gray-900">Thành phố</label>
                            <input
                                id="city"
                                type="text"
                                name="city"
                                value={stateUser.city}
                                onChange={(e) => handleChangeCity(e)}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                placeholder="City"
                                autoComplete="off"
                                required
                            />
                        </div>
                        <div className="flex items-center gap-4 col-span-2">
                            <div>
                                <label htmlFor="avatar" className="block text-sm font-medium text-gray-700 mb-2">Tải lên hình ảnh</label>
                                <input
                                    type="file"
                                    id="avatar"
                                    onChange={(e) => handleChangeAvatar(e)}
                                />
                            </div>
                            {stateUser.avatar && <img src={stateUser.avatar} alt="" className="max-w-60 max-h-48 object-cover rounded-lg" />}
                        </div>
                    </div>
                    <button
                        onClick={(e) => handleUpdateUser(e)}
                        className="text-white inline-flex items-center bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                        Cập nhật người dùng
                    </button>
                    {isValid && <p className="text-red-500 text-sm/6">Vui lòng điền đầy đủ</p>}
                </form>
            </div>
        </>
    );
}

export default UpdateUserComponent;