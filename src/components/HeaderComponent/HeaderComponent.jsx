import React, { useEffect, useState } from "react";
import { CiUser, CiShoppingCart } from "react-icons/ci";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import * as UserService from "../../services/UserService";
import { resetUser } from "../../redux/slides/userSlide";
import { searchProduct, filterProduct } from "../../redux/slides/productSlide";


const HeaderComponent = () => {

    const user = useSelector((state) => state.user);
    const order = useSelector((state) => state.order);
    const [userName, setUserName] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogo = () => {
        navigate('/');
        dispatch(searchProduct(''));
        dispatch(filterProduct(''));
    }

    const handleNavigateLogin = () => {
        navigate('/sign-in');
    }

    const handleCart = () => {
        if (!user?.access_token) {
            navigate('/sign-in');
        } else {
            navigate('/order');
        }
    }

    const handleLogout = async () => {
        await UserService.logoutUser();
        localStorage.removeItem('access_token');
        dispatch(resetUser());
    }

    const handleSearch = () => {
        dispatch(searchProduct(searchTerm));
    }

    useEffect(() => {
        setUserName(user?.name);
        setIsAdmin(user?.isAdmin);
    }, [user]);

    return (
        <div>
            <div className="p-4 lg:mx-32 md:mx-16 sm:mx-8 bg-white flex flex-row items-center justify-between border-b-slate-700">
                <div className="flex items-center">
                    <h1
                        className="lg:text-[30px] md:text-[20px] sm:text-[10px] uppercase font-bold text-blue-600 cursor-pointer"
                        onClick={() => handleLogo()}
                    >Đồ Gia Dụng</h1>
                </div>
                <div className="flex items-center lg:space-x-4 md:space-x-2 sm:space-x-1">
                    <div id="search-product" className="flex items-center">
                        <label htmlFor="simple-search" className="sr-only">Search</label>
                        <div className="relative w-full">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <svg aria-hidden="true" className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                id="simple-search"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2"
                                placeholder="Search"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                required=""
                            />
                        </div>
                    </div>
                    <button
                        onClick={() => handleSearch()}
                        className="p-2 text-blue-600 border border-slate-300 rounded-md hover:bg-gray-300"
                    >
                        Tìm kiếm
                    </button>
                </div>
                <div className="flex items-center space-x-10">
                    <div className="flex items-center">
                        {user?.access_token ? (
                            <>
                                {!user?.avatar ? (
                                    <CiUser className="text-2xl text-gray-600" />
                                ) : (
                                    <img src={user?.avatar} alt="avatar" className="w-8 h-8 rounded-full" />
                                )}
                                <Menu as="div" className="relative inline-block text-left">
                                    <div>
                                        <MenuButton className="p-2 text-gray-600 inline-flex rounded-md hover:bg-gray-300">{userName?.length ? userName : user?.email}</MenuButton>
                                    </div>
                                    <MenuItems
                                        transition
                                        className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                                    >
                                        <div className="py-1">
                                            <MenuItem>
                                                <button
                                                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                                                    onClick={() => navigate('/profile-user')}
                                                >
                                                    Thông tin tài khoản
                                                </button>
                                            </MenuItem>
                                            {isAdmin && (
                                                <MenuItem>
                                                    <button
                                                        className="block w-full px-4 py-2 text-left text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                                                        onClick={() => navigate('/system/admin')}
                                                    >
                                                        Quản lý hệ thống
                                                    </button>
                                                </MenuItem>
                                            )}
                                            {!isAdmin && (
                                                <MenuItem>
                                                    <button
                                                        className="block w-full px-4 py-2 text-left text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                                                        onClick={() => navigate('/my-order')}
                                                    >
                                                        Đơn hàng
                                                    </button>
                                                </MenuItem>
                                            )}
                                            <MenuItem>
                                                <button
                                                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none"
                                                    onClick={() => handleLogout()}
                                                >
                                                    Đăng xuất
                                                </button>
                                            </MenuItem>
                                        </div>
                                    </MenuItems>
                                </Menu>
                            </>
                        ) : (
                            <>
                                <CiUser className="text-2xl text-gray-600" />
                                <button className="p-2 text-gray-600 rounded-md hover:bg-gray-300"
                                    onClick={() => handleNavigateLogin()}
                                >Tài khoản</button>
                            </>
                        )}
                    </div>
                    <div className="flex items-center">
                        <div className="relative">
                            <CiShoppingCart className="text-2xl text-gray-600" />
                            {order?.orderItems?.length > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                    {order?.orderItems?.length}
                                </span>
                            )}
                        </div>
                        <button
                            onClick={() => handleCart()}
                            className="p-2 text-gray-600 rounded-md hover:bg-gray-300"
                        >Giỏ hàng</button>
                    </div>
                </div>
            </div>
            <hr />
        </div>
    );
};

export default HeaderComponent;