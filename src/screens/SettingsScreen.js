// src/screens/SettingsScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import styled from 'styled-components/native';

export default function SettingsScreen() {
  return (
    <Container>
      <Title>Settings</Title>
      <Text>Configure your settings here.</Text>
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background-color: #E6D1B4;
`;

const Title = styled.Text`
  font-size: 30px;
  font-weight: bold;
  color: #0F2C33;
  margin-bottom: 20px;
`;
