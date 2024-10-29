import React, { useState } from 'react';
import { Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons'; // Ícones para exibir senha
import AsyncStorage from '@react-native-async-storage/async-storage'; // Para armazenamento local

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Função que lida com o login
  const handleLogin = async () => {
    setIsLoading(true);
    const storedUsername = await AsyncStorage.getItem('username');
    const storedPassword = await AsyncStorage.getItem('password');

    setTimeout(() => {
      if (username === storedUsername && password === storedPassword) {
        navigation.navigate('HomeTabs'); // Redireciona para as abas principais
      } else {
        Alert.alert('Credenciais Inválidas', 'Verifique seu username e senha.');
      }
      setIsLoading(false);
    }, 1000); // Simula um carregamento de 1 segundo
  };

  return (
    <Container>
      <Title>Login</Title>

      {/* Campo de input de username */}
      <InputContainer>
        <Input
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          placeholderTextColor="#B0B0B0" // Cor do texto do placeholder
        />
      </InputContainer>

      {/* Campo de input de senha com opção de mostrar/ocultar senha */}
      <InputContainer>
        <Input
          placeholder="Password"
          secureTextEntry={secureTextEntry}
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
          placeholderTextColor="#B0B0B0" // Cor do texto do placeholder
        />
        <TouchableOpacity onPress={() => setSecureTextEntry(!secureTextEntry)}>
          <Ionicons name={secureTextEntry ? 'eye-off' : 'eye'} size={24} color="#FFB6B9" />
        </TouchableOpacity>
      </InputContainer>

      {/* Botão "Esqueci minha senha" */}
      <ForgotPasswordButton onPress={() => Alert.alert('Esqueci Minha Senha', 'Agora se vira!!')}>
        <ForgotPasswordText>Esqueceu sua senha?</ForgotPasswordText>
      </ForgotPasswordButton>

      {/* Botão de login com indicador de carregamento */}
      <LoginButton onPress={handleLogin} disabled={isLoading}>
        {isLoading ? <ActivityIndicator color="#F5F5F5" /> : <ButtonText>Login</ButtonText>}
      </LoginButton>

      {/* Botão "Criar uma conta" */}
      <CreateAccountButton onPress={() => navigation.navigate('Register')}>
        <CreateAccountText>Criar uma conta</CreateAccountText>
      </CreateAccountButton>
    </Container>
  );
}

// Estilos
const Container = styled.View`
  flex: 1;
  justify-content: center;
  padding: 16px;
  background-color: #3A506B; /* Fundo escuro */
`;

const Title = styled.Text`
  font-size: 28px;
  font-weight: bold;
  color: #F5F5F5; /* Texto claro */
  margin-bottom: 20px;
  text-align: center;
`;

const InputContainer = styled.View`
  flex-direction: row;
  align-items: center;
  border-width: 1px;
  border-color: #FFB6B9; /* Rosa pastel escuro */
  border-radius: 8px;
  padding-horizontal: 16px;
  margin-bottom: 20px;
  background-color: #ffffff; /* Fundo branco para os inputs */
`;

const Input = styled.TextInput`
  flex: 1;
  height: 50px;
  font-size: 18px;
  color: #3A506B; /* Texto escuro */
`;

const LoginButton = styled.TouchableOpacity`
  background-color: ${props => (props.disabled ? '#ccc' : '#FFB6B9')}; /* Rosa pastel escuro */
  padding: 15px;
  border-radius: 30px;
  align-items: center;
`;

const ButtonText = styled.Text`
  color: #F5F5F5; /* Texto claro */
  font-size: 16px;
  font-weight: bold;
`;

const ForgotPasswordButton = styled.TouchableOpacity`
  margin-bottom: 20px;
  align-self: flex-end;
`;

const ForgotPasswordText = styled.Text`
  color: #5BC0BE; /* Rosa pastel escuro */
  font-size: 14px;
`;

const CreateAccountButton = styled.TouchableOpacity`
  margin-top: 20px;
  align-self: center;
`;

const CreateAccountText = styled.Text`
  color: #5BC0BE; /* Rosa pastel escuro */
  font-size: 14px;
  font-weight: bold;
`;
