import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../app/store'
import { StockInfo } from '../../types/StockInfo'

interface StocksDataState {
  stocksData: StockInfo[]
  lastStocksData: StockInfo[]
}

const initialState: StocksDataState = {
  stocksData: [],
  lastStocksData: []
}

export const stocksDataSlice = createSlice({
  name: 'stocksData',
  initialState,
  reducers: {
    updateStocksData: (state, action: PayloadAction<StockInfo>) => {
      const stockInfo = action.payload

      const indexOfStock = state.stocksData.findIndex((stock) =>
        stock.id.includes(stockInfo.id)
      )

      if (indexOfStock >= 0) {
        state.stocksData[indexOfStock] = stockInfo
      } else {
        state.stocksData.push(stockInfo)
      }
    },
    updateLastStocksData: (state, action: PayloadAction<StockInfo[]>) => {
      state.lastStocksData = action.payload
    },
  },
})

export const { updateStocksData, updateLastStocksData } = stocksDataSlice.actions

export const selectStocksData = (state: RootState) => state.stocksDataState.stocksData
export const selectLastStocksData = (state: RootState) => state.stocksDataState.lastStocksData

export default stocksDataSlice.reducer