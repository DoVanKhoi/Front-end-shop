import React from "react";
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";

const FooterComponent = () => {
    return (
        <footer className="bg-gray-800 text-white py-10">
            <div className="container mx-auto px-6 lg:px-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
                {/* Cột 1: Thông tin Cửa hàng nội thất */}
                <div className="flex flex-col items-start">
                    <h3 className="text-lg font-bold mb-4">Cửa hàng nội thất</h3>
                    <p className="text-sm leading-relaxed">
                        Chuyên cung cấp đồ nội thất chất lượng cao. Hãy đến và trải nghiệm sự khác biệt tại Cửa hàng nội thất!
                    </p>
                </div>

                {/* Cột 2: Liên hệ */}
                <div className="flex flex-col items-start">
                    <h3 className="text-lg font-bold mb-4">LIÊN HỆ</h3>
                    <ul className="space-y-2 text-sm">
                        <li>Địa chỉ: 54 Nguyễn Lương Bằng, phường Hòa Khánh Bắc, Quận Liên Chiểu, Đà Nẵng</li>
                        <li>SĐT: 0329672059</li>
                        <li>Email: 102200095@dut.udn.vn</li>
                    </ul>
                </div>

                {/* Cột 3: Kết nối với chúng tôi */}
                <div className="flex flex-col items-start">
                    <h3 className="text-lg font-bold mb-4">KẾT NỐI VỚI CHÚNG TÔI</h3>
                    <div className="flex space-x-4">
                        <a
                            href="/"
                            className="text-gray-400 hover:text-white text-2xl"
                            aria-label="Facebook"
                        >
                            <FaFacebook />
                        </a>
                        <a
                            href="/"
                            className="text-gray-400 hover:text-white text-2xl"
                            aria-label="Instagram"
                        >
                            <FaInstagram />
                        </a>
                        <a
                            href="/"
                            className="text-gray-400 hover:text-white text-2xl"
                            aria-label="Twitter"
                        >
                            <FaTwitter />
                        </a>
                        <a
                            href="/"
                            className="text-gray-400 hover:text-white text-2xl"
                            aria-label="LinkedIn"
                        >
                            <FaLinkedin />
                        </a>
                    </div>
                </div>

                {/* Cột 4: Liên kết */}
                <div className="flex flex-col items-start">
                    <h3 className="text-lg font-bold mb-4">LIÊN KẾT</h3>
                    <ul className="space-y-2 text-sm">
                        <li>
                            <a href="/" className="text-gray-400 hover:text-white">
                                Chính sách bảo mật
                            </a>
                        </li>
                        <li>
                            <a href="/" className="text-gray-400 hover:text-white">
                                Điều khoản sử dụng
                            </a>
                        </li>
                        <li>
                            <a href="/" className="text-gray-400 hover:text-white">
                                Giới thiệu
                            </a>
                        </li>
                        <li>
                            <a href="/" className="text-gray-400 hover:text-white">
                                Liên hệ
                            </a>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Phần dưới */}
            <div className="mt-8 border-t border-gray-700 pt-4 text-center">
                <p className="text-sm text-gray-400">
                    &copy; {new Date().getFullYear()} Cửa hàng nội thất. All rights reserved.
                </p>
            </div>
        </footer>
    );
};

export default FooterComponent;