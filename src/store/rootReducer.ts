import { combineReducers } from '@reduxjs/toolkit'
import cpuReducer from './cpuSlice'

const rootReducer = combineReducers({
  user: cpuReducer
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer
