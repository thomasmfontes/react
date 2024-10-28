import React, { useState, useEffect } from 'react';
import { Alert, ScrollView, Animated, Easing } from 'react-native';
import styled from 'styled-components/native';
import { Audio } from 'expo-av'; // Importação do pacote expo-av

export default function MoodDiaryScreen({ navigation }) {
  const [mood, setMood] = useState('');
  const [note, setNote] = useState('');
  const [moodHistory, setMoodHistory] = useState([]);
  const [animation] = useState(new Animated.Value(1));
  const [sound, setSound] = useState();

  // Função para carregar e tocar o som
  async function playSound() {
    const { sound } = await Audio.Sound.createAsync(
      require('../../assets/som/success.mp3') // Adicione o caminho do seu arquivo de áudio aqui
    );
    setSound(sound);
    await sound.playAsync();
  }

  // Descarregar o som quando o componente for desmontado
  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync(); // Libera a memória do som quando o componente for desmontado
        }
      : undefined;
  }, [sound]);

  const handleSaveMood = () => {
    if (mood && note) {
      const newEntry = { mood, note, date: new Date().toLocaleDateString() };
      setMoodHistory([...moodHistory, newEntry]);

      Animated.sequence([
        Animated.timing(animation, {
          toValue: 0.5,
          duration: 100,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(animation, {
          toValue: 1,
          duration: 100,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ]).start();

      playSound(); // Toca o som ao salvar

      Alert.alert('Humor Salvo', `Humor "${mood}" foi salvo com sucesso.`);
      setMood('');
      setNote('');
    } else {
      Alert.alert('Erro', 'Por favor, escolha um humor e adicione uma nota sobre o seu dia.');
    }
  };

  const renderMoodOptions = () => {
    const moods = ['😀', '😐', '😢', '😡', '🤔'];
    return moods.map((emoji, index) => (
      <MoodChip
        key={index}
        onPress={() => setMood(emoji)}
        selected={mood === emoji}
      >
        <MoodText selected={mood === emoji}>{emoji}</MoodText>
      </MoodChip>
    ));
  };

  const renderMoodHistory = () => {
    return moodHistory.map((entry, index) => (
      <HistoryEntry key={index}>
        <HistoryDate>{entry.date}</HistoryDate>
        <HistoryMood>{entry.mood}</HistoryMood>
        <HistoryNote>{entry.note}</HistoryNote>
      </HistoryEntry>
    ));
  };

  return (
    <Container>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
        <Title>Diário de Humor</Title>

        <MoodContainer>
          <MoodLabel>Como está seu humor hoje?</MoodLabel>
          <MoodOptionsContainer>{renderMoodOptions()}</MoodOptionsContainer>
        </MoodContainer>

        <Input
          value={note}
          onChangeText={setNote}
          placeholder="Escreva sobre o seu dia..."
          multiline
        />

        <SaveButton onPress={handleSaveMood}>
          <Animated.View style={{ transform: [{ scale: animation }] }}>
            <ButtonText>Salvar Humor</ButtonText>
          </Animated.View>
        </SaveButton>

        <HistoryContainer>
          <HistoryTitle>Histórico da Semana</HistoryTitle>
          {renderMoodHistory()}
        </HistoryContainer>
      </ScrollView>
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  background-color: #3A506B; /* Cor de fundo pastel escura */
  padding: 16px;
`;

const Title = styled.Text`
  font-size: 28px;
  font-weight: bold;
  color: #F5F5F5; /* Texto claro */
  margin-bottom: 20px;
  text-align: center;
`;

const MoodContainer = styled.View`
  margin-bottom: 20px;
  align-items: center;
`;

const MoodLabel = styled.Text`
  font-size: 18px;
  color: #B0B0B0; /* Texto cinza claro */
  margin-bottom: 10px;
`;

const MoodOptionsContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
`;

const MoodChip = styled.TouchableOpacity`
  background-color: ${props => (props.selected ? '#5BC0BE' : '#C5C6C7')}; /* Azul pastel para selecionado, cinza claro para não selecionado */
  border: 2px solid ${props => (props.selected ? '#5BC0BE' : '#6C757D')}; /* Azul pastel para selecionado, cinza escuro para não selecionado */
  border-radius: 25px;
  padding: 10px 20px;
  margin: 5px;
  align-items: center;
  justify-content: center;
`;

const MoodText = styled.Text`
  font-size: 30px;
  color: ${props => (props.selected ? '#F5F5F5' : '#B0B0B0')}; /* Branco para selecionado, cinza claro para não selecionado */
`;

const Input = styled.TextInput`
  height: 100px;
  border-color: #6C757D; /* Cinza escuro */
  border-width: 1px;
  border-radius: 12px;
  padding-horizontal: 16px;
  margin-bottom: 20px;
  font-size: 18px;
  background-color: #ffffff; /* Fundo branco */
  text-align-vertical: top;
  padding: 5px;
`;

const SaveButton = styled.TouchableOpacity`
  background-color: #FFB6B9; /* Rosa pastel escuro */
  padding: 15px;
  border-radius: 30px;
  align-items: center;
  margin-bottom: 20px;
`;

const ButtonText = styled.Text`
  color: #F5F5F5; /* Texto claro */
  font-size: 16px;
  font-weight: bold;
`;

const HistoryContainer = styled.View`
  margin-top: 20px;
`;

const HistoryTitle = styled.Text`
  font-size: 22px;
  font-weight: bold;
  color: #F5F5F5; /* Texto claro */
  margin-bottom: 10px;
`;

const HistoryEntry = styled.View`
  background-color: #C5C6C7; /* Fundo cinza claro */
  padding: 10px;
  border-radius: 10px;
  margin-bottom: 10px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.2;
  shadow-radius: 4px;
  elevation: 3;
`;

const HistoryDate = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: #B0B0B0; /* Texto cinza claro */
`;

const HistoryMood = styled.Text`
  font-size: 24px;
  color: #5BC0BE; /* Azul pastel */
`;

const HistoryNote = styled.Text`
  font-size: 16px;
  color: #F5F5F5; /* Texto claro */
  margin-top: 5px;
`;

