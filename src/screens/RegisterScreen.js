import React, { useState } from 'react';
import { Alert } from 'react-native';
import styled from 'styled-components/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RegisterScreen({ navigation }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const handleRegister = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Email inválido', 'Por favor, insira um email válido.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Senhas não coincidem', 'Por favor, verifique suas senhas.');
      return;
    }

    try {
      await AsyncStorage.setItem('fullName', fullName);
      await AsyncStorage.setItem('email', email);
      await AsyncStorage.setItem('password', password);
      Alert.alert('Registro concluído', 'Você pode agora fazer login.');
      
      setFullName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar os dados. Tente novamente.');
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailError(emailRegex.test(email) ? '' : 'Email inválido');
    setEmail(email);
  };

  const validatePassword = (password) => {
    setPasswordError(password.length >= 8 ? '' : 'A senha precisa de pelo menos 8 caracteres');
    setPassword(password);
  };

  const validateConfirmPassword = (confirmPassword) => {
    setConfirmPasswordError(confirmPassword === password ? '' : 'As senhas não coincidem');
    setConfirmPassword(confirmPassword);
  };

  return (
    <Container>
      <Title>Criar Conta</Title>

      <InputContainer>
        <Input
          placeholder="Nome Completo"
          value={fullName}
          onChangeText={setFullName}
          autoCapitalize="words"
        />
      </InputContainer>

      {emailError ? <ErrorText>{emailError}</ErrorText> : null}
      <InputContainer>
        <Input
          placeholder="Email"
          value={email}
          onChangeText={validateEmail}
          autoCapitalize="none"
        />
      </InputContainer>

      {passwordError ? <ErrorText>{passwordError}</ErrorText> : null}
      <InputContainer>
        <Input
          placeholder="Senha"
          secureTextEntry
          value={password}
          onChangeText={validatePassword}
          autoCapitalize="none"
        />
      </InputContainer>

      {confirmPasswordError ? <ErrorText>{confirmPasswordError}</ErrorText> : null}
      <InputContainer>
        <Input
          placeholder="Confirmar Senha"
          secureTextEntry
          value={confirmPassword}
          onChangeText={validateConfirmPassword}
          autoCapitalize="none"
        />
      </InputContainer>

      <RegisterButton onPress={handleRegister}>
        <ButtonText>Registrar</ButtonText>
      </RegisterButton>
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
`;

const RegisterButton = styled.TouchableOpacity`
  background-color: #FFB6B9;
  padding: 15px;
  border-radius: 30px;
  align-items: center;
`;

const ButtonText = styled.Text`
  color: #ffffff;
  font-size: 16px;
  font-weight: bold;
`;

const ErrorText = styled.Text`
  color: #FFB6B9;
  font-size: 14px;
  margin-bottom: 5px;
`;
