import {createSlice, PayloadAction} from '@reduxjs/toolkit';

// 스테이트
// 벨류가 객체 배열이 없을 경우 타입 설정 안해도 됨 <=> 자동 추론으로 충분
const initialState = {
  name: '',
  email: '',
  accessToken: '',
  money: 0,
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

    setMoney(state, action: PayloadAction<number>) {
      state.money = action.payload;
    },
    setAccessToken(state, action) {
      state.accessToken = action.payload;
    },
  },
  extraReducers: builder => {},
});

export default userSlice;
