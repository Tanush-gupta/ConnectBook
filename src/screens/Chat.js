import { View, Text, Image, TouchableOpacity } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { Bubble, GiftedChat, Send } from 'react-native-gifted-chat';
import firestore from '@react-native-firebase/firestore';
// import { launchCamera } from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Chat = ({ route }) => {
  const [messages, setMessages] = useState([]);
  // const [imageData, setImageData] = useState(null);
  // const [imageUrl, setImageUrl] = useState();
  const { myId, userId } = route.params;
  let docId = sortAlpha(myId + userId);

  function sortAlpha(word) {
    return word.split('').sort().join('');
  }

  useEffect(() => {
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
        // image: imageUrl || '',
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
        // setImageUrl('');
        // setImageData(null);
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
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <GiftedChat
        alwaysShowSend
        renderSend={props => {
          return (
            <View
              style={{ flexDirection: 'row', alignItems: 'center', height: 60 }}>
              {/* {imageUrl !== ''? (
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    backgroundColor: '#fff',
                    marginRight: 10,
                  }}>
                  <Image
                    source={{uri: imageData.assets[0].uri}}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      position: 'absolute',
                    }}
                  />

                  <TouchableOpacity
                    onPress={() => {
                      setImageUrl('');
                    }}>
                    <Image
                      source={require('../../assets/icons/chat.png')}
                      style={{width: 16, height: 16, tintColor: '#fff'}}
                    />
                  </TouchableOpacity>
                </View>
              ) : null} */}
              {/* <TouchableOpacity
                style={{marginRight: 20}}
                onPress={() => {
                  openCamera();
                }}>
                <Image
                  source={require('../../assets/icons/chat.png')}
                  style={{width: 24, height: 24}}
                />
              </TouchableOpacity> */}
              <Send {...props} containerStyle={{ justifyContent: 'center' }}>
                <Image
                  source={require('../../assets/icons/chat.png')}
                  style={{
                    width: 24,
                    height: 24,
                    marginRight: 10,
                    tintColor: 'orange',
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
      // renderBubble={props => {
      // return (
      // <Bubble
      //   {...props}
      //   wrapperStyle={{
      //     right: {

      //     },
      //   }}
      // />
      // );
      // }
      // }
      />
    </View>
  );
};

export default Chat;
