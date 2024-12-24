import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as UserService from "../../services/UserService";
import { useMutationHook } from "../../hooks/useMutationHook";
import { updateUser } from "../../redux/slides/userSlide";
import { useNavigate } from "react-router-dom";
import { getBase64 } from "../../utils";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/ReactToastify.min.css';

const ProfilePage = () => {

    const user = useSelector((state) => state.user);
    const [name, setName] = useState(user?.name);
    const [email, setEmail] = useState(user?.email);
    const [phone, setPhone] = useState(user?.phone);
    const [address, setAddress] = useState(user?.address);
    const [city, setCity] = useState(user?.city);
    const [avatar, setAvatar] = useState(user?.avatar);
    const [previewImage, setPreviewImage] = useState(null);

    const navigate = useNavigate();

    const mutation = useMutationHook(
        async (data) => {
            const { id, access_token, ...rests } = data;
            const res = await UserService.updateUser(id, rests, access_token);
            return res;
        }
    )

    const dispatch = useDispatch();
    const { data, isSuccess } = mutation;

    useEffect(() => {
        setName(user?.name);
        setEmail(user?.email);
        setPhone(user?.phone);
        setAddress(user?.address);
        setCity(user?.city);
        setAvatar(user?.avatar);
    }, [user]);

    useEffect(() => {
        if (isSuccess && data?.status === 'OK') {
            toast.success('Cập nhật thông tin thành công');
            handleGetDetailsUser(user?.id, user?.access_token);
        } else if (user?.access_token === '') {
            navigate('/');
        }
    }, [isSuccess, data, user, navigate]);

    const handleGetDetailsUser = async (id, token) => {
        const res = await UserService.getDetailsUser(id, token);
        dispatch(updateUser({ ...res?.data, access_token: token }));
    }

    const handleChangeName = (e) => {
        setName(e.target.value);
    }

    const handleChangeEmail = (e) => {
        setEmail(e.target.value);
    }

    const handleChangePhone = (e) => {
        setPhone(e.target.value);
    }

    const handleChangeAddress = (e) => {
        setAddress(e.target.value);
    }

    const handleChangeCity = (e) => {
        setCity(e.target.value);
    }

    const handleChangeAvatar = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const previewUrl = await getBase64(file);
            setPreviewImage(previewUrl);
            setAvatar(previewUrl);
        }
    };

    const handleUpdateUser = (e) => {
        e.preventDefault();
        mutation.mutate({ id: user?.id, name, email, phone, avatar, address, city, access_token: user?.access_token });
    }

    return (
        <div className="p-4 mx-32">
            <h1 className="mb-4 font-medium text-2xl">Thông tin người dùng</h1>
            <div className="flex min-h-full flex-1 flex-col items-center justify-center px-6 py-12 lg:px-8 border-solid border-2">
                <div className="space-y-4 w-full max-w-4xl">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Tên</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => handleChangeName(e)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => handleChangeEmail(e)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                        <input
                            type="tel"
                            id="phone"
                            value={phone}
                            onChange={(e) => handleChangePhone(e)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700">Địa chỉ</label>
                        <input
                            type="text"
                            id="address"
                            value={address}
                            onChange={(e) => handleChangeAddress(e)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700">Tỉnh/Thành phố</label>
                        <input
                            type="text"
                            id="city"
                            value={city}
                            onChange={(e) => handleChangeCity(e)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="avatar" className="block text-sm font-medium text-gray-700">Ảnh đại diện</label>
                        <input
                            type="file"
                            id="avatar"
                            onChange={(e) => handleChangeAvatar(e)}
                        />
                        {previewImage && <img src={previewImage} alt="Avatar" className="mt-5 w-96" />}
                    </div>

                    <div className="flex justify-end space-x-4">
                        <button
                            onClick={(e) => handleUpdateUser(e)}
                            className="px-4 py-2 bg-indigo-800 text-white rounded-lg hover:bg-indigo-700">Lưu thay đổi</button>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    )
}

export default ProfilePage;