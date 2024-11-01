import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FlatList, Alert, TextInput, TouchableOpacity, View, Text, Share, Image, Modal } from 'react-native';
import styled from 'styled-components/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons'; // For icons
import ActionSheet from 'react-native-actions-sheet'; // For slide-up panel
import { useFocusEffect } from '@react-navigation/native';

const initialTasks = [
  { id: '1', title: 'Buy groceries', completed: false, createdAt: new Date(), deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) },
  { id: '2', title: 'Finish project', completed: false, createdAt: new Date(), deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) },
  { id: '3', title: 'Call John', completed: false, createdAt: new Date(), deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) },
];

const quotes = [
  'A melhor maneira de prever o futuro é criá-lo.',
  'O sucesso não é o quão alto você subiu, mas como você faz uma diferença positiva para o mundo.',
  'O sucesso geralmente vem para aqueles que estão ocupados demais para procurá-lo.',
  'Não fique envergonhado por seus fracassos, aprenda com eles e comece de novo.',
  'Não olhe para o relógio; faça o que ele faz. Continue.',
];

export default function HomeScreen({ navigation, route }) {
  const [tasks, setTasks] = useState(initialTasks);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [sortOrder, setSortOrder] = useState('asc');
  const [filter, setFilter] = useState('pending');
  const [quote, setQuote] = useState('');
  const actionSheetRef = useRef(null);
  const [name, setName] = useState('');
  const [profileImage, setProfileImage] = useState('');

  useFocusEffect(
    useCallback(() => {
      const loadProfileData = async () => {
        const storedName = await AsyncStorage.getItem('name');
        const storedImage = await AsyncStorage.getItem('profileImage');
        
        if (storedName) setName(storedName);
        if (storedImage) setProfileImage(storedImage);
      };

      loadProfileData();
    }, []) // Dependências vazias para rodar sempre que a tela é focada
  );

  useEffect(() => {
    const loadPreferences = async () => {
      const storedFilter = await AsyncStorage.getItem('filter');
      const storedSortOrder = await AsyncStorage.getItem('sortOrder');
      if (storedFilter) setFilter(storedFilter);
      if (storedSortOrder) setSortOrder(storedSortOrder);
    };
    loadPreferences();

    // Set today's quote randomly from the list
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(randomQuote);
  }, []);

  const saveTasks = async (updatedTasks) => {
    await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  const handleAddTask = () => {
    if (newTaskTitle.trim() === '') {
      Alert.alert('Error', 'Task title cannot be empty.');
      return;
    }

    const newTask = {
      id: String(tasks.length + 1),
      title: newTaskTitle,
      completed: false,
      createdAt: new Date(),
      deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    };

    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
    setNewTaskTitle('');
    setModalVisible(false);
    Alert.alert('Tarefa Adicionada', `A tarefa "${newTaskTitle}" foi adicionada.`);
  };

  // Função handleLongPress para excluir a tarefa com confirmação
  const handleLongPress = (taskId) => {
    Alert.alert(
      "Excluir",
      "Você tem certeza de que quer excluir essa tarefa?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive", // Destaque o botão de exclusão
          onPress: () => handleDeleteTask(taskId) // Chama a função de exclusão
        }
      ]
    );
  };

  // Função handleDeleteTask para excluir a tarefa
  const handleDeleteTask = (taskId) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
    Alert.alert("Tarefa Excluida", "A tarefa foi excluida com sucesso!");
  };

  const handleCompleteTask = (taskId) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  const handleShare = async () => {
    try {
      const messageToShare = `"${quote}" - *Produfy*`;

      await Share.share({ message: messageToShare });
    } catch (error) {
      Alert.alert('Error', 'Failed to share the quote.');
    }
  };

  const handleQuoteButton = () => {
    actionSheetRef.current?.setModalVisible(true);
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.completed;
    if (filter === 'pending') return !task.completed;
    return true;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortOrder === 'asc') return a.title.localeCompare(b.title);
    return b.title.localeCompare(a.title);
  });

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;

  return (
    <Container>
      <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
        <View style={{ paddingLeft: 0 }}>
          <Image
            source={{ uri: profileImage || 'https://cdn-icons-png.flaticon.com/512/3135/3135768.png' }}
            style={{ width: 50, height: 50, marginTop: 30, borderWidth: 2, borderColor: '#000', borderRadius: 25, }}
          />
        </View>
      </TouchableOpacity>

      <DateText>{new Date().toLocaleDateString()}</DateText>
      <GreetingText>Olá, {name || 'Usuário'}</GreetingText>

      <QuoteButton onPress={handleQuoteButton}>
        <Ionicons name="bulb" size={28} color="#fff" />
      </QuoteButton>

      <ObjectiveButton onPress={() => navigation.navigate('Objective', { totalTasks, completedTasks })} >
        <Ionicons name="newspaper" size={28} color="#fff" />
        <ButtonText>Objetivos do Dia</ButtonText>
      </ObjectiveButton>

      <ActionSheet ref={actionSheetRef}>
        <QuoteContainer>
          <QuoteText>{quote}</QuoteText>
          <StyledButton onPress={handleShare}>
            <Ionicons name="share-outline" size={24} color="#fff" />
            <ButtonText>Compartilhar</ButtonText>
          </StyledButton>
        </QuoteContainer>
      </ActionSheet>

      <Header>
        <Title>Tarefas</Title>
        <Stats>Total: {totalTasks} | Completo: {completedTasks} | Pendente: {pendingTasks}</Stats>
      </Header>

      <View style={{}}>
        <ButtonRow>
          <FilterButton active={filter === 'pending'} onPress={() => setFilter('pending')}>
            <ButtonText>Pendente</ButtonText>
          </FilterButton>
          <FilterButton active={filter === 'completed'} onPress={() => setFilter('completed')}>
            <ButtonText>Completo</ButtonText>
          </FilterButton>

          <FilterButton active={filter === 'all'} onPress={() => setFilter('all')}>
            <ButtonText>Todos</ButtonText>
          </FilterButton>
        </ButtonRow>
      </View>

      <View style={{ height: 225 }}>
        <FlatList
          data={sortedTasks}
          renderItem={({ item }) => (
            <TaskItem
              completed={item.completed}
              onLongPress={() => handleLongPress(item.id)} // Aplica a função de long press para excluir
            >
              <TaskTitle>{item.title}</TaskTitle>
              <TouchableOpacity onPress={() => handleCompleteTask(item.id)}>
                <Ionicons
                  name={item.completed ? "checkmark-circle" : "checkmark-circle-outline"}
                  size={35}
                  color={item.completed ? "#00ff21" : "#090624"}
                />
              </TouchableOpacity>
            </TaskItem>
          )}
          keyExtractor={(item) => item.id}
        />
      </View>

      <AddTaskButton onPress={() => setModalVisible(true)}>
        <Ionicons name="add" size={28} color="#fff" />
      </AddTaskButton>

      <CalendarButton onPress={() => navigation.navigate('HomeTabs', { screen: 'Calendar' })}>
        <Ionicons name="calendar" size={28} color="#fff" />
      </CalendarButton>

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <ModalContainer>
          <ModalContent>
            <ModalInput
              placeholder="Add a new task"
              value={newTaskTitle}
              onChangeText={setNewTaskTitle}
              placeholderTextColor="#aaa"
            />
            <ModalButton onPress={handleAddTask}>
              <ButtonText>Adicionar Tarefa</ButtonText>
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

// Styles for Quote slide-up
const QuoteContainer = styled.View`
  padding: 20px;
  justify-content: center;
  align-items: center;
  /* background-color: #3A506B;
  border-radius: 8px 8px 0 0; */
`;

const QuoteText = styled.Text`
  font-size: 20px;
  color: #000;
  text-align: center;
  margin-bottom: 20px;
`;

const StyledButton = styled.TouchableOpacity`
  background-color: #5BC0BE;
  padding: 12px;
  border-radius: 8px;
  align-items: center;
  flex-direction: row;
  justify-content: center;
`;

const Container = styled.View`
  flex: 1;
  padding: 16px;
  background-color: #3A506B;
`;

const DateText = styled.Text`
  font-size: 14px;
  color: #F5F5F5;
  margin-top: 15px;
`;

const GreetingText = styled.Text`
  font-size: 30px;
  color: #F5F5F5;
  font-weight: bold;
  margin-top: 0;
`;

const QuoteButton = styled.TouchableOpacity`
  position: absolute;
  top: 16px;
  right: 20px;
  background-color: #5BC0BE;
  padding: 10px;
  border-radius: 50px;
  justify-content: center;
  align-items: center;
  shadow-color: #000;
  shadow-opacity: 0.1;
  shadow-radius: 5px;
  elevation: 5;
  margin-top: 30px;
  width: 50px;
  height: 50px;
`;

const ObjectiveButton = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 50px;
  background-color: #1C2541;
  margin-bottom: 5px;
  margin-top: 5px;
  border-radius: 10px;
  shadow-color: #000;
  shadow-opacity: 0.1;
  shadow-radius: 5px;
`;

const ButtonText = styled.Text`
  color: #F5F5F5;
  font-size: 16px;
  font-weight: bold;
  margin-left: 10px;
`;

const Header = styled.View`
  margin-bottom: 20px;
`;

const Title = styled.Text`
  align-items: left;
  font-size: 20px;
  font-weight: bold;
  color: #F5F5F5;
`;

const Stats = styled.Text`
  font-size: 14px;
  color: #B0B0B0;
`;

const ButtonRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const FilterButton = styled.TouchableOpacity`
  background-color: ${({ active }) => (active ? '#5BC0BE' : '#6C757D')};
  padding: 10px;
  border-radius: 8px;
  align-items: center;
  flex: 1;
  margin: 0 4px;
`;

const TaskItem = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background-color: ${({ completed }) => (completed ? '#6C757D' : '#C5C6C7')};
  margin-bottom: 7px;
  border-radius: 10px;
  shadow-color: #000;
  shadow-opacity: 0.1;
  shadow-radius: 5px;
`;

const TaskTitle = styled.Text`
  font-size: 18px;
  color: #1C2541;
  flex: 1;
`;

const AddTaskButton = styled.TouchableOpacity`
  background-color: #1C2541;
  position: absolute;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  border-radius: 30px;
  justify-content: center;
  align-items: center;
  shadow-color: #000;
  shadow-opacity: 0.2;
  shadow-radius: 5px;
`;

const CalendarButton = styled.TouchableOpacity`
  background-color: #FFB6B9;
  position: absolute;
  bottom: 20px;
  left: 20px;
  width: 60px;
  height: 60px;
  border-radius: 30px;
  justify-content: center;
  align-items: center;
  shadow-color: #000;
  shadow-opacity: 0.2;
  shadow-radius: 5px;
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


