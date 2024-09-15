import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/userSlice';
import menuReducer from '../features/menuSlice'

// Configuration du store
export const store = configureStore({
  reducer: {
    user: userReducer,
    menu: menuReducer,
  },
});

// Définir les types RootState et AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;