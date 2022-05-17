import {useCallback} from 'react';
import SocketIOClient, {Socket} from 'socket.io-client';
import Config from 'react-native-config';
import {useSelector} from 'react-redux';
import {RootState} from '../store/reducer';

let socket: Socket | undefined;

// 아래의 훅을 사용해 웹 소켓 연결 가능
// 리턴 타입 설정은 Socket | undefined, () => void
const useSocket = (): [Socket | undefined, () => void] => {
  const isLoggedIn = useSelector((state: RootState) => !!state.user.email);

  // 웹 소켓을 끊는 함수
  const disconnect = useCallback(() => {
    if (socket && !isLoggedIn) {
      console.log(socket && !isLoggedIn, '웹소켓 연결을 해제합니다.');
      socket.disconnect();
      socket = undefined;
    }
  }, [isLoggedIn]);

  // 소켓 연결이 안된 상태 , 로그인한 상태에서만 소켓 객체 생성 <=> 소켓 객체 연결
  if (!socket && isLoggedIn) {
    console.log(!socket && isLoggedIn, '웹소켓 연결을 진행합니다.');
    socket = SocketIOClient(`${Config.API_URL}`, {
      transports: ['websocket'],
    });
  }

  // 소켓 객체와 소켓 끊기용 함수를 리턴
  return [socket, disconnect];
};

export default useSocket;
