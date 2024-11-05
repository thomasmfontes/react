import React, { useState, useEffect } from 'react';
import { Alert, Animated, Easing, ScrollView } from 'react-native';
import styled from 'styled-components/native';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

export default function MoodDiaryScreen({ navigation }) {
  const [mood, setMood] = useState('');
  const [note, setNote] = useState('');
  const [moodHistory, setMoodHistory] = useState([]);
  const [animation] = useState(new Animated.Value(1));
  const [sound, setSound] = useState();

  useEffect(() => {
    const loadMoodHistory = async () => {
      try {
        const storedMoodHistory = await AsyncStorage.getItem('moodHistory');
        if (storedMoodHistory) {
          setMoodHistory(JSON.parse(storedMoodHistory));
        }
      } catch (error) {
        console.error("Erro ao carregar o histórico de humor", error);
      }
    };
    loadMoodHistory();
  }, []);

  async function playSound() {
    const { sound } = await Audio.Sound.createAsync(
      require('../../assets/som/success.mp3')
    );
    setSound(sound);
    await sound.playAsync();
  }

  const handleSaveMood = async () => {
    const today = new Date().toLocaleDateString();

    if (moodHistory.some(entry => entry.date === today)) {
      Alert.alert("Humor já registrado", "Você já registrou seu humor hoje.");
      return;
    }

    if (mood && note) {
      const newEntry = { mood, note, date: today };
      const updatedMoodHistory = [...moodHistory, newEntry];
      setMoodHistory(updatedMoodHistory);

      try {
        await AsyncStorage.setItem('moodHistory', JSON.stringify(updatedMoodHistory));
      } catch (error) {
        console.error("Erro ao salvar histórico de humor", error);
      }

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

      playSound();
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
      {/* Seção Fixa */}
      <Title>Diário de Humor</Title>

      <Section>
        <MoodLabel>
          <Ionicons name="happy-outline" size={20} color="#F5F5F5" /> Como está seu humor hoje?
        </MoodLabel>
        <MoodOptionsContainer>{renderMoodOptions()}</MoodOptionsContainer>
      </Section>

      <Section>
        <MoodLabel>
          <Ionicons name="create-outline" size={20} color="#F5F5F5" /> Escreva sobre o seu dia
        </MoodLabel>
        <Input
          value={note}
          onChangeText={setNote}
          placeholder="Escreva sobre o seu dia..."
          multiline
        />
      </Section>

      <SaveButton onPress={handleSaveMood}>
        <Animated.View style={{ transform: [{ scale: animation }] }}>
          <ButtonText>Salvar Humor</ButtonText>
        </Animated.View>
      </SaveButton>

      {/* Seção Rolável do Histórico */}
      <HistoryContainer>
        <HistoryTitle>Histórico da Semana</HistoryTitle>
        <ScrollView>{renderMoodHistory()}</ScrollView>
      </HistoryContainer>
    </Container>
  );
}

// Estilos dos Componentes
const Container = styled.View`
  flex: 1;
  background-color: #3A506B;
  padding: 16px;
`;

const Title = styled.Text`
  font-size: 28px;
  font-weight: bold;
  color: #F5F5F5;
  margin-top: 30px;
  margin-bottom: 5px;
  text-align: center;
`;

const Section = styled.View`
  background-color: #2E4159;
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 10px;
`;

const MoodLabel = styled.Text`
  font-size: 18px;
  color: #B0B0B0;
  margin-bottom: 0;
  font-weight: bold;
`;

const MoodOptionsContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
`;

const MoodChip = styled.TouchableOpacity`
  background-color: ${props => (props.selected ? '#5BC0BE' : '#C5C6C7')};
  border: 2px solid ${props => (props.selected ? '#5BC0BE' : '#6C757D')};
  border-radius: 25px;
  padding: 10px 20px;
  margin: 5px;
  align-items: center;
  justify-content: center;
`;

const MoodText = styled.Text`
  font-size: 30px;
  color: ${props => (props.selected ? '#F5F5F5' : '#B0B0B0')};
`;

const Input = styled.TextInput`
  height: 70px;
  border-color: #6C757D;
  border-width: 1px;
  border-radius: 5px;
  padding-horizontal: 16px;
  margin-bottom: 0;
  font-size: 18px;
  background-color: #ffffff;
  text-align-vertical: top;
  padding: 5px;
`;

const SaveButton = styled.TouchableOpacity`
  background-color: #FFB6B9;
  padding: 15px;
  border-radius: 30px;
  align-items: center;
  margin-bottom: 5px;
`;

const ButtonText = styled.Text`
  color: #F5F5F5;
  font-size: 16px;
  font-weight: bold;
`;

const HistoryContainer = styled.View`
  flex: 1;
`;

const HistoryTitle = styled.Text`
  font-size: 22px;
  font-weight: bold;
  color: #F5F5F5;
  margin-bottom: 10px;
`;

const HistoryEntry = styled.View`
  background-color: #C5C6C7;
  padding: 10px;
  border-radius: 10px;
  margin-bottom: 10px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);
  elevation: 3;
`;

const HistoryDate = styled.Text`
  font-size: 14px;
  font-weight: bold;
  color: #333;
`;

const HistoryMood = styled.Text`
  font-size: 24px;
  color: #5BC0BE;
`;

const HistoryNote = styled.Text`
  font-size: 16px;
  color: #333;
  margin-top: 5px;
`;
