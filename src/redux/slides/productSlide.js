import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    search: '',
    filterType: '',
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
    },
})

export const { searchProduct, filterProduct } = productSlide.actions

export default productSlide.reducer