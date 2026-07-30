import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { OnboardingProfile, UserState } from "@/types/workspace";

export const initialUserState: UserState = {
  fullName: "",
  companyName: "",
  email: "",
  role: "other",
  challenge: "",
  onboardingCompleted: false,
};

const userSlice = createSlice({
  name: "user",
  initialState: initialUserState,
  reducers: {
    setUserProfile(state, action: PayloadAction<OnboardingProfile>) {
      Object.assign(state, action.payload);
    },
    completeOnboarding(state) {
      state.onboardingCompleted = true;
    },
    hydrateUser(_state, action: PayloadAction<UserState>) {
      return action.payload;
    },
    resetUser() {
      return initialUserState;
    },
  },
});

export const {
  completeOnboarding,
  hydrateUser,
  resetUser,
  setUserProfile,
} = userSlice.actions;

export const userReducer = userSlice.reducer;
