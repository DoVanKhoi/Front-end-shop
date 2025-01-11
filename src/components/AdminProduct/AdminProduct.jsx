import React, { useEffect, useState } from "react";
import * as ProductService from "../../services/ProductService";
import { useQuery } from "@tanstack/react-query";
import AddProductComponent from "../AddProductComponent/AddProductComponent";
import UpdateProductComponent from "../UpdateProductComponent/UpdateProductComponent";
import { useMutationHook } from "../../hooks/useMutationHook";
import { formatPrice } from "../../utils";

const AdminProduct = () => {
    const [products, setProducts] = useState([]);
    const [editId, setEditId] = useState('');
    const [deleteId, setDeleteId] = useState('');
    const [isShowModalCreate, setIsShowModalCreate] = useState(false);
    const [isShowTypeFilter, setIsShowTypeFilter] = useState(false);
    const [isShowModalEdit, setIsShowModalEdit] = useState(false);
    const [isShowModalDelete, setIsShowModalDelete] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [optionSort, setOptionSort] = useState("");
    const [sortOrder, setSortOrder] = useState("asc");

    const fetchProductAll = async () => {
        const res = await ProductService.getAllProduct();
        return res.data;
    }

    const queryAllProduct = useQuery({ queryKey: ['products'], queryFn: fetchProductAll });
    const { data, refetch } = queryAllProduct;


    useEffect(() => {
        if (data) {
            setProducts(data);
        }
    }, [data]);

    useEffect(() => {
        const filterProducts = () => {
            return products?.filter((product) => {
                const matchesSearchTerm = product.name.toLowerCase().includes(searchTerm.toLowerCase());
                const matchesType = selectedTypes.length > 0 ? selectedTypes.includes(product.type) : true;
                return matchesSearchTerm && matchesType;
            }
            );
        };
        setFilteredProducts(filterProducts());
    }, [products, searchTerm, selectedTypes]);

    const mutation = useMutationHook(
        async (deleteId) => {
            const res = await ProductService.deleteProduct(deleteId);
            return res;
        }
    )

    const uniqueTypes = [...new Set(products.map((product) => product.type))];

    const showModalCreate = () => {
        setIsShowModalCreate(true);
    }

    const hideModalCreate = () => {
        setIsShowModalCreate(false);
        refetch();
    }

    const showTypeFilter = () => {
        setIsShowTypeFilter(!isShowTypeFilter);
    }

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

    const handleDeleteProduct = (e) => {
        e.preventDefault();
        mutation.mutate(deleteId, {
            onSettled: () => {
                refetch();
            }
        });
        hideModalDelete();
    }

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    }

    const handleTypeChange = (type) => {
        if (selectedTypes.includes(type)) {
            setSelectedTypes(selectedTypes.filter((item) => item !== type));
        } else {
            setSelectedTypes([...selectedTypes, type]);
        }
    }

    const handleChangeOptionSort = (e) => {
        setOptionSort(e.target.value);
    }

    const handleChangeSortOrder = () => {
        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    }

    const sortedProducts = [...filteredProducts].sort((a, b) => {
        if (optionSort === "name") {
            return sortOrder === "asc"
                ? a.name.localeCompare(b.name)
                : b.name.localeCompare(a.name);
        } else if (optionSort === "countInStock") {
            return sortOrder === "asc" ? a.countInStock - b.countInStock : b.countInStock - a.countInStock;
        } else if (optionSort === "price") {
            return sortOrder === "asc" ? a.price - b.price : b.price - a.price;
        } else if (optionSort === "rating") {
            return sortOrder === "asc" ? a.rating - b.rating : b.rating - a.rating;
        }
        return 0;
    });

    useEffect(() => {
        if (isShowModalCreate) {
            document.getElementById('createProductModal').classList.remove('hidden');
        } else {
            document.getElementById('createProductModal').classList.add('hidden');
        }
    }, [isShowModalCreate]);

    useEffect(() => {
        if (isShowModalEdit) {
            document.getElementById('updateProductModal').classList.remove('hidden');
        } else {
            document.getElementById('updateProductModal').classList.add('hidden');
        }
    }, [isShowModalEdit]);

    useEffect(() => {
        if (isShowModalDelete) {
            document.getElementById('deleteProductModal').classList.remove('hidden');
        } else {
            document.getElementById('deleteProductModal').classList.add('hidden');
        }
    }, [isShowModalDelete]);


    return (
        <div className="p-4">
            <h1 className="text-center text-4xl font-semibold">Quản lý sản phẩm</h1>
            <div className="mt-10 mx-4 h-fit">
                <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
                    <div className="w-full md:w-1/2">
                        <div className="flex items-center">
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
                                    placeholder="Tìm kiếm sản phẩm"
                                    value={searchTerm}
                                    onChange={(e) => handleSearch(e)}
                                    required=""
                                />
                            </div>
                        </div>
                    </div>
                    <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
                        <div className="flex items-center space-x-2">
                            <label htmlFor="sort">Sắp xếp theo:</label>
                            <select
                                id="sort"
                                name="sort"
                                value={optionSort}
                                onChange={(e) => handleChangeOptionSort(e)}
                                className="w-full md:w-40 bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2"
                            >
                                <option value="">-- Chọn tiêu chí --</option>
                                <option value="name">Tên sản phẩm</option>
                                <option value="countInStock">Số lượng</option>
                                <option value="price">Giá</option>
                                <option value="rating">Đánh giá</option>
                            </select>
                        </div>
                        <div>
                            <button
                                className="flex items-center justify-center text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2"
                                onClick={() => handleChangeSortOrder()}>
                                {sortOrder === "asc" ? "Tăng dần" : "Giảm dần"}
                            </button>
                        </div>
                        <div className="relative inline-block text-left">
                            <button
                                className="flex items-center justify-center text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2"
                                onClick={() => showTypeFilter()}
                            >
                                Lọc
                            </button>
                            {isShowTypeFilter && (
                                <div className="absolute z-10 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in">
                                    <div className="py-1 space-y-2">
                                        {uniqueTypes.map((type) =>
                                            <div key={type} className="flex items-center space-x-2 px-3 py-1">
                                                <input type="checkbox" id={type} name={type} value={type}
                                                    checked={selectedTypes.includes(type)}
                                                    onChange={() => handleTypeChange(type)}
                                                />
                                                <label htmlFor={type} className="text-sm text-gray-700 cursor-pointer">{type}</label>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div>
                            <button
                                type="button"
                                id="createProductModalButton"
                                onClick={() => showModalCreate()}
                                className="flex items-center justify-center text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2">
                                <svg className="h-3.5 w-3.5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <path clipRule="evenodd" fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
                                </svg>
                                Thêm mới
                            </button>
                        </div>
                    </div>
                </div>

                {/* <!-- Table --> */}
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <table className="w-full text-sm text-left text-gray-500 ">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    Tên sản phẩm
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Loại
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Số lượng trong kho
                                </th>
                                <th scope="col" className="px-6 py-3 text-nowrap">
                                    Đã bán
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Giá
                                </th>
                                <th scope="col" className="px-6 py-3 text-nowrap">
                                    Đánh giá
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Mô tả
                                </th>
                                <th scope="col" className="px-6 py-3 text-nowrap">
                                    Hành động
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedProducts?.map((product) => (
                                <tr key={product?._id} className="odd:bg-white even:bg-gray-50 border-b">
                                    <th scope="row" className="px-2 py-4 font-medium text-gray-900">
                                        {product?.name}
                                    </th>
                                    <td className="px-2 py-4">
                                        {product?.type}
                                    </td>
                                    <td className="px-2 py-4 text-center">
                                        {product?.countInStock}
                                    </td>
                                    <td className="px-2 py-4 text-center">
                                        {product?.selled || 0}
                                    </td>
                                    <td className="px-2 py-4">
                                        {formatPrice(product?.price)}
                                    </td>
                                    <td className="px-2 py-4 text-center">
                                        {product?.rating}
                                    </td>
                                    <td className="px-2 py-4">
                                        {product?.description?.length > 100
                                            ? `${product.description.substring(0, 100)}...`
                                            : product.description}
                                    </td>
                                    <td className="flex items-center px-2 py-4 justify-center">
                                        <button
                                            id={product?._id}
                                            onClick={(e) => showModalEdit(e)}
                                            className="text-blue-600 hover:underline"
                                        >
                                            Sửa
                                        </button>
                                        <button
                                            id={product?._id}
                                            onClick={(e) => showModalDelete(e)}
                                            className="text-red-600 hover:underline ms-3"
                                        >
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>
            {/* Modal create product */}
            <div id="createProductModal" tabIndex="-1" className="hidden overflow-y-auto overflow-x-hidden bg-gray-900 bg-opacity-50 fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 max-h-full h-screen">
                <div className="relative left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 p-4 max-w-2xl">
                    <AddProductComponent hideModalCreate={hideModalCreate} refetchData={refetch} />
                </div>
            </div>

            {/* Modal update product */}
            <div id="updateProductModal" tabIndex="-1" className="hidden overflow-y-auto overflow-x-hidden bg-gray-900 bg-opacity-50 fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 max-h-full h-screen">
                <div className="relative left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 p-4 max-w-2xl">
                    <UpdateProductComponent hideModalEdit={hideModalEdit} editId={editId} refetchData={refetch} />
                </div>
            </div>

            {/* Modal delete product */}
            <div id="deleteProductModal" tabIndex="-1" className="hidden overflow-y-auto overflow-x-hidden bg-gray-900 bg-opacity-50 fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 max-h-full h-screen">
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
                                    onClick={(e) => handleDeleteProduct(e)}
                                    className="text-white bg-red-600 hover:bg-red-700 rounded-lg text-sm p-1.5"
                                >
                                    Xóa
                                </button>
                                <button
                                    type="button"
                                    onClick={() => hideModalDelete()}
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

export default AdminProduct;