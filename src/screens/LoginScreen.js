import React, { useState } from 'react';
import { Alert, TouchableOpacity, ActivityIndicator, Modal, View } from 'react-native';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [forgotPasswordModalVisible, setForgotPasswordModalVisible] = useState(false); // Controla a visibilidade do modal de recuperação de senha
  const [resetEmail, setResetEmail] = useState(''); // Armazena o email no modal de recuperação de senha

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async () => {
    if (!validateEmail(email)) {
      Toast.show({
        type: 'error',
        text1: 'Email Inválido',
        text2: 'Por favor, insira um email válido.',
      });
      return;
    }

    if (password.length < 6) {
      Toast.show({
        type: 'error',
        text1: 'Senha Inválida',
        text2: 'A senha deve ter pelo menos 6 caracteres.',
      });
      return;
    }

    setIsLoading(true);
    const storedEmail = await AsyncStorage.getItem('email');
    const storedPassword = await AsyncStorage.getItem('password');

    setTimeout(() => {
      if (email === storedEmail && password === storedPassword) {
        Toast.show({
          type: 'success',
          text1: 'Login bem-sucedido!',
          text2: 'Bem-vindo de volta!',
        });
        navigation.navigate('HomeTabs');
      } else {
        Toast.show({
          type: 'error',
          text1: 'Credenciais Inválidas',
          text2: 'Verifique seu email e senha.',
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  // Função para lidar com a recuperação de senha
  const handlePasswordReset = () => {
    if (!validateEmail(resetEmail)) {
      Alert.alert('Email Inválido', 'Por favor, insira um email válido para recuperação.');
      return;
    }
    Alert.alert('Recuperação de Senha', `Um link de redefinição foi enviado para: ${resetEmail}`);
    setForgotPasswordModalVisible(false);
  };

  return (
    <Container>
      <Title>Login</Title>

      <InputContainer>
        <Input
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          placeholderTextColor="#B0B0B0"
        />
      </InputContainer>

      <InputContainer>
        <Input
          placeholder="Senha"
          secureTextEntry={secureTextEntry}
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
          placeholderTextColor="#B0B0B0"
        />
        <TouchableOpacity onPress={() => setSecureTextEntry(!secureTextEntry)}>
          <Ionicons name={secureTextEntry ? 'eye-off' : 'eye'} size={24} color="#FFB6B9" />
        </TouchableOpacity>
      </InputContainer>

      <ForgotPasswordButton onPress={() => setForgotPasswordModalVisible(true)}>
        <ForgotPasswordText>Esqueceu sua senha?</ForgotPasswordText>
      </ForgotPasswordButton>

      <LoginButton onPress={handleLogin} disabled={isLoading}>
        {isLoading ? <ActivityIndicator color="#F5F5F5" /> : <ButtonText>Login</ButtonText>}
      </LoginButton>

      <CreateAccountButton onPress={() => navigation.navigate('Register')}>
        <CreateAccountText>Criar uma conta</CreateAccountText>
      </CreateAccountButton>

      {/* Modal de Recuperação de Senha */}
      <Modal visible={forgotPasswordModalVisible} transparent={true} animationType="slide">
        <ModalContainer>
          <ModalContent>
            <ModalTitle>Recuperar Senha</ModalTitle>
            <ModalInput
              placeholder="Digite seu email"
              value={resetEmail}
              onChangeText={setResetEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#B0B0B0"
            />
            <SubmitButton onPress={handlePasswordReset}>
              <SubmitButtonText>Enviar Link de Recuperação</SubmitButtonText>
            </SubmitButton>
            <CloseButton onPress={() => setForgotPasswordModalVisible(false)}>
              <CloseButtonText>Fechar</CloseButtonText>
            </CloseButton>
          </ModalContent>
        </ModalContainer>
      </Modal>
    </Container>
  );
}

// Estilos
const Container = styled.View`
  flex: 1;
  justify-content: center;
  padding: 16px;
  background-color: #3A506B;
`;

const Title = styled.Text`
  font-size: 28px;
  font-weight: bold;
  color: #F5F5F5;
  margin-bottom: 20px;
  text-align: center;
`;

const InputContainer = styled.View`
  flex-direction: row;
  align-items: center;
  border-width: 1px;
  border-color: #FFB6B9;
  border-radius: 8px;
  padding-horizontal: 16px;
  margin-bottom: 20px;
  background-color: #ffffff;
`;

const Input = styled.TextInput`
  flex: 1;
  height: 50px;
  font-size: 18px;
  color: #3A506B;
`;

const ForgotPasswordButton = styled.TouchableOpacity`
  margin-bottom: 20px;
  align-self: flex-end;
`;

const ForgotPasswordText = styled.Text`
  color: #5BC0BE;
  font-size: 14px;
`;

const LoginButton = styled.TouchableOpacity`
  background-color: ${props => (props.disabled ? '#ccc' : '#FFB6B9')};
  padding: 15px;
  border-radius: 30px;
  align-items: center;
  margin-top: 10px;
`;

const ButtonText = styled.Text`
  color: #F5F5F5;
  font-size: 16px;
  font-weight: bold;
`;

const CreateAccountButton = styled.TouchableOpacity`
  margin-top: 20px;
  align-self: center;
`;

const CreateAccountText = styled.Text`
  color: #5BC0BE;
  font-size: 14px;
  font-weight: bold;
`;

const ModalContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.6);
`;

const ModalContent = styled.View`
  width: 95%;
  background-color: #F5F5F5;
  border-radius: 8px;
  padding: 20px;
  align-items: center;
`;

const ModalTitle = styled.Text`
  font-size: 24px;
  color: #3A506B;
  font-weight: bold;
  margin-bottom: 20px;
`;

const ModalInput = styled.TextInput`
  border-width: 1px;
  border-color: #B0B0B0;
  border-radius: 8px;
  padding: 12px;
  width: 100%;
  margin-bottom: 20px;
  font-size: 16px;
  color: #3A506B;
  background-color: #ffffff;
`;

const SubmitButton = styled.TouchableOpacity`
  background-color: #5BC0BE;
  padding: 15px;
  border-radius: 8px;
  width: 100%;
  align-items: center;
`;

const SubmitButtonText = styled.Text`
  color: #ffffff;
  font-size: 16px;
  font-weight: bold;
`;

const CloseButton = styled.TouchableOpacity`
  margin-top: 5px;
  background-color: #FFB6B9;
  padding: 15px;
  border-radius: 8px;  
  width: 100%;
  align-items: center;
`;

const CloseButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: bold;
`;
