import React, { useEffect, useState } from "react";
import * as UserService from "../../services/UserService";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import UpdateUserComponent from "../UpdateUserComponent/UpdateUserComponent";

const AdminUser = () => {
    const user = useSelector((state) => state.user);
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [editId, setEditId] = useState('');
    const [deleteId, setDeleteId] = useState('');
    const [isShowModalEdit, setIsShowModalEdit] = useState(false);
    const [isShowModalDelete, setIsShowModalDelete] = useState(false);

    const fetchUserAll = async (access_token) => {
        const res = await UserService.getAllUser(access_token);
        return res.data;
    }

    const queryAllUser = useQuery({ queryKey: ['users'], queryFn: () => fetchUserAll(user?.access_token) });
    const { data, refetch } = queryAllUser;

    useEffect(() => {
        if (data) {
            setUsers(data);
        }
    }, [data]);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    }

    useEffect(() => {
        const filteredUsers = () => {
            return users.filter((user) => {
                return (
                    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    user.phone.toString().includes(searchTerm) ||
                    user.city.toLowerCase().includes(searchTerm.toLowerCase())
                );
            });
        };
        setFilteredUsers(filteredUsers());
    }, [users, searchTerm]);

    const showModalEdit = (e) => {
        setIsShowModalEdit(true);
        setEditId(e.target.id);
    }

    const hideModalEdit = () => {
        setIsShowModalEdit(false);
        setEditId('');
        refetch();
    }

    const showModalDelete = (e) => {
        setDeleteId(e.target.id);
        setIsShowModalDelete(true);
    }

    const hideModalDelete = () => {
        setIsShowModalDelete(false);
    }

    const handleDeleteUser = async (e) => {
        if (e.target.id === user?.id) {
            alert("Không thể xóa tài khoản của chính mình");
        } else {
            await UserService.deleteUser(e.target.id, user?.access_token);
        }
        hideModalDelete();
        refetch();
    }

    useEffect(() => {
        if (isShowModalEdit) {
            document.getElementById('updateUserModal').classList.remove('hidden');
        } else {
            document.getElementById('updateUserModal').classList.add('hidden');
        }
    }, [isShowModalEdit]);

    useEffect(() => {
        if (isShowModalDelete) {
            document.getElementById('deleteUserModal').classList.remove('hidden');
        } else {
            document.getElementById('deleteUserModal').classList.add('hidden');
        }
    }, [isShowModalDelete]);

    return (
        <div className="p-4">
            <h1 className="text-center text-4xl font-semibold">Quản lý người dùng</h1>
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
                </div>

                {/* <!-- Table --> */}
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <table className="w-full text-sm text-left text-gray-500 ">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    Tên
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Email
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Số điện thoại
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Địa chỉ
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Tỉnh/Thành phố
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Xử lý
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user) => (
                                <tr key={user?._id} className="odd:bg-white even:bg-gray-50 border-b">
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                        {user?.name}
                                    </th>
                                    <td className="px-6 py-4">
                                        {user?.email}
                                    </td>
                                    <td className="px-6 py-4">
                                        {user?.phone}
                                    </td>
                                    <td className="px-6 py-4">
                                        {user?.address}
                                    </td>
                                    <td className="px-6 py-4">
                                        {user?.city}
                                    </td>
                                    <td className="flex items-center px-6 py-4">
                                        <button
                                            id={user?._id}
                                            onClick={(e) => showModalEdit(e)}
                                            className="text-blue-600 hover:underline"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            id={user?._id}
                                            onClick={(e) => showModalDelete(e)}
                                            className="text-red-600 hover:underline ms-3"
                                        >
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>


            </div>
            {/* Modal update user */}
            <div id="updateUserModal" tabIndex="-1" className="hidden overflow-y-auto overflow-x-hidden bg-gray-900 bg-opacity-50 fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 max-h-full h-screen">
                <div className="relative left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 p-4 max-w-2xl">
                    <UpdateUserComponent hideModalEdit={hideModalEdit} refetchData={refetch} editId={editId} />
                </div>
            </div>

            {/* Modal delete user */}
            <div id="deleteUserModal" tabIndex="-1" className="hidden overflow-y-auto overflow-x-hidden bg-gray-900 bg-opacity-50 fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 max-h-full h-screen">
                <div className="relative left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 p-4 max-w-2xl">
                    <div className="relative p-4 bg-white rounded-lg shadow">
                        <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5">
                            <h3 className="text-lg font-semibold text-gray-900">Xóa sản phẩm</h3>
                            <button
                                type="button"
                                onClick={() => hideModalDelete()}
                                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                            >
                                <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                        </div>
                        <div>
                            <p className="text-gray-700 text-sm">Bạn có chắc là muốn xóa sản phẩm này không?</p>
                            <div className="mt-4 flex justify-end space-x-3">
                                <button
                                    type="button"
                                    id={deleteId}
                                    onClick={(e) => handleDeleteUser(e)}
                                    className="text-white bg-red-600 hover:bg-red-700 rounded-lg text-sm p-1.5"
                                >
                                    Delete
                                </button>
                                <button
                                    type="button"
                                    onClick={() => hideModalDelete()}
                                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminUser;