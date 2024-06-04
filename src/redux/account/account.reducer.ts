import { createAsyncThunk, createReducer } from '@reduxjs/toolkit'

import { RootState } from '../store'

export const getAccount = createAsyncThunk('account/get', () => {})
export type AccountReducer = {
  loading: boolean
}

export const defaultAccountReducer: AccountReducer = {
  loading: false,
}

const accountReducer = createReducer(defaultAccountReducer, (builder) => {
  builder.addCase(getAccount.fulfilled, (state, action) => {})
})

export const selectAcount = (state: RootState) => state.account

export default accountReducer
