import React, { useState } from 'react';
import { Alert, Share, ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';
import { FontAwesome } from '@expo/vector-icons';

export default function RandomQuoteScreen() {
  const [quote, setQuote] = useState('Click the button to get a random quote');
  const [isLoading, setIsLoading] = useState(false);

  const quotes = [
    'A melhor maneira de prever o futuro é criá-lo.',
    'O sucesso não é o quão alto você subiu, mas como você faz uma diferença positiva para o mundo.',
    'O sucesso geralmente vem para aqueles que estão ocupados demais para procurá-lo.',
    'Não fique envergonhado por seus fracassos, aprenda com eles e comece de novo.',
    'Não olhe para o relógio; faça o que ele faz. Continue.'
  ];

  const fetchQuote = () => {
    setIsLoading(true);
    setTimeout(() => {
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
      setQuote(randomQuote);
      setIsLoading(false);
    }, 1000); // Simula um carregamento
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: quote,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share the quote.');
    }
  };

  return (
    <Container>
      <Title>Inspiração para hoje</Title>
      <QuoteText>{quote}</QuoteText>
      <ButtonContainer>
        <StyledButton onPress={fetchQuote} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <FontAwesome name="refresh" size={24} color="#fff" />
              <ButtonText>Gerar</ButtonText>
            </>
          )}
        </StyledButton>
        <StyledButton onPress={handleShare}>
          <FontAwesome name="share-alt" size={24} color="#fff" />
          <ButtonText>Enviar</ButtonText>
        </StyledButton>
      </ButtonContainer>
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background-color: #3A506B; /* Cor de fundo pastel escura */
`;

const Title = styled.Text`
  font-size: 26px;
  font-weight: bold;
  color: #F5F5F5; /* Texto claro */
  margin-bottom: 20px;
  text-align: center;
`;

const QuoteText = styled.Text`
  font-size: 20px;
  color: #B0B0B0; /* Texto cinza claro */
  text-align: center;
  font-style: italic;
  margin-bottom: 30px;
  padding-horizontal: 20px;
`;

const ButtonContainer = styled.View`
  flex-direction: row;
  justify-content: space-around;
  width: 100%;
`;

const StyledButton = styled.TouchableOpacity`
  background-color: #FFB6B9; /* Rosa pastel escuro */
  padding: 15px;
  border-radius: 25px;
  width: 40%;
  align-items: center;
  flex-direction: row;
  justify-content: center;
  elevation: 5;
  margin: 5px;
`;

const ButtonText = styled.Text`
  color: #F5F5F5; /* Texto claro */
  font-size: 16px;
  font-weight: bold;
  margin-left: 10px;
`;

