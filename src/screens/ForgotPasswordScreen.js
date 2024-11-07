import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import styled from 'styled-components/native';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');

  const handlePasswordReset = () => {
    // Simule o envio da solicitação de redefinição de senha
    Alert.alert(
      'Recuperação de Senha',
      `Um link de redefinição foi enviado para: ${email}`
    );
  };

  return (
    <Container>
      <Title>Recuperar Senha</Title>
      <TextInputStyled
        placeholder="Digite seu email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <SubmitButton onPress={handlePasswordReset}>
        <SubmitButtonText>Enviar Link de Recuperação</SubmitButtonText>
      </SubmitButton>
    </Container>
  );
}

// Estilos
const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 16px;
  background-color: #3A506B;
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: #FFB6B9;
  margin-bottom: 20px;
`;

const TextInputStyled = styled.TextInput`
  width: 100%;
  padding: 12px;
  margin-bottom: 20px;
  border-width: 1px;
  border-color: #FFB6B9;
  border-radius: 8px;
  background-color: #ffffff;
  font-size: 16px;
  color: #3A506B;
`;

const SubmitButton = styled.TouchableOpacity`
  background-color: #66BB6A;
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
