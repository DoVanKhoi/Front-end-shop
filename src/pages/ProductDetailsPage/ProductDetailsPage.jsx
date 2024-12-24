import { useNavigate, useParams } from "react-router-dom";
import ProductDetailsComponent from "../../components/ProductDetailsComponent/ProductDetailsComponent";


const ProductDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const handleNavigate = () => {
        navigate("/");
    };

    return (
        <div className="bg-gray-100">
            <div className="h-8 bg-white flex items-center">
                <div className="px-36 inline-block">
                    <span
                        className="text-lg text-gray-400 cursor-pointer hover:underline hover:text-gray-500"
                        onClick={() => handleNavigate()}
                    >
                        Trang chủ
                    </span>
                    <span className="mx-2 text-gray-400">{`>`}</span>
                    <span className="text-lg text-blue-500">Chi tiết sản phẩm</span>
                </div>
            </div>
            <ProductDetailsComponent idProduct={id} />
        </div>
    );
};

export default ProductDetailsPage;