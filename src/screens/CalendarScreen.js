import React, { useState, useEffect, useRef } from 'react';
import { View, TouchableOpacity, TextInput, FlatList, Animated, Alert, Modal } from 'react-native';
import { Calendar } from 'react-native-calendars';
import styled from 'styled-components/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

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
      <View>
        <CalendarContainer>
        <Icon />
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
        </CalendarContainer>
      </View>

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
                <Ionicons name="trash" size={24} color="#fff" />
                </RemoveButton>
              </TaskItem>
            )}
            ListEmptyComponent={<EmptyText>Não há tarefas para esta data.</EmptyText>}
          />
        </DropdownContainer>
      </Animated.View>

      {/* Modal para adicionar nova tarefa */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
  <ModalContainer>
    <ModalContent>
      <ModalTitle>Adicionar Nova Tarefa</ModalTitle>
      <ModalInput
        placeholder="Descrição da tarefa"
        placeholderTextColor="#aaa"
        value={newTask}
        onChangeText={setNewTask}
      />
      <ModalButton onPress={handleAddTask}>
        <ButtonText>Adicionar</ButtonText>
      </ModalButton>
      <ModalButton onPress={() => setModalVisible(false)} backgroundColor="#FFB6B9">
        <ButtonText>Cancelar</ButtonText>
      </ModalButton>
    </ModalContent>
  </ModalContainer>
</Modal>

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
  background-color: #1C2541;
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

const ModalContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

const ModalContent = styled.View`
  background-color: #3A506B;
  padding: 20px;
  border-radius: 8px;
  width: 80%;
`;

const ModalTitle = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: #F5F5F5;
  margin-bottom: 20px;
  text-align: center;
`;

const ModalInput = styled.TextInput`
  border-bottom-width: 1px;
  border-bottom-color: #F5F5F5;
  padding: 10px;
  font-size: 16px;
  margin-bottom: 20px;
  color: #F5F5F5;
`;

const ModalButton = styled.TouchableOpacity`
  background-color: ${({ backgroundColor }) => backgroundColor || '#5BC0BE'};
  padding: 12px;
  border-radius: 8px;
  align-items: center;
  margin-bottom: 10px;
`;

// Estilização para o contêiner do calendário
const CalendarContainer = styled.View`
  background-color: #ffffff;
  border-radius: 10px;
  padding: 16px;
  margin: 12px;
  margin-top: 35px;
  align-items: center;
  shadow-color: #000;
  shadow-opacity: 0.2;
  shadow-radius: 5px;
  elevation: 5; /* Efeito de sombra para Android */
`;

// Ícone estilizado
const Icon = styled(Ionicons).attrs({
  name: 'calendar-outline',
  size: 30,
  color: '#000',
})`
  margin-bottom: 10px;
`;