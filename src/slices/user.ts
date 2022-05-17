import {createSlice} from '@reduxjs/toolkit';

// 스테이트
const initialState = {
  name: '',
  email: '',
  accessToken: '',
};

// 리듀서 부분
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      state.email = action.payload.email;
      state.name = action.payload.name;
      state.accessToken = action.payload.accessToken;
    },
  },
  extraReducers: builder => {},
});

export default userSlice;
