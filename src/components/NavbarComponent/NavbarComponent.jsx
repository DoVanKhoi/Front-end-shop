import React from "react";
import { MdStarRate } from "react-icons/md";
import { useDispatch } from "react-redux";
import { filterProduct } from "../../redux/slides/productSlide";

const NavbarComponent = (props) => {
    const { typeProducts } = props;
    const dispatch = useDispatch();

    const price = ['Dưới 100.000', '100.000 - 500.000', '500.000 - 1.000.000', '1.000.000 - 5.000.000', 'Trên 5.000.000'];
    const rating = [5, 4, 3, 2, 1];

    const handleTypeProduct = (type) => {
        dispatch(filterProduct(type));
    }

    const renderContent = (type, options) => {
        switch (type) {
            case 'text':
                return options?.map((item, index) => (
                    <div key={index}>
                        <button className="mb-2 p-1 w-fit rounded-full hover:bg-gray-300 cursor-pointer" onClick={() => handleTypeProduct(item)}>{item}</button>
                    </div>
                ));
            case 'rate':
                return options?.map((item, index) => {
                    return (
                        <div key={index} className="flex">
                            <span>{item} Sao</span>
                            <div className="flex ml-2">
                                {Array.from({ length: item }).map((_, starIndex) => (
                                    <MdStarRate key={starIndex} className="h-6 ml-1 text-yellow-500" />
                                ))}
                            </div>
                        </div>
                    )
                });
            case 'price':
                return options?.map((item, index) => (
                    <div key={index}>
                        <p className="mb-2 p-1 w-fit bg-gray-200 rounded-full">{item}</p>
                    </div>
                ));
            default:
                return null;
        }
    }

    return (
        <>
            <h1 className="mb-4 font-medium">Các loại sản phẩm</h1>
            {renderContent('text', typeProducts)}
            <h1 className="my-4 font-medium">Đánh giá</h1>
            {renderContent('rate', rating)}
            <h1 className="my-4 font-medium">Giá</h1>
            {renderContent('price', price)}
        </>
    )
}

export default NavbarComponent;