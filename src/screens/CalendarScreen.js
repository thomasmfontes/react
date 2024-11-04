import React, { useState, useEffect, useRef } from 'react';
import { View, TouchableOpacity, TextInput, FlatList, Animated, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars';
import styled from 'styled-components/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialTasks = {
  '2024-08-01': [{ id: '1', text: 'Comprar leite' }],
  '2024-08-02': [{ id: '2', text: 'Enviar e-mail' }],
};

export default function CalendarScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [viewTasksVisible, setViewTasksVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [tasks, setTasks] = useState(initialTasks);
  const [newTask, setNewTask] = useState('');
  const slideAnim = useRef(new Animated.Value(0)).current; // Valor de altura animado

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
    setViewTasksVisible(false); // Fecha o dropdown ao selecionar uma nova data
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const handleToggleViewTasks = () => {
    const newValue = viewTasksVisible ? 0 : 150; // Altura para expandir/recolher
    setViewTasksVisible(!viewTasksVisible);
    Animated.timing(slideAnim, {
      toValue: newValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const handleAddTask = async () => {
    if (newTask.trim()) {
      const updatedTasks = {
        ...tasks,
        [selectedDate]: [
          ...(tasks[selectedDate] || []),
          { id: String(Date.now()), text: newTask },
        ],
      };
      setTasks(updatedTasks);
      setNewTask('');

      // Salva o estado atualizado no AsyncStorage
      try {
        await AsyncStorage.setItem('calendarTasks', JSON.stringify(updatedTasks));
      } catch (error) {
        console.error("Erro ao salvar as tarefas do calendário", error);
      }
    }
  };

  const handleRemoveTask = (taskId) => {
    setTasks({
      ...tasks,
      [selectedDate]: tasks[selectedDate].filter(task => task.id !== taskId),
    });
  };

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const storedTasks = await AsyncStorage.getItem('calendarTasks');
        if (storedTasks) {
          setTasks(JSON.parse(storedTasks));
        }
      } catch (error) {
        console.error("Erro ao carregar as tarefas do calendário", error);
      }
    };
    loadTasks();
  }, []);

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

      {/* Botões para adicionar e ver tarefas */}
      <ButtonContainer>
        <AddTaskButton onPress={() => setModalVisible(true)}>
          <ButtonText>Adicionar Tarefa</ButtonText>
        </AddTaskButton>
        <ViewTasksButton onPress={handleToggleViewTasks}>
          <ButtonText>{viewTasksVisible ? 'Ocultar Tarefas' : 'Ver Tarefas'}</ButtonText>
        </ViewTasksButton>
      </ButtonContainer>

      {/* Dropdown de Tarefas com Efeito de Slide */}
      <Animated.View style={{ height: slideAnim, overflow: 'hidden' }}>
        <DropdownContainer>
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
            ListEmptyComponent={<EmptyText>Não há tarefas para esta data.</EmptyText>}
          />
        </DropdownContainer>
      </Animated.View>

      {/* Modal para adicionar nova tarefa */}
      <ModalContainer visible={modalVisible} transparent={true}>
        <ModalContent>
          <ModalTitle>Nova Tarefa para {selectedDate}</ModalTitle>
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
    </Container>
  );
}

// Estilos dos Componentes

const Container = styled.View`
  flex: 1;
  padding: 16px;
  background-color: #3A506B;
`;

const ButtonContainer = styled.View`
  flex-direction: row;
  justify-content: space-around;
  margin-top: 16px;
`;

const AddTaskButton = styled.TouchableOpacity`
  background-color: #66BB6A;
  padding: 12px;
  border-radius: 10px;
  align-items: center;
  width: 45%;
`;

const ViewTasksButton = styled.TouchableOpacity`
  background-color: #FFB6B9;
  padding: 12px;
  border-radius: 10px;
  align-items: center;
  width: 45%;
`;

const ButtonText = styled.Text`
  color: #F5F5F5;
  font-size: 16px;
  font-weight: bold;
`;

const DropdownContainer = styled.View`
  background-color: #FFFFFF;
  padding: 10px;
  border-radius: 8px;
  margin-top: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
`;

const TaskItem = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  border-bottom-width: 1px;
  border-bottom-color: #ECEFF1;
`;

const TaskText = styled.Text`
  font-size: 16px;
  color: #424242;
`;

const RemoveButton = styled.TouchableOpacity`
  background-color: #EF5350;
  padding: 5px 10px;
  border-radius: 5px;
`;

const RemoveButtonText = styled.Text`
  color: #F5F5F5;
  font-size: 14px;
`;

const EmptyText = styled.Text`
  text-align: center;
  font-size: 14px;
  color: #9E9E9E;
  padding: 10px;
`;

const ModalContainer = styled.Modal``;

const ModalContent = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.6);
`;

const ModalTitle = styled.Text`
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 16px;
  color: #3A506B;
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
