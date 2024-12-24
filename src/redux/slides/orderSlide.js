import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    orderItems: [
    ],
    shippingAddress: {
        name: '',
        phone: 0,
        address: '',
        city: ''
    },
    paymentMethod: '',
    itemsPrice: 0,
    shippingPrice: 0,
    totalPrice: 0,
    user: '',
    isPaid: false,
    paidAt: '',
    deliveryMethod: '',
    isDelivered: false,
    deliveredAt: '',
}


export const orderSlide = createSlice({
    name: 'order',
    initialState,
    reducers: {
        addOrderProduct: (state, action) => {
            const orderItem = action.payload;
            const itemOrder = state?.orderItems?.find((item) => item?.product === orderItem.product);
            if (itemOrder) {
                itemOrder.amount += orderItem?.amount;
            } else {
                state.orderItems.push(orderItem);
            }
        },
        addInforOrder: (state, action) => {
            const { name, phone, address, city, paymentMethod, itemsPrice, shippingPrice, totalPrice, user } = action.payload;
            state.shippingAddress.name = name;
            state.shippingAddress.phone = phone;
            state.shippingAddress.address = address;
            state.shippingAddress.city = city;
            state.paymentMethod = paymentMethod;
            state.itemsPrice = itemsPrice;
            state.shippingPrice = shippingPrice;
            state.totalPrice = totalPrice;
            state.user = user;
        },
        increaseAmount: (state, action) => {
            const idProduct = action.payload;
            const itemOrder = state?.orderItems?.find((item) => item?.product === idProduct);
            itemOrder.amount += 1;
        },
        decreaseAmount: (state, action) => {
            const idProduct = action.payload;
            const itemOrder = state?.orderItems?.find((item) => item?.product === idProduct);
            if (itemOrder.amount > 1) {
                itemOrder.amount -= 1;
            }
        },
        removeOrderProduct: (state, action) => {
            const idProduct = action.payload;
            const itemOrder = state?.orderItems?.filter((item) => item?.product !== idProduct);
            state.orderItems = itemOrder;
        },
        removeAllOrderProduct: (state, action) => {
            const { idProducts } = action.payload;
            const itemOrder = state?.orderItems?.filter((item) => !idProducts.includes(item?.product));
            state.orderItems = itemOrder;
        },
        clearAllOrderProduct: (state) => {
            state.orderItems = [];
            state.shippingAddress = {
                name: '',
                phone: 0,
                address: '',
                city: ''
            }
            state.paymentMethod = '';
            state.itemsPrice = 0;
            state.shippingPrice = 0;
            state.totalPrice = 0;
            state.user = '';
        }
    },
})

export const { addOrderProduct, increaseAmount, decreaseAmount, removeOrderProduct,
    removeAllOrderProduct, clearAllOrderProduct, addInforOrder } = orderSlide.actions

export default orderSlide.reducer