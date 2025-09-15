import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

export const fetchBestSellingProducts = createAsyncThunk(
  'product/fetchBestSellingProducts',
  async (_, thunkAPI) => {
    try {
      const { data } = await axios.get('/api/products/best-selling')
      return data.bestSelling
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data)
    }
  }
)


export const fetchProducts = createAsyncThunk('product/fetchProducts', 
    async ({storeId}, thunkAPI) =>{
        try {
            const {data} = await axios.get('/api/products'+ (storeId ? `?storeId=${storeId} `: '' ))
            return data.products
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data)
        }
    }
)

const productSlice = createSlice({
    name: 'product',
    initialState: {
        list: [],
        bestSelling: [],
         bestSellingLoading: false,
    },
    reducers: {
        setProduct: (state, action) => {
            state.list = action.payload
        },
        clearProduct: (state) => {
            state.list = []
        }
    },
    extraReducers: (builder)=>{
        builder.addCase(fetchProducts.fulfilled, (state, action)=>{
            state.list = action.payload
        })
        .addCase(fetchBestSellingProducts.pending, (state) => {
        state.bestSellingLoading = true;  // start loader
      })
      .addCase(fetchBestSellingProducts.fulfilled, (state, action) => {
        state.bestSelling = action.payload;
        state.bestSellingLoading = false; // stop loader
      })
      .addCase(fetchBestSellingProducts.rejected, (state) => {
        state.bestSellingLoading = false; // stop loader on error
      });
    }
})

export const { setProduct, clearProduct } = productSlice.actions

export default productSlice.reducer