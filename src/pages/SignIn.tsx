import React, {useCallback, useRef, useState} from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

// from
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../App';
type SignInScreenProps = NativeStackScreenProps<RootStackParamList, 'SignIn'>;


type Props = {};

// const SignIn = () => {
function SignIn({navigation}: SignInScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // from
  const emailRef = useRef<TextInput | null>(null);
  const passwordRef = useRef<TextInput | null>(null);

  const toSignUp = useCallback(() => {
    navigation.navigate('SignUp');
  }, [navigation]);

  const onChangeEmail = useCallback(text => {
    setEmail(text.trim());
  }, []);
  const onChangePassword = useCallback(text => {
    setPassword(text.trim());
  }, []);

  const onSubmit = useCallback(() => {
    if (!email || !email.trim()) {
      return Alert.alert('알림', '이메일을 입력해주세요.');
    }
    if (!password || !password.trim()) {
      return Alert.alert('알림', '비밀번호를 입력해주세요.');
    }
    Alert.alert('알림', '로그인 되었습니다.');
  }, [email, password]);

  const canGoNext = email && password;

  return (
    <View>
      <View style={styles.inputWrapper}>
        <Text style={styles.label}>이메일</Text>
        <TextInput
          style={styles.textInput}
          placeholder="이메일을 입력해 주세요 !"
          onChangeText={onChangeEmail}
          // from
          placeholderTextColor="#666"
          importantForAutofill="yes"
          autoComplete="email"
          textContentType="emailAddress"
          value={email}
          returnKeyType="next"
          clearButtonMode="while-editing"
          ref={emailRef}
          onSubmitEditing={() => passwordRef.current?.focus()}
          blurOnSubmit={false}
          keyboardType="email-address"
        />
      </View>

      <View style={styles.inputWrapper}>
        <Text>비밀번호</Text>
        <TextInput
          style={styles.textInput}
          placeholder="비밀번호 입력해 주세요."
          onChangeText={onChangePassword}
          // from
          secureTextEntry
          value={password}
          autoComplete="password"
          textContentType="password"
          returnKeyType="send"
          importantForAutofill="yes"
          ref={passwordRef}
          onSubmitEditing={onSubmit}
          keyboardType="decimal-pad"
        />
      </View>

      <View style={styles.buttonZone}>
        <Pressable
          onPress={onSubmit}
          style={
            canGoNext
              ? StyleSheet.compose(styles.loginButton, styles.loginButtonActive)
              : styles.loginButton
          }
          disabled={!canGoNext}>
          <Text style={styles.loginButtonText}>로그인</Text>
        </Pressable>
        {/* <Pressable> */}
        <Pressable onPress={toSignUp}>
          <Text>회원 가입 하기</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default SignIn;

const styles = StyleSheet.create({
  textInput: {
    padding: 5,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  inputWrapper: {
    padding: 20,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 20,
  },

  loginButton: {
    backgroundColor: 'gray',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
  },
  loginButtonActive: {
    backgroundColor: 'blue',
  },
  buttonZone: {
    alignItems: 'center',
  },
});
