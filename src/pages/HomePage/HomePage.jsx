import React, { useEffect, useState } from "react";
import SlideComponent from "../../components/SlideComponent/SlideComponent";
import Slider1 from "../../assets/images/slider1.jpg";
import Slider2 from "../../assets/images/slider2.jpg";
import Slider3 from "../../assets/images/slider3.jpg";
import CardComponent from "../../components/CardComponent/CardComponent";
import * as ProductService from "../../services/ProductService";
import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { clearAllOrderProduct } from "../../redux/slides/orderSlide";
import { filterProduct } from "../../redux/slides/productSlide";

const HomePage = () => {
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const [typeProducts, setTypeProducts] = useState([]);
    const arrSlide = [Slider1, Slider2, Slider3];
    const [visibleCount, setVisibleCount] = useState(12);
    const increment = 12;

    const fetchProductAll = async () => {
        const res = await ProductService.getAllProduct()
        return res.data;
    }

    const { data: products } = useQuery({ queryKey: ['products'], queryFn: fetchProductAll });

    useEffect(() => {
        if (products) {
            const types = [...new Set(products.map((product) => product.type))];
            setTypeProducts(types);
        }
    }, [products]);

    const handleLoadMore = () => {
        setVisibleCount((prevCount) => prevCount + increment);
    };

    const handleTypeProduct = (type) => {
        dispatch(filterProduct(type));
    }

    useEffect(() => {
        if (!user?.id) {
            dispatch(clearAllOrderProduct());
        }
    }, [user]);

    return (
        <div className="bg-gray-100">
            <div className="flex flex-row items-center bg-white lg:px-36 md:px-20 sm:px-10 py-2 gap-4">
                {typeProducts?.map((item, index) => (
                    <div key={index}>
                        <button className="p-1 w-fit rounded-full hover:bg-gray-300 cursor-pointer" onClick={() => handleTypeProduct(item)}>{item}</button>
                    </div>
                ))}
            </div>
            <SlideComponent arrImages={arrSlide} />

            <div className="mt-4 p-4 bg-white grow rounded lg:mx-32 md:mx-16 sm:mx-8">
                <CardComponent products={products} visibleCount={visibleCount} />
                <div className="text-center">
                    {visibleCount < products?.length && (
                        <button
                            onClick={() => handleLoadMore()}
                            className="mx-auto p-2 w-40 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-200"
                        >
                            Xem thêm
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HomePage;