import { View, Text, Image, TouchableOpacity } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { Bubble, GiftedChat, InputToolbar, Message, Send } from 'react-native-gifted-chat';
import firestore from '@react-native-firebase/firestore';
import { launchCamera } from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Chat = ({ route, navigation }) => {
  const [messages, setMessages] = useState([]);
  const [imageData, setImageData] = useState(null);
  const [imageUrl, setImageUrl] = useState();
  const { myId, userId, username } = route.params;
  let docId = sortAlpha(myId + userId);

  function sortAlpha(word) {
    return word.split('').sort().join('');
  }

  useEffect(() => {
    console.log(route.params);
    const unsubscribe = firestore()
      .collection('chats')
      .doc(docId)
      .collection('messages')
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        const allMessages = snapshot.docs.map(doc => ({
          _id: doc.id,
          ...doc.data(),
          createdAt: new Date(),
        }));
        setMessages(allMessages);
      });

    return () => unsubscribe();
  }, [docId]);

  const onSend = useCallback(
    async messageArray => {
      const [message] = messageArray;
      const myMsg = {
        ...message,
        senderId: myId,
        receiverId: userId,
        image: imageUrl || '',
        createdAt: firestore.FieldValue.serverTimestamp(),
      };
      try {
        await firestore()
          .collection('chats')
          .doc(docId)
          .collection('messages')
          .add(myMsg);
        setMessages(previousMessages =>
          GiftedChat.append(previousMessages, [myMsg]),
        );
        setImageUrl('');
        setImageData(null);
      } catch (error) {
        console.error('Failed to send message: ', error);
      }
    },
    [myId, userId, docId],
  );

  // const openCamera = async () => {
  //   const result = await launchCamera({ mediaType: 'photo' });
  //   if (result.didCancel) {
  //     console.log('Camera launch cancelled');
  //   } else {
  //     setImageData(result);
  //     uploadImage(result);
  //   }
  // };

  // const uploadImage = async (imageData) => {
  //   if (imageData.assets && imageData.assets.length > 0) {
  //     const { fileName, uri } = imageData.assets[0];
  //     const reference = storage().ref(fileName);
  //     await reference.putFile(uri);
  //     const url = await reference.getDownloadURL();
  //     setImageUrl(url);
  //   }
  // };

  return (
    <View className=" flex-1 bg-sky-100 ">
      <View
        className="items-center p-3 bg-white flex-row  justify-between  "
        style={{ borderBottomColor: 'grey', borderBottomWidth: 0.4 }}>
        <TouchableOpacity className="flex-row items-center" onPress={() => { navigation.goBack() }}>
          <Image
            source={require('../../assets/icons/back.png')}
            className=" h-7 w-7 "
          />
          <Text className="text-blue-400">Back</Text>
        </TouchableOpacity>

        <Text className="text-[15px] text-black">{username}</Text>

        <Image
          source={require('../../assets/icons/video.png')}
          className=" h-7 w-7 "
        />
      </View>

      <GiftedChat
        alwaysShowSend
        renderSend={props => {
          return (
            <View
              style={{ flexDirection: 'row', alignItems: 'center', height: 60 }}>
              <Send {...props} containerStyle={{ justifyContent: 'center' }}>
                <Image
                  source={require('../../assets/icons/chat.png')}
                  style={{
                    width: 24,
                    height: 24,
                    marginRight: 10,
                    tintColor: '#52b1ff',
                  }}
                />
              </Send>
            </View>
          );
        }}
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{
          _id: myId,
        }}

        renderInputToolbar={props => {
          return (
            <InputToolbar
              {...props}
              containerStyle={{ backgroundColor: 'white', borderRadius: 10, height: '8%' }}>
            </InputToolbar>
          )
        }}

      // renderBubble={props => {
      //   return (
      //     <Bubble
      //       {...props}
      //       wrapperStyle={{
      //         right: {

      //         },
      //       }}
      //     />
      //   );
      // }
      // }
      />
    </View>
  );
};

export default Chat;
