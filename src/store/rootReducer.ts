import { combineReducers, Action } from '@reduxjs/toolkit'
import { ThunkAction } from 'redux-thunk'

// eslint-disable-next-line import/no-cycle
import cpuReducer from './cpuSlice'

const rootReducer = combineReducers({
  cpu: cpuReducer
})

export type RootState = ReturnType<typeof rootReducer>

export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>

export default rootReducer
