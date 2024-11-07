import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, Animated, Easing, Alert } from 'react-native';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PieChart } from 'react-native-chart-kit';

const DailyGoalsScreen = ({ navigation, route }) => {
  const { totalTasks, completedTasks } = route.params;
  const [reportVisible, setReportVisible] = useState(false);
  const [goals, setGoals] = useState([]);
  const [filter, setFilter] = useState(null); 
  const [newGoal, setNewGoal] = useState('');
  const [latestMood, setLatestMood] = useState(null);
  const [isMoodOutdated, setIsMoodOutdated] = useState(false);
  const animation = new Animated.Value(0);

  useEffect(() => {
    loadGoals();
    loadLatestMood();
  }, []);

  const loadGoals = async () => {
    try {
      const storedGoals = await AsyncStorage.getItem('goals');
      if (storedGoals) {
        setGoals(JSON.parse(storedGoals));
      }
    } catch (error) {
      console.error("Erro ao carregar metas", error);
    }
  };
  
  const loadLatestMood = async () => {
    try {
      const storedMoodHistory = await AsyncStorage.getItem('moodHistory');
      if (storedMoodHistory) {
        const moodHistory = JSON.parse(storedMoodHistory);
        const latestMoodEntry = moodHistory[moodHistory.length - 1];
  
        const today = new Date().toLocaleDateString();
        if (latestMoodEntry.date === today) {
          setLatestMood(latestMoodEntry);
          setIsMoodOutdated(false);
        } else {
          setIsMoodOutdated(true);
        }
      } else {
        setIsMoodOutdated(true);
      }
    } catch (error) {
      console.error("Erro ao carregar o humor", error);
    }
  };

  const saveGoals = async (updatedGoals) => {
    try {
      await AsyncStorage.setItem('goals', JSON.stringify(updatedGoals));
    } catch (error) {
      console.error("Erro ao salvar metas", error);
    }
  };

  const addGoal = () => {
    if (newGoal.trim() && filter) {
      const updatedGoals = [...goals, { text: newGoal, priority: filter }];
      setGoals(updatedGoals);
      saveGoals(updatedGoals);
      setNewGoal('');
      
      Animated.sequence([
        Animated.timing(animation, { toValue: 1, duration: 200, easing: Easing.ease, useNativeDriver: true }),
        Animated.timing(animation, { toValue: 0, duration: 200, easing: Easing.ease, useNativeDriver: true })
      ]).start();
    } else {
      Alert.alert('Erro', 'Preencha a meta e selecione a prioridade.');
    }
  };

  const deleteGoal = (index) => {
    const updatedGoals = goals.filter((_, i) => i !== index);
    setGoals(updatedGoals);
    saveGoals(updatedGoals);
  };

  const generateReport = () => {
    setReportVisible(true);
  };

  const closeReport = () => {
    setReportVisible(false);
  };

  const progress = totalTasks ? (completedTasks / totalTasks) * 100 : 0;

  const pieData = [
    {
      name: "Concluídas",
      tasks: completedTasks,
      color: "#50fa7b",
      legendFontColor: "#333",
      legendFontSize: 14
    },
    {
      name: "Pendentes",
      tasks: totalTasks - completedTasks,
      color: "#E94F4F",
      legendFontColor: "#333",
      legendFontSize: 14
    }
  ];
  return (
    <Container>
      <Title>Objetivos do Dia</Title>

      {/* Exibição do Humor com Condição na Tela Principal */}
      {isMoodOutdated ? (
        <TouchableOpacity onPress={() => navigation.navigate('HomeTabs', { screen: 'Humor' })}>
          <CompactMoodCard>
            <MoodEmoji>
              <Ionicons name="close-circle" size={50} color="red" />
            </MoodEmoji>
            <MoodInfo>
              <MoodDate>Humor não salvo</MoodDate>
              <MoodNote>Salve seu humor para o dia de hoje</MoodNote>
            </MoodInfo>
          </CompactMoodCard>
        </TouchableOpacity>
      ) : (
        latestMood && (
          <CompactMoodCard>
            <MoodEmoji>
              <EmojiText>{latestMood.mood}</EmojiText>
            </MoodEmoji>
            <MoodInfo>
              <MoodDate>{latestMood.date}</MoodDate>
              <MoodNote>{latestMood.note}</MoodNote>
            </MoodInfo>
          </CompactMoodCard>
        )
      )}

      <ProgressIndicator totalTasks={totalTasks} completedTasks={completedTasks} />

      <FilterContainer>
        {['Alta', 'Média', 'Baixa'].map((priority) => (
          <FilterTag
            key={priority}
            priority={priority}
            isSelected={filter === priority}
            onPress={() => setFilter(filter === priority ? null : priority)}
          >
            <Ionicons
              name={
                priority === 'Alta' ? 'arrow-up-circle' :
                  priority === 'Média' ? 'remove-circle' : 'arrow-down-circle'
              }
              size={20}
              color={filter === priority ? '#1C2541' : '#fff'}
            />
            <FilterTagText isSelected={filter === priority}>{priority}</FilterTagText>
          </FilterTag>
        ))}
      </FilterContainer>

      {filter && (
        <AddGoalContainer>
          <GoalInput
            placeholder={`Adicionar meta ${filter}`}
            placeholderTextColor="#fff"
            value={newGoal}
            onChangeText={setNewGoal}
          />
          <AddGoalButton onPress={addGoal}>
            <Ionicons name="add-circle" size={28} color="#1C2541" />
          </AddGoalButton>
        </AddGoalContainer>
      )}

      <GoalList>
        {goals
          .filter((goal) => (filter ? goal.priority === filter : true))
          .map((goal, index) => (
            <GoalItem key={index}>
              <GoalText>{goal.text}</GoalText>
              <PriorityTag priority={goal.priority} />
              <DeleteButton onPress={() => deleteGoal(index)}>
                <Ionicons name="trash" size={24} color="#fff" />
              </DeleteButton>
            </GoalItem>
          ))}
      </GoalList>

      <HomeButton onPress={() => navigation.navigate('HomeTabs', { screen: 'Home' })}>
        <Ionicons name="arrow-back" size={28} color="#fff" />
      </HomeButton>

      <ReportButton onPress={generateReport}>
        <ButtonText>Gerar Relatório</ButtonText>
      </ReportButton>

      {/* Modal do Relatório */}
      <Modal visible={reportVisible} animationType="slide" transparent={true}>
        <ModalContainer>
          <ModalContent>
            <ReportTitle>Relatório do Dia</ReportTitle>

            <PieChart
              data={pieData}
              width={300}
              height={200}
              chartConfig={{
                color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
              }}
              accessor={"tasks"}
              backgroundColor={"transparent"}
              paddingLeft={"15"}
              absolute
            />

            {/* Cartão de Humor no Relatório */}
            {isMoodOutdated ? (
              <MoodReportCard isOutdated={true}>
                <MoodReportEmoji>
                  <Ionicons name="close-circle" size={60} color="red" />
                </MoodReportEmoji>
                <MoodReportTitle>Humor do Dia</MoodReportTitle>
                <MoodReportNote>Humor não salvo para o dia de hoje.</MoodReportNote>
              </MoodReportCard>
            ) : (
              latestMood && (
                <MoodReportCard isOutdated={false}>
                  <MoodReportEmoji>{latestMood.mood}</MoodReportEmoji>
                  <MoodReportTitle>Humor do Dia</MoodReportTitle>
                  <MoodReportNote>"{latestMood.note}"</MoodReportNote>
                  <MoodReportDate>{latestMood.date}</MoodReportDate>
                </MoodReportCard>
              )
            )}

            <CloseButton onPress={closeReport}>
              <CloseButtonText>Fechar Relatório</CloseButtonText>
            </CloseButton>
          </ModalContent>
        </ModalContainer>
      </Modal>
    </Container>
  );

};

// Estilos dos Componentes

const Container = styled.View`
  flex: 1;
  padding: 20px;
  background-color: #3A506B;
`;

const Title = styled.Text`
  font-size: 28px;
  font-weight: bold;
  color: #F5F5F5;
  text-align: center;
  margin-top: 20px;
  margin-bottom: 20px;
`;

const CompactMoodCard = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 10px 15px;
  background-color: #ffffff;
  border-radius: 12px;
  margin-vertical: 10px;
  shadow-color: #000;
  shadow-opacity: 0.1;
  shadow-radius: 5px;
  elevation: 5;
`;

const MoodEmoji = styled.View`
  width: 50px;
  height: 50px;
  justify-content: center;
  align-items: center;
  margin-right: 15px;
`;

const EmojiText = styled.Text`
  font-size: 30px; /* Tamanho grande para o emoji */
`;

const MoodInfo = styled.View`
  flex: 1;
`;

const MoodDate = styled.Text`
  font-size: 14px;
  color: #888;
  margin-bottom: 4px;
`;

const MoodNote = styled.Text`
  font-size: 16px;
  color: #333;
`;



const MoodReportCard = styled.View`
  background-color: ${({ isOutdated }) => (isOutdated ? '#FAD4D4' : '#e0f7fa')}; /* Condicional para vermelho pastel */
  padding: 20px;
  border-radius: 12px;
  margin-top: 20px;
  align-items: center;
  justify-content: center;
`;

const MoodReportEmoji = styled.Text`
  font-size: 40px; /* Tamanho grande para o emoji */
  margin-bottom: 10px;
`;

const MoodReportTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: #1c2541;
  margin-bottom: 5px;
`;

const MoodReportNote = styled.Text`
  font-size: 16px;
  font-style: italic;
  color: #333;
  text-align: center;
  margin-bottom: 10px;
`;

const MoodReportDate = styled.Text`
  font-size: 14px;
  color: #888;
`;


const ProgressIndicator = ({ totalTasks, completedTasks }) => {
  const progress = totalTasks ? (completedTasks / totalTasks) * 100 : 0;
  return (
    <View>
      <Text style={styles.progressText}>Progresso: {completedTasks}/{totalTasks}</Text>
      <ProgressContainer>
        <ProgressBar progress={progress} />
      </ProgressContainer>
    </View>
  );
};

const GoalList = styled.ScrollView`
  margin-top: 20px;
`;

const GoalItem = styled.View`
  background-color: #1C2541;
  padding: 15px;
  margin-bottom: 12px;
  border-radius: 12px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const GoalText = styled.Text`
  font-size: 18px;
  color: #F5F5F5;
  flex: 1;
`;

const PriorityTag = styled.View`
  background-color: ${({ priority }) =>
    priority === 'Alta' ? '#E94F4F' : priority === 'Média' ? '#FFA500' : '#83E509'};
  width: 18px;
  height: 18px;
  border-radius: 9px;
  margin-right: 10px;
`;

const DeleteButton = styled.TouchableOpacity`
  padding: 5px;
`;

const ProgressContainer = styled.View`
  width: 100%;
  background-color: #6C757D;
  height: 15px;
  border-radius: 10px;
  margin-top: 15px;
  overflow: hidden;
`;

const ProgressBar = styled.View`
  background-color: #5BC0BE;
  height: 100%;
  width: ${({ progress }) => progress}%;
  border-radius: 10px;
`;

const FilterContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 20px;
`;

const FilterTag = styled.TouchableOpacity`
  padding: 10px 20px;
  background-color: ${({ isSelected, priority }) =>
    isSelected
      ? priority === 'Alta'
        ? '#ff5555'
        : priority === 'Média'
          ? '#ffaa00'
          : '#50fa7b'
      : '#44475a'};
  border-radius: 30px;
  flex-direction: row;
  align-items: center;
  shadow-color: #000;
  shadow-opacity: 0.2;
  shadow-radius: 6px;
  elevation: 3;
`;

const FilterTagText = styled.Text`
  color: ${({ isSelected }) => (isSelected ? '#1C2541' : '#fff')};
  font-weight: bold;
  font-size: 16px;
  margin-left: 8px;
`;

const AddGoalContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 10px;
  padding: 10px;
  border-radius: 12px;
  background-color: #1c1e24;
`;

const GoalInput = styled.TextInput`
  flex: 1;
  background-color: #282a36;
  color: #ffffff;
  padding: 10px;
  border-radius: 8px;
  margin-right: 10px;
`;

const AddGoalButton = styled.TouchableOpacity`
  background-color: #50fa7b;
  padding: 10px 15px;
  border-radius: 8px;
`;

const HomeButton = styled.TouchableOpacity`
  background-color: #5BC0BE;
  position: absolute;
  top: 40px;
  left: 20px;
  width: 40px;
  height: 40px;
  border-radius: 30px;
  justify-content: center;
  align-items: center;
`;

const ReportButton = styled.TouchableOpacity`
  background-color: #5BC0BE;
  padding: 15px;
  border-radius: 12px;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
`;

const ButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: bold;
`;

const ModalContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

const ModalContent = styled.View`
  width: 80%;
  background-color: #FFF;
  padding: 20px;
  border-radius: 10px;
  align-items: center;
`;

const ReportTitle = styled.Text`
  font-size: 22px;
  font-weight: bold;
  color: #3A506B;
  margin-bottom: 15px;
`;

const ReportText = styled.Text`
  font-size: 16px;
  color: #333;
  text-align: left;
  width: 100%;
`;

const CloseButton = styled.TouchableOpacity`
  background-color: #5BC0BE;
  padding: 12px;
  border-radius: 8px;
  margin-top: 20px;
  width: 100%;
`;

const CloseButtonText = styled.Text`
  color: #FFF;
  font-size: 16px;
  text-align: center;
`;

const styles = StyleSheet.create({
  progressText: {
    color: '#F5F5F5',
    textAlign: 'center',
    fontSize: 16,
  },
});

// Novo estilo para o X vermelho
const OutdatedMood = styled.View`
  align-items: center;
  margin-bottom: 15px;
`;

export default DailyGoalsScreen;
