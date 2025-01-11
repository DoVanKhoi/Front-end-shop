import { useEffect, useState } from "react";
import { MdStarRate } from "react-icons/md";
import * as ProductService from "../../services/ProductService";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { addOrderProduct } from "../../redux/slides/orderSlide";
import { formatPrice, initFacebookSdk } from "../../utils";
import { ToastContainer, toast } from 'react-toastify';
import LikeButtonComponent from "../LikeButtonComponent/LikeButtonComponent";
import CommentComponent from "../CommentComponent/CommentComponent";

const ProductDetailsComponent = (props) => {
    const user = useSelector((state) => state.user);
    const order = useSelector((state) => state.order);
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
        } else if (order?.orderItems?.length > 0) {
            const itemOrder = order?.orderItems?.find((item) => item?.product === idProduct);
            if (itemOrder.amount + count > product?.countInStock) {
                toast.warn("Số lượng sản phẩm không đủ");
            } else {
                dispatch(addOrderProduct({
                    name: product?.name,
                    amount: count,
                    image: product?.image,
                    price: product?.price,
                    product: idProduct
                }))
                toast.success("Thêm sản phẩm vào giỏ hàng thành công");
            }
        } else {
            dispatch(addOrderProduct({
                name: product?.name,
                amount: count,
                image: product?.image,
                price: product?.price,
                product: idProduct
            }))
            toast.success("Thêm sản phẩm vào giỏ hàng thành công");
        }
    }

    useEffect(() => {
        if (idProduct) {
            fetchProductById(idProduct).then((res) => {
                setProduct(res);
            });
        }
    }, [idProduct]);

    useEffect(() => {
        initFacebookSdk();
    }, []);

    return (
        <div className="p-4 mx-32">
            <div className="grid grid-flow-row-dense grid-cols-3 grid-rows-1 bg-white rounded-md gap-10">
                <div className="m-6 col-span-1">
                    <img src={product?.image} alt="" className="object-cover rounded-md" />
                </div>
                <div className="m-6 col-span-2">
                    <h1 className="text-3xl font-bold subpixel-antialiased text-rose-700">{product?.name}</h1>
                    <p className="my-2 font-normal">Tình trạng: <span className="font-bold subpixel-antialiased text-rose-700">{product?.countInStock > 0 ? "Còn hàng" : "Hết hàng"}</span></p>
                    <div className="flex mt-2 items-center">
                        <p className="font-medium">Đánh giá: <span className="text-slate-500">{product?.rating}</span></p>
                        <MdStarRate className="h-7 text-yellow-500" />
                        <p className="ml-2 text-slate-500">| Đã bán {product?.selled || 100}+</p>
                    </div>
                    <LikeButtonComponent
                        dataHref={process.env.REACT_APP_IS_LOCAL ? "https://developers.facebook.com/docs/plugins/" : window.location.href}
                    />
                    <p className="font-medium mt-2">
                        Giá: <span className="ml-2 text-3xl text-red-500 font-medium">{product?.price ? `${formatPrice(product?.price)} đ` : "0 đ"}</span>
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
                            {/* <button className="mt-4 bg-gray-500 text-white px-4 py-2 rounded-md ml-2">Mua ngay</button> */}
                        </div>
                    </div>
                    <div>
                        <h1 className="text-xl font-bold mt-5 text-rose-800">Mô tả sản phẩm</h1>
                        <p className="mt-2 text-gray-500 capitalize">
                            {product?.description?.split('.').map((sentence, index) => (
                                <span key={index}>
                                    {sentence.trim()}
                                    {sentence.trim() && '.'}
                                    <br />
                                </span>
                            ))}
                        </p>
                    </div>
                </div>
                <ToastContainer />
            </div>
            <CommentComponent
                dataHref={process.env.REACT_APP_IS_LOCAL ? "https://developers.facebook.com/docs/plugins/comments#configurator" : window.location.href}
            />
        </div>
    );
};

export default ProductDetailsComponent;