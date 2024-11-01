import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput } from 'react-native';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DailyGoalsScreen = ({ navigation, route }) => {
  const { totalTasks, completedTasks } = route.params;
  const [reportVisible, setReportVisible] = useState(false);
  const [goals, setGoals] = useState([]);
  const [filter, setFilter] = useState(null); // Filtro para prioridades
  const [newGoal, setNewGoal] = useState(''); // Texto da nova meta

  // Carrega as metas do armazenamento ao iniciar o aplicativo
  useEffect(() => {
    loadGoals();
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

  const saveGoals = async (updatedGoals) => {
    try {
      await AsyncStorage.setItem('goals', JSON.stringify(updatedGoals));
    } catch (error) {
      console.error("Erro ao salvar metas", error);
    }
  };

  const generateReport = () => {
    setReportVisible(true);
  };

  const closeReport = () => {
    setReportVisible(false);
  };

  const addGoal = () => {
    if (newGoal.trim() && filter) {
      const updatedGoals = [...goals, { text: newGoal, priority: filter }];
      setGoals(updatedGoals);
      saveGoals(updatedGoals); // Salva as metas no AsyncStorage
      setNewGoal('');
    }
  };

  return (
    <Container>
      <Title>Objetivos do Dia</Title>

      <ProgressIndicator totalTasks={totalTasks} completedTasks={completedTasks} />

      {/* Filtro de Prioridade */}
      <FilterContainer>
        {['Alta', 'Média', 'Baixa'].map((priority) => (
          <FilterTag
            key={priority}
            priority={priority}
            isSelected={filter === priority}
            onPress={() => setFilter(filter === priority ? null : priority)}
          >
            <FilterTagText isSelected={filter === priority}>{priority}</FilterTagText>
          </FilterTag>
        ))}
      </FilterContainer>

      {/* Campo de Adição de Metas */}
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

      {/* Lista de Metas */}
      <GoalList>
        {goals
          .filter((goal) => (filter ? goal.priority === filter : true))
          .map((goal, index) => (
            <GoalItem key={index}>
              <GoalText>{goal.text}</GoalText>
              <PriorityTag priority={goal.priority} />
            </GoalItem>
          ))}
      </GoalList>

      {/* Botão e Modal do Relatório */}
      <HomeButton onPress={() => navigation.navigate('HomeTabs', { screen: 'Home' })}>
        <Ionicons name="arrow-back" size={28} color="#fff" />
      </HomeButton>

      <ReportButton onPress={generateReport}>
        <ButtonText>Gerar Relatório</ButtonText>
      </ReportButton>

      <Modal visible={reportVisible} animationType="slide" transparent={true}>
        <ModalContainer>
          <ModalContent>
            <ReportTitle>Relatório do Dia</ReportTitle>
            <ReportText>Tarefas Totais: {totalTasks}</ReportText>
            <ReportText>Tarefas Concluídas: {completedTasks}</ReportText>
            <ReportText>Tarefas Pendentes: {totalTasks - completedTasks}</ReportText>
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
`;

const PriorityTag = styled.View`
  background-color: ${({ priority }) =>
    priority === 'Alta' ? '#E94F4F' : priority === 'Média' ? '#FFA500' : '#83E509'};
  width: 18px;
  height: 18px;
  border-radius: 9px;
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
  margin-horizontal: 5px;
  shadow-color: #000;
  shadow-opacity: 0.2;
  shadow-radius: 6px;
  elevation: 3;
`;

const FilterTagText = styled.Text`
  color: ${({ isSelected }) => (isSelected ? '#1C2541' : '#fff')};
  font-weight: bold;
  font-size: 16px;
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

export default DailyGoalsScreen;
