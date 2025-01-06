import React, { useEffect, useState } from "react";
import { MdStarRate } from "react-icons/md";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { formatPrice } from "../../utils";

const CardComponent = (props) => {
    const searchValue = useSelector((state) => state.product.search);
    const typeProducts = useSelector((state) => state.product.filterType);
    const navigate = useNavigate();
    const { products, visibleCount } = props;
    const [filteredProducts, setFilteredProducts] = useState([]);

    const handleDetailsProduct = (id) => {
        navigate(`/product-detail/${id}`);
    }

    useEffect(() => {
        const filterProducts = () => {
            return products?.filter((product) => {
                const matchesSearchValue = product.name.toLowerCase().includes(searchValue.toLowerCase());
                const matchesType = typeProducts.length > 0 ? typeProducts.includes(product.type) : true;
                return matchesSearchValue && matchesType;
            }
            );
        };
        setFilteredProducts(filterProducts());
    }, [products, searchValue, typeProducts]);

    return (
        <div className="my-4 px-4 bg-white rounded">
            <div className="grid gap-x-6 gap-y-10 lg:grid-cols-6 md:grid-cols-4 sm:grid-cols-2 xl:gap-x-8">
                {filteredProducts?.slice(0, visibleCount).map((product) => (
                    <div key={product?._id} className="border-2 border-slate-300 rounded ">
                        <button
                            onClick={() => handleDetailsProduct(product?._id)}
                            disabled={product?.countInStock === 0}
                            className="group text-left"
                        >
                            <img
                                alt=""
                                src={product?.image || ""}
                                className="aspect-square w-full h-full rounded-t-sm bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-[7/8] bg-cover"
                            />
                            <div className="px-2 flex flex-col justify-between h-full relative">
                                <div>
                                    <h3 className="my-2 text-sm text-gray-700 group-hover:opacity-75">{product?.name}</h3>
                                </div>
                                <div className="flex justify-start">
                                    <span className="text-gray-400">
                                        {product?.rating}
                                    </span>
                                    <MdStarRate className="h-6 text-yellow-500" />
                                    <span className="text-gray-400">
                                        | Đã bán {product?.selled || 100}+
                                    </span>
                                </div>
                                <p className="mt-1 text-lg font-medium text-red-500 ">{formatPrice(product?.price)} đ</p>
                            </div>
                        </button>
                    </div>
                ))}
            </div>
        </div>

    )
};

export default CardComponent;