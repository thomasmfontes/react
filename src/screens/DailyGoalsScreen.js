import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons'; 

const DailyGoalsScreen = ({ navigation, route }) => {
  const { totalTasks, completedTasks } = route.params;
  const [reportVisible, setReportVisible] = useState(false);

  const generateReport = () => {
    setReportVisible(true);
  };

  const closeReport = () => {
    setReportVisible(false);
  };

  const getFeedbackMessage = () => {
    if (completedTasks === totalTasks) {
      return "Parabéns! Você concluiu todos os objetivos do dia. Excelente trabalho!";
    } else if (completedTasks > totalTasks * 0.6) {
      return "Ótimo desempenho! Você concluiu a maioria das metas. Continue assim!";
    } else {
      return "Você completou algumas metas, mas há espaço para melhorar.";
    }
  };

  // Estado das metas com prioridades que podem ser alteradas pelo usuário
  const [goals, setGoals] = useState([
    { text: 'Alcançar Metas', priority: 'Alta' },
    { text: 'Focar nos Estudos', priority: 'Média' },
    { text: 'Ficar Calmo', priority: 'Baixa' },
  ]);

  // Função para alterar a prioridade
  const handlePriorityChange = (index, newPriority) => {
    const updatedGoals = [...goals];
    updatedGoals[index].priority = newPriority;
    setGoals(updatedGoals);
  };

  return (
    <Container>
      <Title>Objetivos do Dia</Title>

      <ProgressIndicator totalTasks={totalTasks} completedTasks={completedTasks}/>
      
      <GoalList>
        {goals.map((goal, index) => (
          <GoalItem key={index}>
            <GoalText>{goal.text}</GoalText>
            <PriorityTagContainer>
              {['Alta', 'Média', 'Baixa'].map((priority) => (
                <TouchableOpacity
                  key={priority}
                  onPress={() => handlePriorityChange(index, priority)}
                >
                  <PriorityTag priority={priority} selected={goal.priority === priority} />
                </TouchableOpacity>
              ))}
            </PriorityTagContainer>
          </GoalItem>
        ))}
      </GoalList>

      <HomeButton onPress={() => navigation.navigate('HomeTabs', { screen: 'Home' })}>
        <Ionicons name="arrow-back" size={28} color="#fff" />
      </HomeButton>

      <DailySummary completedTasks={completedTasks} totalTasks={totalTasks} />

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
            <ReportText style={{ marginTop: 10 }}>Feedback:</ReportText>
            <FeedbackText>{getFeedbackMessage()}</FeedbackText>
            <CloseButton onPress={closeReport}>
              <CloseButtonText>Fechar Relatório</CloseButtonText>
            </CloseButton>
          </ModalContent>
        </ModalContainer>
      </Modal>
    </Container>
  );
};

// Definição de ProgressIndicator
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

// Estilos para ProgressIndicator e outros componentes
const Container = styled.View`
  flex: 1;
  padding: 20px;
  background-color: #3A506B;
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
  shadow-color: #000;
  shadow-opacity: 0.2;
  shadow-radius: 5px;
`;

const Title = styled.Text`
  font-size: 28px;
  font-weight: bold;
  color: #F5F5F5;
  text-align: center;
  margin-top: 20px;
  margin-bottom: 20px;
`;

const GoalList = styled.ScrollView`
  margin-top: 20px;
`;

const GoalItem = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: #1C2541;
  padding: 15px;
  margin-bottom: 12px;
  border-radius: 12px;
  shadow-color: #000;
  shadow-opacity: 0.15;
  shadow-radius: 6px;
  elevation: 3;
`;

const GoalText = styled.Text`
  font-size: 18px;
  font-weight: 500;
  color: #F5F5F5;
`;

const PriorityTagContainer = styled.View`
  flex-direction: row;
`;

const PriorityTag = styled.View`
  background-color: ${({ priority }) =>
    priority === 'Alta' ? '#E94F4F' : priority === 'Média' ? '#FFA500' : '#83E509'};
  width: ${({ selected }) => (selected ? 24 : 16)}px;
  height: ${({ selected }) => (selected ? 24 : 16)}px;
  border-radius: ${({ selected }) => (selected ? 12 : 8)}px;
  margin-right: 8px;
  border-width: ${({ selected }) => (selected ? 2 : 0)}px;
  border-color: ${({ selected }) => (selected ? '#000' : 'transparent')};
  opacity: ${({ selected }) => (selected ? 1 : 0.5)};
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

const DailySummary = ({ completedTasks, totalTasks }) => (
  <SummaryContainer>
    <SummaryText>Hoje você completou {completedTasks} de {totalTasks} objetivos.</SummaryText>
  </SummaryContainer>
);

const SummaryContainer = styled.View`
  padding: 18px;
  background-color: #2B3A4A;
  margin-top: 20px;
  border-radius: 12px;
  shadow-color: #000;
  shadow-opacity: 0.1;
  shadow-radius: 5px;
  elevation: 3;
`;

const SummaryText = styled.Text`
  font-size: 16px;
  color: #F5F5F5;
  text-align: center;
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
  shadow-color: #000;
  shadow-opacity: 0.25;
  shadow-radius: 10px;
  elevation: 5;
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

const FeedbackText = styled.Text`
  font-size: 15px;
  color: #4CAF50;
  font-style: italic;
  margin-top: 5px;
  text-align: center;
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
