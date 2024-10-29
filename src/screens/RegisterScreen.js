import React, { useState } from 'react';
import { Alert } from 'react-native';
import styled from 'styled-components/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Senhas não coincidem', 'Por favor, verifique suas senhas.');
      return;
    }

    try {
      await AsyncStorage.setItem('email', email);
      await AsyncStorage.setItem('password', password);
      Alert.alert('Registro concluído', 'Você pode agora fazer login.');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar os dados. Tente novamente.');
    }
  };

  return (
    <Container>
      <Title>Criar Conta</Title>

      {/* Campo de input de username */}
      <InputContainer>
        <Input
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
      </InputContainer>

      {/* Campo de input de senha */}
      <InputContainer>
        <Input
          placeholder="Senha"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
        />
      </InputContainer>

      {/* Campo de confirmação de senha */}
      <InputContainer>
        <Input
          placeholder="Confirmar Senha"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          autoCapitalize="none"
        />
      </InputContainer>

      {/* Botão de registro */}
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
