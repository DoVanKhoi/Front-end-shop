import { useEffect, useState } from "react";
import { MdStarRate } from "react-icons/md";
import * as ProductService from "../../services/ProductService";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { addOrderProduct } from "../../redux/slides/orderSlide";
import { formatPrice } from "../../utils";
import { ToastContainer, toast } from 'react-toastify';

const ProductDetailsComponent = (props) => {
    const user = useSelector((state) => state.user);
    const { idProduct } = props;
    const [product, setProduct] = useState({});
    const [count, setCount] = useState(1);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();

    const handleIncrease = () => {
        if (parseInt(count) < product?.countInStock) {
            setCount(parseInt(count) + 1);
        } else {
            toast.warn("Số lượng sản phẩm không đủ");
        }
    }

    const handleDecrease = () => {
        if (parseInt(count) > 1) {
            setCount(parseInt(count) - 1);
        }
    }

    const fetchProductById = async (id) => {
        const res = await ProductService.getProductById(id);
        return res.data;
    }

    const handleAddOrderProduct = () => {
        if (!user?.id) {
            navigate('/sign-in', { state: location.pathname });
        } else {
            dispatch(addOrderProduct({
                name: product?.name,
                amount: count,
                image: product?.image,
                price: product?.price,
                product: idProduct
            }))
        }
    }

    useEffect(() => {
        if (idProduct) {
            fetchProductById(idProduct).then((res) => {
                setProduct(res);
            });
        }
    }, [idProduct]);

    return (
        <div className="p-4 mx-32">
            <div className="grid grid-flow-row-dense grid-cols-3 grid-rows-1 bg-white rounded-md gap-10">
                <div className="m-6 col-span-1">
                    <img src={product?.image} alt="" className="object-cover rounded-md" />

                </div>
                <div className="m-6 col-span-2">
                    <h1 className="text-2xl subpixel-antialiased">{product?.name}</h1>
                    <p className="mt-2 text-gray-500 capitalize">{product?.description}</p>
                    <div className="flex mt-2 items-center">
                        <p className="font-medium">{product.rating}</p>
                        <MdStarRate className="h-7 text-yellow-500" />
                        <MdStarRate className="h-7 text-yellow-500" />
                        <MdStarRate className="h-7 text-yellow-500" />
                        <MdStarRate className="h-7 text-yellow-500" />
                        <MdStarRate className="h-7 text-yellow-500" />
                        <p className="ml-2 text-slate-500">| Đã bán 6</p>
                    </div>
                    <p className="text-3xl text-red-500 font-medium mt-2">
                        {product?.price ? `${formatPrice(product?.price)} đ` : "0 đ"}
                    </p>
                    {user?.id && <p className="mt-5">Giao hàng đến: <span className="text-blue-500 hover:underline cursor-pointer">{user?.address}</span></p>}
                    <div className="mt-4">
                        <div className="items-center">
                            <button
                                className="items-center rounded-md size-8 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                                aria-label="Decrement value"
                                onClick={() => handleDecrease()}
                            >
                                -
                            </button>
                            <input
                                type="number"
                                name="count"
                                className="mx-2 w-10 text-center"
                                value={count}
                                onChange={(e) => setCount(e.target.value)}
                            />
                            <button
                                className="items-center rounded-md size-8 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                                aria-label="Increment value"
                                onClick={() => handleIncrease()}
                            >
                                +
                            </button>
                        </div>
                        <div>
                            <button className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md" onClick={() => handleAddOrderProduct()}>Thêm vào giỏ hàng</button>
                            <button className="mt-4 bg-gray-500 text-white px-4 py-2 rounded-md ml-2">Mua ngay</button>
                        </div>
                    </div>
                </div>
                <ToastContainer />
            </div>
        </div>
    );
};

export default ProductDetailsComponent;