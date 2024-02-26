import React, { useCallback, useEffect, useRef, useState } from 'react';
import IconButton from "../components/IconButton";
import TextButton from "../components/TextButton";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Pressable,
  Image,
  Button,
} from 'react-native';

import {
  useCameraPermission,
  useMicrophonePermission,
  useCameraDevice,
  Camera,
  PhotoFile,
  TakePhotoOptions,
  VideoFile,
  useCodeScanner,
} from 'react-native-vision-camera';
import { FontAwesome5 } from '@expo/vector-icons';
import { Video } from 'expo-av';


export default function HomePage(): React.ReactElement {
  const device = useCameraDevice('back', {
    physicalDevices: ['ultra-wide-angle-camera'],
  });
  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: (codes) => {
      console.log(`Scanned ${codes.length} codes!`);
      console.log(codes[0]);
    },
  });

  const { hasPermission, requestPermission } = useCameraPermission();
  const {
    hasPermission: microphonePermission,
    requestPermission: requestMicrophonePermission,
  } = useMicrophonePermission();

  const [isActive, setIsActive] = useState(false);
  const [flash, setFlash] = useState<TakePhotoOptions['flash']>('off');
  const [isRecording, setIsRecording] = useState(false);

  const [photo, setPhoto] = useState<PhotoFile>();
  const [video, setVideo] = useState<VideoFile>();

  const camera = useRef<Camera>(null);

  const [mode, setMode] = useState('camera');


  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }

    if (!microphonePermission) {
      requestMicrophonePermission();
    }
  }, [hasPermission, microphonePermission]);

  const onTakePicturePressed = async () => {
    if (isRecording) {
      camera.current?.stopRecording();
      return;
    }

    const photo = await camera.current?.takePhoto({
      flash,
    });
    setPhoto(photo);
  };

  const onStartRecording = async () => {
    if (!camera.current) {
      return;
    }
    setIsRecording(true);
    camera.current.startRecording({
      flash: flash === 'on' ? 'on' : 'off',
      onRecordingFinished: (video) => {
        console.log(video);
        setIsRecording(false);
        setVideo(video);
      },
      onRecordingError: (error) => {
        console.error(error);
        setIsRecording(false);
      },
    });
  };

  const uploadPhoto = async () => {
    if (!photo) {
      return;
    }

    const result = await fetch(`file://${photo.path}`);
    const data = await result.blob();
    // console.log(data);
    // upload data to your network storage (ex: s3, supabase storage, etc)
  };

  if (!hasPermission || !microphonePermission) {
    return <ActivityIndicator />;
  }

  if (!device) {
    return <Text>Camera device not found</Text>;
  }
  console.log('QR camer: ', mode === 'qr' && isActive && !photo && !video);
  return (
    <View style={{ flex: 1 }}>
      {mode === 'qr' ? (
        <Camera
          device={device}
          codeScanner={codeScanner}
          style={StyleSheet.absoluteFill}
          isActive={mode === 'qr' && isActive && !photo && !video}
        />
      ) : (
        <Camera
          ref={camera}
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={isActive && !photo && !video && mode === 'camera'}
          photo
          video
          audio
        />
      )}

      {video && (
        <>
          <Video
            style={StyleSheet.absoluteFill}
            source={{
              uri: video.path,
            }}
            useNativeControls
            isLooping
          />
        </>
      )}

      {photo && (
        <>
          <Image source={{ uri: photo.path }} style={StyleSheet.absoluteFill} />
          <FontAwesome5
            onPress={() => setPhoto(undefined)}
            name="arrow-left"
            size={25}
            color="white"
            style={{ position: 'absolute', top: 50, left: 30 }}
          />
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              paddingBottom: 50,
              backgroundColor: 'rgba(0, 0, 0, 0.40)',
            }}
          >
            <Button title="Upload" onPress={uploadPhoto} />
          </View>
        </>
      )}

      {!photo && !video && (
        <>
          <View
            style={{
              position: 'absolute',
              right: 10,
              top: 50,
              padding: 10,
              borderRadius: 5,
              backgroundColor: 'rgba(180, 180, 180, 1)',
              gap: 10,
            }}
          >


            <IconButton
              iconName={"sync-outline"}
              onPress={() => null}
            />

            <IconButton
              iconName={flash === 'off' ? 'flash-off' : 'flash'}
              onPress={() =>
                setFlash((curValue) => (curValue === 'off' ? 'on' : 'off'))
              }
            />

            <IconButton
              iconName={mode === 'camera' ? 'volume-low-outline' : 'volume-off-outline'}
              onPress={() => setMode(mode === 'qr' ? 'camera' : 'qr')}
            />

            <TextButton text={'HDR'} />
            <TextButton text={'60fps'} />


          </View>

          <Pressable
            onPress={onTakePicturePressed}
            onLongPress={onStartRecording}
            style={{
              position: 'absolute',
              alignSelf: 'center',
              bottom: 50,
              width: 70, // Ajusta el tamaño del Pressable
              height: 70, // Ajusta el tamaño del Pressable
              borderRadius: 40, // Ajusta el radio del borde
              opacity: 0.4,
              alignItems: 'center',
              justifyContent: 'center', // Alinear de abajo hacia arriba en el centro
              backgroundColor: 'white',
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}
          >
            <View
              style={{
                width: 50, // Ajusta el tamaño del Pressable
                height: 50, // Ajusta el tamaño del Pressable
                backgroundColor: isRecording ? 'red' : 'white',
                borderRadius: 30, // Ajusta el radio del borde
                alignItems: 'center', // Alinear horizontalmente en el centro
                justifyContent: 'center', // Alinear verticalmente en el centro
              }}
            />
          </Pressable>

        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({

});
