import React, { useState } from 'react';
import { View, Modal, TouchableOpacity, TextInput, FlatList, Animated } from 'react-native';
import { Calendar } from 'react-native-calendars';
import styled from 'styled-components/native';

const initialTasks = {
  '2024-08-01': [{ id: '1', text: 'Comprar leite' }],
  '2024-08-02': [{ id: '2', text: 'Enviar e-mail' }],
};

export default function CalendarScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [tasks, setTasks] = useState(initialTasks);
  const [newTask, setNewTask] = useState('');
  const [showTodayTasks, setShowTodayTasks] = useState(false);
  const [dropdownHeight, setDropdownHeight] = useState(new Animated.Value(0));

  const today = new Date().toISOString().split('T')[0];

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
    setModalVisible(true);
    setShowTodayTasks(false);
  };

  const handleAddTask = () => {
    if (newTask.trim()) {
      setTasks({
        ...tasks,
        [selectedDate]: [
          ...(tasks[selectedDate] || []),
          { id: String(Date.now()), text: newTask },
        ],
      });
      setNewTask('');
    }
  };

  const handleRemoveTask = (taskId) => {
    setTasks({
      ...tasks,
      [selectedDate]: tasks[selectedDate].filter(task => task.id !== taskId),
    });
  };

  const handleShowTodayTasks = () => {
    setSelectedDate(today);
    setShowTodayTasks(!showTodayTasks);
    Animated.timing(dropdownHeight, {
      toValue: showTodayTasks ? 0 : 200,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const renderNoTasksMessage = () => (
    <NoTasksContainer>
      <NoTasksText>Você não possui tarefas hoje.</NoTasksText>
    </NoTasksContainer>
  );

  return (
    <Container>
      <Calendar
        onDayPress={handleDayPress}
        markedDates={{ [selectedDate]: { selected: true, selectedColor: '#FFB6B9' } }}
        theme={{
          todayTextColor: '#FFB6B9',
          arrowColor: '#3A506B',
          textDayFontWeight: 'bold',
          textDayHeaderFontWeight: 'bold',
          backgroundColor: '#F8F5F2',
        }}
      />

      <TodayTasksButton onPress={handleShowTodayTasks}>
        <TodayTasksButtonText>Mostrar tarefas de hoje</TodayTasksButtonText>
      </TodayTasksButton>

      <Animated.View style={{ height: dropdownHeight, overflow: 'hidden' }}>
        <DropdownContainer>
          {tasks[today] && tasks[today].length > 0 ? (
            <FlatList
              data={tasks[today]}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TaskItem>
                  <TaskText>{item.text}</TaskText>
                  <RemoveButton onPress={() => handleRemoveTask(item.id)}>
                    <RemoveButtonText>Excluir</RemoveButtonText>
                  </RemoveButton>
                </TaskItem>
              )}
            />
          ) : (
            renderNoTasksMessage()
          )}
        </DropdownContainer>
      </Animated.View>

      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <ModalContainer>
          <ModalContent>
            <ModalTitle>Tarefas de {selectedDate}</ModalTitle>
            <FlatList
              data={tasks[selectedDate] || []}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TaskItem>
                  <TaskText>{item.text}</TaskText>
                  <RemoveButton onPress={() => handleRemoveTask(item.id)}>
                    <RemoveButtonText>Excluir</RemoveButtonText>
                  </RemoveButton>
                </TaskItem>
              )}
            />
            <NewTaskInput
              placeholder="Adicionar nova tarefa"
              placeholderTextColor="#B0B0B0"
              value={newTask}
              onChangeText={setNewTask}
            />
            <AddButton onPress={handleAddTask}>
              <AddButtonText>Adicionar</AddButtonText>
            </AddButton>
            <CloseButton onPress={() => setModalVisible(false)}>
              <CloseButtonText>Fechar</CloseButtonText>
            </CloseButton>
          </ModalContent>
        </ModalContainer>
      </Modal>
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  padding: 16px;
  background-color: #3A506B;
`;

const ModalContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.6);
`;

const ModalContent = styled.View`
  width: 90%;
  max-height: 80%;
  background-color: #F5F5F5;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
`;

const ModalTitle = styled.Text`
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 16px;
  color: #3A506B;
`;

const TaskItem = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom-width: 1px;
  border-bottom-color: #ECEFF1;
`;

const TaskText = styled.Text`
  font-size: 16px;
  color: #424242;
`;

const RemoveButton = styled.TouchableOpacity`
  background-color: #EF5350;
  padding: 8px 12px;
  border-radius: 5px;
`;

const RemoveButtonText = styled.Text`
  color: #F5F5F5;
  font-size: 14px;
`;

const NewTaskInput = styled.TextInput`
  border-width: 1px;
  border-color: #B0B0B0;
  border-radius: 5px;
  padding: 12px;
  margin: 12px 0;
  font-size: 16px;
  color: #3A506B;
`;

const AddButton = styled.TouchableOpacity`
  background-color: #66BB6A;
  padding: 12px;
  border-radius: 5px;
  align-items: center;
`;

const AddButtonText = styled.Text`
  color: #F5F5F5;
  font-size: 16px;
  font-weight: bold;
`;

const CloseButton = styled.TouchableOpacity`
  margin-top: 12px;
  align-items: center;
`;

const CloseButtonText = styled.Text`
  color: #3A506B;
  font-size: 16px;
`;

const TodayTasksButton = styled.TouchableOpacity`
  background-color: #FFB6B9;
  padding: 12px;
  border-radius: 10px;
  align-items: center;
  margin-top: 16px;
`;

const TodayTasksButtonText = styled.Text`
  color: #F5F5F5;
  font-size: 16px;
  font-weight: bold;
`;

const DropdownContainer = styled.View`
  background-color: #F5F5F5;
  border-radius: 10px;
  padding: 16px;
  margin-top: 10px;
  border: 1px solid #E0E0E0;
`;

const NoTasksContainer = styled.View`
  padding: 16px;
  align-items: center;
`;

const NoTasksText = styled.Text`
  font-size: 16px;
  color: #424242;
`;
