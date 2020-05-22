import { combineReducers } from '@reduxjs/toolkit'
import cpuReducer from './cpuSlice'

const rootReducer = combineReducers({
  cpu: cpuReducer
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer
