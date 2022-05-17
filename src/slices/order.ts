import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {ActionSheetIOS} from 'react-native';

// 객체
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

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    addOrder(state, action: PayloadAction<Order>) {
      state.orders.push(action.payload);
    },
    acceptOrder(state, action: PayloadAction<string>) {
      const index = state.orders.findIndex(V => V.orderId === action.payload);
      if (index > -1) {
        state.deliveries.push(state.orders[index]);
        state.orders.splice(index, 1);
      }
    },
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
