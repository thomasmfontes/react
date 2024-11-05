import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity, Modal, Animated } from 'react-native';
import styled from 'styled-components/native';
import ActionSheet from 'react-native-actions-sheet';
import { Ionicons } from '@expo/vector-icons'; // Para ícones
import AsyncStorage from '@react-native-async-storage/async-storage'; // Para armazenamento local

const images = [
  { id: '1', uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135768.png' },
  { id: '2', uri: 'https://cdn-icons-png.flaticon.com/512/236/236831.png' },
  { id: '3', uri: 'https://cdn-icons-png.flaticon.com/512/219/219986.png' },
  { id: '4', uri: 'https://cdn-icons-png.flaticon.com/512/4140/4140047.png' },
  { id: '5', uri: 'https://cdn-icons-png.flaticon.com/512/2922/2922510.png' },
  { id: '6', uri: 'https://cdn-icons-png.flaticon.com/512/147/147142.png' },
  { id: '7', uri: 'https://cdn-icons-png.flaticon.com/512/194/194938.png' },
  { id: '8', uri: 'https://cdn-icons-png.flaticon.com/512/2922/2922565.png' },
  { id: '9', uri: 'https://cdn-icons-png.flaticon.com/512/2922/2922688.png' },
  { id: '10', uri: 'https://cdn-icons-png.flaticon.com/512/2922/2922656.png' },
  { id: '11', uri: 'https://cdn-icons-png.flaticon.com/512/2922/2922662.png' },
  { id: '12', uri: 'https://cdn-icons-png.flaticon.com/512/2922/2922650.png' },
  { id: '13', uri: 'https://cdn-icons-png.flaticon.com/512/2922/2922620.png' },
  { id: '14', uri: 'https://cdn-icons-png.flaticon.com/512/2922/2922513.png' },
  { id: '15', uri: 'https://cdn-icons-png.flaticon.com/512/2922/2922519.png' },
];

export default function ProfileScreen({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(images[0].uri);
  const [name, setName] = useState('');
  const [newName, setNewName] = useState('');
  const actionSheetRef = useRef(null);

  useEffect(() => {
    // Carrega o nome e a imagem salvos ao abrir a tela
    const loadProfileData = async () => {
      const storedName = await AsyncStorage.getItem('name');
      const storedImage = await AsyncStorage.getItem('profileImage');

      if (storedName) {
        setName(storedName);
        setNewName(storedName);
      }
      if (storedImage) {
        setSelectedImage(storedImage);
      }
    };
    loadProfileData();
  }, []);  

  const handleSave = async () => {
    await AsyncStorage.setItem('name', newName);
    setName(newName);
    setModalVisible(false);
  };
  
  const selectImage = async (uri) => {
    setSelectedImage(uri);
    await AsyncStorage.setItem('profileImage', uri);
    actionSheetRef.current?.hide();
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('name'); // Remover nome
    await AsyncStorage.removeItem('profileImage'); // Remover imagem do perfil
    // Remova outros itens do AsyncStorage relacionados ao login
    // await AsyncStorage.removeItem('token'); // Se você estiver usando um token
  
    navigation.navigate('Login'); // Navega para a tela de login após o logout
  };

  return (
    <Container>
      <HomeButton onPress={() => navigation.navigate('HomeTabs', { screen: 'Home' })}>
        <Ionicons name="home" size={28} color="#fff" />
      </HomeButton>

      <TouchableOpacity onPress={() => actionSheetRef.current?.show()}>
        <ProfileImage source={{ uri: selectedImage }} />
      </TouchableOpacity>

      <Name>{name || 'Nome não definido'}</Name>
      
      <Button1 onPress={() => setModalVisible(true)}>
        <ButtonText>Editar Perfil</ButtonText>
      </Button1>
      
      <Button onPress={handleLogout}>
        <ButtonText>Logout</ButtonText>
      </Button>

      {/* Modal de Editar Perfil */}
      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <ModalContainer>
          <ModalView>
            <ModalTitle>Editar Perfil</ModalTitle>
            <TextInput
              style={styles.input}
              placeholder="Nome"
              value={newName}
              onChangeText={setNewName}
              placeholderTextColor="#B0B0B0"
            />
            <ModalButton onPress={handleSave}>
              <ButtonText>Salvar</ButtonText>
            </ModalButton>
            <ModalButton onPress={() => setModalVisible(false)} backgroundColor="#FFB6B9">
              <ButtonText>Cancelar</ButtonText>
            </ModalButton>
          </ModalView>
        </ModalContainer>
      </Modal>

      {/* ActionSheet para seleção de imagem */}
      <ActionSheet ref={actionSheetRef}>
        <FlatList
          data={images}
          keyExtractor={(item) => item.id}
          numColumns={3}
          contentContainerStyle={styles.flatListContainer}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => selectImage(item.uri)} style={styles.imageContainer}>
              <ProfileImage source={{ uri: item.uri }} style={styles.imagePickerImage} />
            </TouchableOpacity>
          )}
        />
      </ActionSheet>
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: #3A506B;
  padding: 16px;
`;

const HomeButton = styled.TouchableOpacity`
  background-color: #5BC0BE;
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

const ProfileImage = styled.Image`
  width: 100px;
  height: 100px;
  border-radius: 60px;
  border: 4px solid black;
  margin-bottom: 20px;
`;

const Name = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: #fff;
  margin-bottom: 30px;
`;

const Button1 = styled.TouchableOpacity`
  background-color: #5BC0BE;
  padding: 15px;
  border-radius: 30px;
  align-items: center;
  margin-bottom: 10px;
  width: 100%;
`;

const Button = styled.TouchableOpacity`
  background-color: #FFB6B9;
  padding: 15px;
  border-radius: 30px;
  align-items: center;
  width: 100%;
`;

const ButtonText = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: #fff;
  text-align: center;
`;

const ModalContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

const ModalView = styled.View`
  width: 95%;
  background-color: #3A506B;
  border-radius: 20px;
  padding: 20px;
  align-items: center;
`;

const ModalTitle = styled.Text`
  font-size: 30px;
  margin-bottom: 20px;
  font-weight: bold;
  color: #fff;
`;

const ModalButton = styled.TouchableOpacity`
  background-color: ${({ backgroundColor = "#5BC0BE" }) => backgroundColor};
  padding: 10px;
  border-radius: 30px;
  margin-top: 10px;
  width: 100%;
`;

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    width: '100%',
    padding: 10,
    marginBottom: 15,
  },
  flatListContainer: {
    padding: 10,
  },
  imageContainer: {
    margin: 5,
    width: '30%', // Ajuste para caber 3 imagens por linha
    aspectRatio: 1,
  },
  imagePickerImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
});
