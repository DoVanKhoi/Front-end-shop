import React, { useEffect, useRef, useState } from "react";
import SlideComponent from "../../components/SlideComponent/SlideComponent";
import Slider1 from "../../assets/images/slider1.jpg";
import Slider2 from "../../assets/images/slider2.jpg";
import Slider3 from "../../assets/images/slider3.jpg";
import CardComponent from "../../components/CardComponent/CardComponent";
import * as ProductService from "../../services/ProductService";
import { useQuery } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { clearAllOrderProduct } from "../../redux/slides/orderSlide";
import { filterProduct, addCountInStockOfItems } from "../../redux/slides/productSlide";
import { TbMessageChatbot } from "react-icons/tb";
import { MdKeyboardArrowDown } from "react-icons/md";
import ChatForm from "../../components/ChatForm/ChatForm";
import ChatMessage from "../../components/ChatMessage/ChatMessage";
import { ShopInforComponent } from "../../components/ShopInforComponent/ShopInforComponent";

const HomePage = () => {
    const user = useSelector((state) => state.user);
    const product = useSelector((state) => state.product);
    const dispatch = useDispatch();
    const [typeProducts, setTypeProducts] = useState([]);
    const arrSlide = [Slider1, Slider2, Slider3];
    const [visibleCount, setVisibleCount] = useState(12);
    const increment = 12;
    const [chatHistory, setChatHistory] = useState([
        {
            hideInChat: true,
            role: "model",
            text: ShopInforComponent
        }
    ]);
    const [isShowChat, setIsShowChat] = useState(false);
    const chatBodyRef = useRef();

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

    useEffect(() => {
        if (products) {
            const countInStockOfItems = products.map(product => ({
                _id: product._id,
                countInStock: product.countInStock,
            }));
            dispatch(addCountInStockOfItems(countInStockOfItems));
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

    const generateBotResponse = async (history) => {
        const updateHistory = (text, isError = false) => {
            setChatHistory(prev => [...prev.filter(msg => msg.text !== "Thinking..."), { role: "model", text, isError }]);
        }

        // Format chat history for API request
        history = history.map(({ role, text }) => ({ role, parts: [{ text }] }));

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: history })
        }

        try {
            const response = await fetch(process.env.REACT_APP_GEMINI_API_URL, requestOptions);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || "Something went wrong!");
            }

            const data = await response.json();

            const apiResponseText = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim();
            updateHistory(apiResponseText);

        } catch (error) {
            updateHistory(error.message, true);
        }
    };

    useEffect(() => {
        chatBodyRef.current.scrollTo({ top: chatBodyRef.current.scrollHeight, behavior: "smooth" });
    }, [chatHistory]);

    useEffect(() => {
        if (isShowChat) {
            document.getElementById("chatbot-popup").classList.remove("hidden");
        } else {
            document.getElementById("chatbot-popup").classList.add("hidden");
        }
    }, [isShowChat]);

    return (
        <>
            <button id="chatbot-toggle" onClick={() => setIsShowChat(!isShowChat)} className="fixed bottom-6 right-6 p-2 size-12 bg-violet-600 text-white rounded-full hover:bg-violet-700 flex items-center justify-center">

                <TbMessageChatbot className="absolute size-8" />
            </button>
            <div className="bg-gray-100 pb-4 min-h-screen">
                <div className="flex flex-row items-center bg-white lg:px-36 md:px-20 sm:px-10 py-2 gap-4">
                    {typeProducts?.map((item, index) => (
                        <div key={index}>
                            <button className="p-1 w-fit rounded-full hover:bg-gray-300 cursor-pointer" onClick={() => handleTypeProduct(item)}>{item}</button>
                        </div>
                    ))}
                </div>
                {!product.search && !product.filterType && <SlideComponent arrImages={arrSlide} />}

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
            <div id="chatbot-popup" className="w-[420px] fixed bottom-20 right-10 bg-sky-200 rounded-2xl shadow-md overflow-hidden hidden">
                {/* Chatbot Header */}
                <div id="chat-header" className="p-4 flex items-center justify-between bg-violet-600">
                    <div className="header-info flex gap-3 items-center">
                        <TbMessageChatbot className="size-9 p-1 bg-white rounded-full fill-violet-400 flex-shrink-0" />
                        <h2 className="logo-text font-semibold text-white text-2xl">Chatbot</h2>
                    </div>
                    <button onClick={() => setIsShowChat(!isShowChat)} className="size-10 text-3xl border-none outline-none hover:bg-violet-700 flex justify-center items-center rounded-full"><MdKeyboardArrowDown className="text-white" /></button>
                </div>
                {/* Chatbot Body */}
                <div id="chat-body" ref={chatBodyRef} className="flex flex-col gap-5 h-[400px] overflow-y-auto p-6 mb-20 ">
                    <div className="message bot-message flex gap-3">
                        <TbMessageChatbot className="size-9 p-1 mb-1 bg-violet-400 rounded-full fill-white flex-shrink-0 self-end" />
                        <p className="message-text py-3 px-4 max-w-[75%] whitespace-pre-line text-base bg-white rounded-t-xl rounded-br-xl rounded-bl-sm">
                            Hey there <br /> How can I help you today?
                        </p>
                    </div>

                    {chatHistory.map((chat, index) => (
                        <ChatMessage key={index} chat={chat} />
                    ))}
                </div>

                {/* ChatbotFooter */}
                <div id="chat-footer" className="absolute bottom-0 w-full bg-white p-4">
                    <ChatForm chatHistory={chatHistory} setChatHistory={setChatHistory} generateBotResponse={generateBotResponse} />
                </div>
            </div>
        </>
    );
};

export default HomePage;