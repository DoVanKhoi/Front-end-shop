import React, { useEffect, useState } from "react";
import { useMutationHook } from "../../hooks/useMutationHook";
import * as ProductService from "../../services/ProductService";
import { getBase64 } from "../../utils";

const AddProductComponent = (props) => {
    const { hideModalCreate, refetchData } = props;

    const [stateProduct, setStateProduct] = useState({
        name: '',
        type: '',
        countInStock: 0,
        price: 0,
        rating: 0,
        description: '',
        image: ''
    });
    const [newType, setNewType] = useState('');
    const [previewImage, setPreviewImage] = useState(null);
    const [isValid, setIsValid] = useState(false);

    const mutation = useMutationHook(
        async (data) => {
            const res = await ProductService.createProduct(data);
            return res;
        }
    )

    const handleChangeName = (e) => {
        setStateProduct({ ...stateProduct, name: e.target.value });
    }

    const handleChangeType = (e) => {
        setStateProduct({ ...stateProduct, type: e.target.value });
    }

    const handleChangeNewType = (e) => {
        setNewType(e.target.value);
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
            setPreviewImage(previewUrl);
            setStateProduct({ ...stateProduct, image: previewUrl });
        }
    };

    const handleHideModalCreate = () => {
        setStateProduct({
            name: '',
            type: '',
            countInStock: 0,
            price: 0,
            rating: 0,
            description: ''
        });
        setPreviewImage(null);
        hideModalCreate();
    };

    const handleAddNewProduct = (e) => {
        e.preventDefault();
        if (!stateProduct.name || !stateProduct.type || !stateProduct.countInStock || !stateProduct.price || !stateProduct.rating || !stateProduct.description || !stateProduct.image) {
            setIsValid(true);
        } else {
            if (stateProduct.type === 'add_type') {
                stateProduct.type = newType;
            }
            setIsValid(false);
            handleHideModalCreate();
            mutation.mutate(stateProduct);
            refetchData();
        }
    }

    useEffect(() => {
        setIsValid(false);
    }, [stateProduct]);

    return (
        <>
            {/* <!-- Modal content --> */}
            <div className="relative p-4 bg-white rounded-lg shadow">
                {/* <!-- Modal header --> */}
                <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5">
                    <h3 className="text-lg font-semibold text-gray-900">Add Product</h3>
                    <button
                        type="button"
                        onClick={() => handleHideModalCreate()}
                        className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                    >
                        <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        <span className="sr-only">Close modal</span>
                    </button>
                </div>
                {/* <!-- Modal body --> */}
                <form id="modal-add-product" action="#">
                    <div className="grid gap-4 mb-4 sm:grid-cols-2">
                        <div>
                            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">Name</label>
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
                            <label htmlFor="type" className="block mb-2 text-sm font-medium text-gray-900">Type</label>
                            <select
                                id="type"
                                name="type"
                                value={stateProduct.type}
                                onChange={(e) => handleChangeType(e)}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                            >
                                <option value="">-- Chọn loại --</option>
                                <option value="Đồ gia dụng nhà bếp">Đồ gia dụng nhà bếp</option>
                                <option value="Đồ gia dụng nhà tắm">Đồ gia dụng nhà tắm</option>
                                <option value="Đồ gia dụng phòng khách">Đồ gia dụng phòng khách</option>
                                <option value="Đồ gia dụng phòng ngủ">Đồ gia dụng phòng ngủ</option>
                                <option value="add_type">Thêm loại</option>
                            </select>
                        </div>
                        {stateProduct.type === 'add_type' && (
                            <div className="grid-cols-subgrid col-span-2">
                                <label htmlFor="newType" className="block mb-2 text-sm font-medium text-gray-900">New type</label>
                                <input
                                    id="newType"
                                    type="text"
                                    name="newType"
                                    value={newType}
                                    onChange={(e) => handleChangeNewType(e)}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                                    placeholder="New type"
                                    autoComplete="off"
                                    required
                                />
                            </div>
                        )}
                        <div>
                            <label htmlFor="countInStock" className="block mb-2 text-sm font-medium text-gray-900">Count in stock</label>
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
                            <label htmlFor="price" className="block mb-2 text-sm font-medium text-gray-900">Price</label>
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
                            <label htmlFor="rating" className="block mb-2 text-sm font-medium text-gray-900">Rating</label>
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
                            <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900">Description</label>
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
                                <label htmlFor="image" className="block text-sm font-medium text-gray-700">Image</label>
                                <input
                                    type="file"
                                    id="image"
                                    onChange={(e) => handleChangeImage(e)}
                                />
                            </div>
                            {previewImage && <img src={previewImage} alt="" className="max-w-60 max-h-48 object-cover rounded-lg" />}
                        </div>
                    </div>
                    <button
                        onClick={(e) => handleAddNewProduct(e)}
                        className="text-white inline-flex items-center bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                        <svg className="mr-1 -ml-1 w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Add new product
                    </button>
                    {isValid && <p className="text-red-500 text-sm/6">Vui lòng điền đầy đủ thông tin</p>}
                </form>
            </div>
        </>
    );
}

export default AddProductComponent;