import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {ActionSheetIOS} from 'react-native';

// 백엔드에서 넘어오는 개별 주문 데이터 타입
export interface Order {
  orderId: 'AD4_lE1BS';
  start: {latitude: number; longitude: number};
  end: {latitude: number; longitude: number};
  price: number;
  rider: 'NO7CYX_pb2';
}

interface InitialState {
  orders: Order[];
  deliveries: Order[];
}

const initialState: InitialState = {
  orders: [],
  deliveries: [],
};

// action.payload 는 넘어오는 단일 데이터를 말하며 보내는 데이터가 x.abcd 이면 action.payload.abcd 로 받는다.
const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    addOrder(state, action: PayloadAction<Order>) {
      state.orders.push(action.payload);
    },

    // 주문을 받으면 배달에 추가 , 주문에서 삭제
    acceptOrder(state, action: PayloadAction<string>) {
      const index = state.orders.findIndex(V => V.orderId === action.payload);
      if (index > -1) {
        state.deliveries.push(state.orders[index]);
        state.orders.splice(index, 1);
      }
    },

    // 주문을 거절하면 주문에서 삭제 배달에서 삭제
    rejectOrder(state, action) {
      const index = state.orders.findIndex(V => V.orderId === action.payload);
      if (index > -1) {
        state.orders.splice(index, 1);
      }
      const delivery = state.deliveries.findIndex(
        v => v.orderId === action.payload,
      );
      if (delivery > -1) {
        state.deliveries.splice(delivery, 1);
      }
    },

    extraReducers: builder => {},
  },
});

export default orderSlice;
