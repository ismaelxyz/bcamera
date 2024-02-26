import React, { useEffect, useRef, useState } from 'react';
import { IconButton, MaterialButton } from "../components/IconButton";
import TextButton from "../components/TextButton";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "../Constants";

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
  useCameraFormat,
} from 'react-native-vision-camera';
import DropDownPicker from 'react-native-dropdown-picker';
import { FontAwesome5 } from '@expo/vector-icons';
import { Video } from 'expo-av';


export default function HomePage(): React.ReactElement {

  const [cameraPosition, setCameraPosition] = useState<'front' | 'back'>('back');
  const device = useCameraDevice(cameraPosition, {
    physicalDevices: ['ultra-wide-angle-camera'],
  });
  

  const { hasPermission, requestPermission } = useCameraPermission();
  const {
    hasPermission: microphonePermission,
    requestPermission: requestMicrophonePermission,
  } = useMicrophonePermission();

  const [targetFps, setTargetFps] = useState(60);

  const screenAspectRatio = SCREEN_HEIGHT / SCREEN_WIDTH
  const format = useCameraFormat(device, [
    { fps: targetFps },
    { videoAspectRatio: screenAspectRatio },
    { videoResolution: 'max' },
    { photoAspectRatio: screenAspectRatio },
    { photoResolution: 'max' },
  ]);


  const fps = Math.min(format?.maxFps ?? 1, targetFps);

  const supportsFlash = device?.hasFlash ?? false;
  const supportsHdr = format?.supportsPhotoHdr;

  const [isActive, setIsActive] = useState(false);
  const [flash, setFlash] = useState<'off' | 'on'>('off');
  const [enableHdr, setEnableHdr] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const [photo, setPhoto] = useState<PhotoFile>();
  const [video, setVideo] = useState<VideoFile>();

  const camera = useRef<Camera>(null);
  const [openDropDown, setOpenDropDown] = useState(false);
  const [currentExample, setCurrentExample] = useState('take-photo');
  const [sound, setSound] = useState(true);


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
      flash: flash,
      enableShutterSound: sound
    });
    // onMediaCaptured(photo, 'photo');
    setPhoto(photo);
  };

  const onStartRecording = async () => {
    if (!camera.current) {
      return;
    }

    setIsRecording(true);
    camera.current.startRecording({
      flash: flash,
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
  // console.log('QR camer: ', mode === 'qr' && isActive && !photo && !video);
  return (
    <View style={{ flex: 1 }}>
      {(
        <Camera
          ref={camera}
          style={StyleSheet.absoluteFill}
          device={device}
          zoom={device.minZoom}
          isActive={isActive && !photo && !video}
          photoHdr={format?.supportsPhotoHdr && enableHdr}
          videoHdr={format?.supportsVideoHdr && enableHdr}
          photo={true}
          video={true}
          audio={true}
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
          <FontAwesome5
            onPress={() => setVideo(undefined)}
            name="arrow-left"
            size={25}
            color="white"
            style={{ position: 'absolute', top: 50, left: 30 }}
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
          <View style={styles.panelView} >

            <IconButton
              iconName={"sync-outline"}
              onPress={
                () =>
                  setCameraPosition((p) => (p === 'back' ? 'front' : 'back'))
              }
            />

            <IconButton
              iconName={flash === 'off' ? 'flash-off' : 'flash'}
              onPress={() =>
                setFlash((curValue) => (curValue === 'off' ? 'on' : 'off'))
              }
            />

            <IconButton
              iconName={sound ? 'volume-low-outline' : 'volume-off-outline'}
              onPress={() => setSound((curSound) => !curSound)}
            />

            <MaterialButton 
                iconName={enableHdr ? 'hdr' : 'hdr-off'}
                onPress={() => setEnableHdr((h) => !h)}
            />

            <TextButton text={'60fps'} />

          </View>

          <Pressable
            onPress={onTakePicturePressed}
            onLongPress={onStartRecording}
            style={styles.captureButton}
          >
            <View
              style={[
                styles.captureButtonInner,
                { backgroundColor: isRecording ? 'red' : 'white'}
              ]}
            />
          </Pressable>

        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  panelView: {
    position: 'absolute',
    right: 10,
    top: 50,
    padding: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(180, 180, 180, 1)',
    gap: 10,
  },
  captureButton: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: 50,
    width: 70, 
    height: 70, 
    borderRadius: 40, 
    opacity: 0.4,
    alignItems: 'center',
    justifyContent: 'center', 
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  captureButtonInner: {
    width: 50, 
    height: 50,
    borderRadius: 30, 
    alignItems: 'center', 
    justifyContent: 'center', 
  }
});
