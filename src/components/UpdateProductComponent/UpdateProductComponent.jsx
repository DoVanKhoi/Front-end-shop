import React, { useEffect, useState } from "react";
import { useMutationHook } from "../../hooks/useMutationHook";
import * as ProductService from "../../services/ProductService";
import { getBase64 } from "../../utils";
import { useSelector } from "react-redux";

const UpdateProductComponent = (props) => {
    const { hideModalEdit, editId, refetchData } = props;
    const [isValid, setIsValid] = useState(false);
    const user = useSelector((state) => state.user);

    const [stateProduct, setStateProduct] = useState({
        name: "",
        type: "",
        countInStock: 0,
        price: 0,
        rating: 0,
        description: "",
        image: "",
    });

    const fetchProductById = async (id) => {
        const res = await ProductService.getProductById(id);
        return res.data;
    }

    const mutation = useMutationHook(
        async (data) => {
            const { editId, stateProduct, access_token } = data;
            const res = await ProductService.updateProduct(editId, stateProduct, access_token);
            return res;
        }
    )

    const handleHideModalEdit = () => {
        hideModalEdit();
    }

    const handleChangeName = (e) => {
        setStateProduct({ ...stateProduct, name: e.target.value });
    }

    const handleChangeType = (e) => {
        setStateProduct({ ...stateProduct, type: e.target.value });
    }

    const handleChangeCount = (e) => {
        setStateProduct({ ...stateProduct, countInStock: e.target.value });
    }

    const handleChangePrice = (e) => {
        setStateProduct({ ...stateProduct, price: e.target.value });
    }

    const handleChangeRating = (e) => {
        setStateProduct({ ...stateProduct, rating: e.target.value });
    }

    const handleChangeDescription = (e) => {
        setStateProduct({ ...stateProduct, description: e.target.value });
    }

    const handleChangeImage = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const previewUrl = await getBase64(file);
            setStateProduct({ ...stateProduct, image: previewUrl });
        }
    };

    const handleUpdateProduct = (e) => {
        e.preventDefault();
        if (!stateProduct.name || !stateProduct.type || !stateProduct.countInStock || !stateProduct.price || !stateProduct.rating || !stateProduct.description || !stateProduct.image) {
            setIsValid(true);
        } else {
            setIsValid(false);
            mutation.mutate({ editId, stateProduct, access_token: user?.access_token });
            hideModalEdit();
            refetchData();
        }
    }

    useEffect(() => {
        if (editId) {
            fetchProductById(editId).then((res) => {
                setStateProduct({
                    name: res.name,
                    type: res.type,
                    countInStock: res.countInStock,
                    price: res.price,
                    rating: res.rating,
                    description: res.description,
                    image: res.image,
                });
            });
        }
    }, [editId]);

    useEffect(() => {
        setIsValid(false);
    }, [stateProduct]);

    return (
        <>
            {/* <!-- Modal content --> */}
            <div className="relative p-4 bg-white rounded-lg shadow">
                {/* <!-- Modal header --> */}
                <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5">
                    <h3 className="text-lg font-semibold text-gray-900">Cập nhật sản phẩm</h3>
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
                    <div className="grid gap-4 mb-4 sm:grid-cols-2">
                        <div>
                            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">Tên sản phẩm</label>
                            <input
                                id="name"
                                type="text"
                                name="name"
                                value={stateProduct.name}
                                onChange={(e) => handleChangeName(e)}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                placeholder="Product name"
                                autoComplete="off"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="type" className="block mb-2 text-sm font-medium text-gray-900">Loại</label>
                            <input
                                id="type"
                                type="text"
                                name="type"
                                value={stateProduct.type}
                                onChange={(e) => handleChangeType(e)}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                placeholder="Product type"
                                autoComplete="off"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="countInStock" className="block mb-2 text-sm font-medium text-gray-900">Số lượng</label>
                            <input
                                id="countInStock"
                                type="number"
                                name="countInStock"
                                value={stateProduct.countInStock}
                                onChange={(e) => handleChangeCount(e)}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                placeholder="Count in stock"
                                autoComplete="off"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="price" className="block mb-2 text-sm font-medium text-gray-900">Giá</label>
                            <input
                                id="price"
                                type="text"
                                name="price"
                                value={stateProduct.price}
                                onChange={(e) => handleChangePrice(e)}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                placeholder="Price"
                                autoComplete="off"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="rating" className="block mb-2 text-sm font-medium text-gray-900">Đánh giá</label>
                            <input
                                id="rating"
                                type="number"
                                name="rating"
                                value={stateProduct.rating}
                                onChange={(e) => handleChangeRating(e)}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                placeholder="Rating"
                                autoComplete="off"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900">Mô tả</label>
                            <input
                                id="description"
                                type="text"
                                name="description"
                                value={stateProduct.description}
                                onChange={(e) => handleChangeDescription(e)}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                placeholder="Description"
                                autoComplete="off"
                                required
                            />
                        </div>
                        <div className="flex items-center gap-4">
                            <div>
                                <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">Tải lên hình ảnh</label>
                                <input
                                    type="file"
                                    id="image"
                                    onChange={(e) => handleChangeImage(e)}
                                />
                            </div>
                            {stateProduct.image && <img src={stateProduct.image} alt="" className="max-w-60 max-h-48 object-cover rounded-lg" />}
                        </div>
                    </div>
                    <button
                        onClick={(e) => handleUpdateProduct(e)}
                        className="text-white inline-flex items-center bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                        Cập nhật
                    </button>
                    {isValid && <p className="text-red-500 text-sm/6">Vui lòng điền đầy đủ</p>}
                </form>
            </div>
        </>
    );
}

export default UpdateProductComponent;