import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    search: '',
    filterType: '',
    countInStockOfItems: [],
}

export const productSlide = createSlice({
    name: 'product',
    initialState,
    reducers: {
        searchProduct: (state, action) => {
            state.search = action.payload
        },
        filterProduct: (state, action) => {
            state.filterType = action.payload
        },
        addCountInStockOfItems: (state, action) => {
            state.countInStockOfItems = action.payload
        }
    },
})

export const { searchProduct, filterProduct, addCountInStockOfItems } = productSlide.actions

export default productSlide.reducer