import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Settings from './src/pages/Settings';
import Orders from './src/pages/Orders';
import Delivery from './src/pages/Delivery';
import SignIn from './src/pages/SignIn';
import SignUp from './src/pages/SignUp';
import {useSelector} from 'react-redux';
import {RootState} from './src/store/reducer';
import useSocket from './src/hooks/useSocket';
import {useEffect} from 'react';
import {useAppDispatch} from './src/store';
import EncryptedStorage from 'react-native-encrypted-storage';
import axios from 'axios';
import Config from 'react-native-config';
import userSlice from './src/slices/user';
import {Alert} from 'react-native';
import orderSlice from './src/slices/order';

export type LoggedInParamList = {
  Orders: undefined;
  Settings: undefined;
  Delivery: undefined;
  Complete: {orderId: string};
};

export type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
};

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function AppInner() {
  // state.user.email이 존재하면 로그인 상태로 간주 <=> 이메일이 없을 경우 비로그인 상태로 간주
  const isLoggedIn = useSelector((state: RootState) => !!state.user.email);
  console.log('isLoggedIn', isLoggedIn);
  const dispatch = useAppDispatch();
  const [socket, disconnect] = useSocket();

  useEffect(() => {
    axios.interceptors.response.use(
      response => response,
      async error => {
        // const {response: {status}} = error;
        const {
          config,
          response: {status},
        } = error;
        if (status === 419) {
          if (error.response.data.code === 'expired') {
            console.log('다시 발급 요청 날립니다');
            const originalRequest = config;

            const token = await EncryptedStorage.getItem('refreshToken');
            if (!token) {
              return;
            }
            const response = await axios.post(
              `${Config.API_URL}/refreshToken`,
              {},
              {
                headers: {
                  authorization: `Bearer ${token}`,
                },
              },
            );
            // 새로운 토큰 저장
            dispatch(userSlice.actions.setAccessToken(data.data.accessToken));
            originalRequest.headers.authorization = `Bearer ${data.data.accessToken}`;
            // 419로 요청 실패했던 요청 새로운 토큰으로 재요청
            return axios(originalRequest);
          }
        }
        return Promise.reject(error);
      },
    );
  }, [dispatch]);

  useEffect(() => {
    const callback = (data: any) => {
      console.log(data);
      dispatch(orderSlice.actions.addOrder(data));
    };
    if (socket && isLoggedIn) {
      console.log(socket);
      socket.emit('acceptOrder', 'hello'); // 소켓이 연결 되면 클라이언트에서 소켓 이벤트를 발생 시킨다 (key: acceptOrder, value: 'hello')
      socket.on('order', callback); // 서버에서 order 라는 소켓 이벤트와 함께 데이터를 전달해오면 callback 으로 받는다.
    }
    return () => {
      if (socket) {
        // socket.off('hello', helloCallback);
        socket.off('order', callback);
      }
    };
  }, [dispatch, isLoggedIn, socket]);

  useEffect(() => {
    if (!isLoggedIn) {
      console.log('!isLoggedIn', !isLoggedIn);
      disconnect();
    }
  }, [isLoggedIn, disconnect]);

  // 앱 실행 시 refreshToken이 있으면 로그인 상태이므로 <=> const token = await EncryptedStorage.getItem('refreshToken');
  // 다시 토큰을 요청하여 토큰을 받는다.
  // 이부분을 주석 처리 하면 프론트 재시작시 로그인 풀림
  useEffect(() => {
    const getTokenAndRefresh = async () => {
      try {
        const token = await EncryptedStorage.getItem('refreshToken');
        if (!token) {
          return;
        }
        const response = await axios.post(
          `${Config.API_URL}/refreshToken`,
          {},
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          },
        );
        dispatch(
          userSlice.actions.setUser({
            name: response.data.data.name,
            email: response.data.data.email,
            accessToken: response.data.data.accessToken,
          }),
        );
      } catch (error) {
        console.error(error);
        if ((error as AxiosError).response?.data.code === 'expired') {
          Alert.alert('알림', '다시 로그인 해주세요.');
        }
      }
    };
    getTokenAndRefresh();
  }, [dispatch]);

  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <Tab.Navigator>
          <Tab.Screen
            name="Orders"
            component={Orders}
            options={{title: '오더 목록'}}
          />
          <Tab.Screen
            name="Delivery"
            component={Delivery}
            options={{headerShown: false}}
          />
          <Tab.Screen
            name="Settings"
            component={Settings}
            options={{title: '내 정보'}}
          />
        </Tab.Navigator>
      ) : (
        <Stack.Navigator>
          <Stack.Screen
            name="SignIn"
            component={SignIn}
            options={{title: '로그인'}}
          />
          <Stack.Screen
            name="SignUp"
            component={SignUp}
            options={{title: '회원가입'}}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}

export default AppInner;
