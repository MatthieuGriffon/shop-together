import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Définir le type de l'état initial
interface UserState {
  user: { name: string; email: string } | null;
}

// État initial
const initialState: UserState = {
  user: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ name: string; email: string }>) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
    },
  },
});

// Export des actions
export const { setUser, logout } = userSlice.actions;

// Export du reducer
export default userSlice.reducer;