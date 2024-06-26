import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  LogBox,
} from 'react-native';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../firebaseConfig';
import { setUserEmail, setLoggedIn, setUserName } from '../state';
import { useDispatch } from 'react-redux';

const Login = ({ navigation, onLogin }) => {
  const dispatch = useDispatch();
  const [emailInput, setEmailInput] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const handleCreateId = () => {
    navigation.navigate('회원가입');
  };

  LogBox.ignoreLogs(['Warning: ...']);

  const handleLogin = async () => {
    const auth = getAuth();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        emailInput,
        password
      );
      const email = userCredential.user.email; // 로그인 성공 시 이메일 얻기
      dispatch(setUserEmail(email)); // 이메일 상태 업데이트
      dispatch(setLoggedIn(true)); // 로그인 상태 업데이트

      const userRef = doc(firestore, 'users', email);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        const userName = docSnap.data().name; // 문서에서 이름 필드 추출
        dispatch(setUserName(userName)); // Redux store에 사용자 이름 저장
        setErrorMessage('');
        navigation.navigate('Sidebar');
      } else {
        // 회원 데이터가 없는 경우
        setErrorMessage('이메일과 비밀번호를 확인하세요.');
      }
    } catch (error) {
      // 로그인 실패 시 처리
      setErrorMessage('이메일과 비밀번호를 확인하세요.');
    }
  };

  return (
    <ImageBackground
      source={{
        uri: 'https://firebasestorage.googleapis.com/v0/b/capstone-ac206.appspot.com/o/%EB%B0%B0%EA%B2%BD.webp?alt=media&token=cabac6ad-77a8-4c88-9366-a33cd01c5bf6',
      }} // 배경 이미지 파일 경로를 설정하세요
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.title}>로그인</Text>
        <TextInput
          style={styles.input}
          placeholder="이메일"
          value={emailInput}
          onChangeText={(text) => setEmailInput(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="비밀번호"
          secureTextEntry
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
        {errorMessage ? ( // Conditional rendering of the error message
          <Text style={{ color: 'red', marginBottom: 10 }}>{errorMessage}</Text>
        ) : null}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>로그인</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleCreateId}>
            <Text style={styles.buttonText}>회원가입</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // 배경의 투명도 조절 가능
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: 'black', // 텍스트 색상 변경
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    padding: 8,
    backgroundColor: 'white', // 입력 필드 배경색 변경
    borderRadius: 5, // 입력 필드의 모서리를 둥글게 만듦
  },
  button: {
    width: 80,
    height: 40,
    backgroundColor: '#21825B',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '400',
    color: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
  },
});

export default Login;
