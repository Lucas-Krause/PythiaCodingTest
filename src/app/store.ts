import { configureStore } from '@reduxjs/toolkit'
import stocksDataReducer from '../features/stocksData/StocksDataSlice'

export const store = configureStore({
  reducer: {
    stocksDataState: stocksDataReducer
  },
})

export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch