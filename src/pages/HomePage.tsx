import React, { useEffect, useRef, useState, useCallback } from 'react';
import { FontAwesome5 } from '@expo/vector-icons';
import { Video } from 'expo-av';

import { IconButton, MaterialButton } from "../components/IconButton";
import TextButton from "../components/TextButton";
import { SCREEN_HEIGHT, SCREEN_WIDTH, MAX_ZOOM_FACTOR } from "../Constants";

import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Pressable,
  GestureResponderEvent,
  Image,
  Button,
} from 'react-native';

import Reanimated, {
  useAnimatedProps,
  useSharedValue,
  interpolate,
  Extrapolation
} from 'react-native-reanimated';

import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView
} from 'react-native-gesture-handler';

import {
  useCameraPermission,
  useMicrophonePermission,
  useCameraDevice,
  Camera,
  PhotoFile,
  CameraProps,
  VideoFile,
  useCameraFormat,
} from 'react-native-vision-camera';


Reanimated.addWhitelistedNativeProps({
  zoom: true,
});
const ReanimatedCamera = Reanimated.createAnimatedComponent(Camera);


export default function HomePage(): React.ReactElement {

  const [cameraPosition, setCameraPosition] = useState<'front' | 'back'>('back');
  const device = useCameraDevice(cameraPosition, {
    //physicalDevices: ['ultra-wide-angle-camera'],
  });
  const zoom = useSharedValue(device?.neutralZoom);
  const zoomOffset = useSharedValue(0);
  const gesture = Gesture.Pinch()
    .onBegin(() => {
      zoomOffset.value = zoom.value ?? 1;
    })
    .onUpdate(event => {
      const z = zoomOffset.value * event.scale
      zoom.value = interpolate(
        z,
        [1, 10],
        [device?.minZoom ?? 1, device?.maxZoom ?? MAX_ZOOM_FACTOR],
        Extrapolation.CLAMP,
      )
    });

  const animatedProps = useAnimatedProps<CameraProps>(
    () => ({ zoom: zoom.value }),
    [zoom]
  );


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
  const [flash, setFlash] = useState<'off' | 'on'>('off');
  const [enableHdr, setEnableHdr] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const [photo, setPhoto] = useState<PhotoFile>();
  const [video, setVideo] = useState<VideoFile>();

  const camera = useRef<Camera>(null);
  const [sound, setSound] = useState(true);

  const onFocusTap = useCallback(
    ({ nativeEvent: event }: GestureResponderEvent) => {
      if (!device?.supportsFocus) return
      camera.current?.focus({
        x: event.locationX,
        y: event.locationY,
      })
    },
    [device?.supportsFocus],
  );


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
    
  };

  if (!hasPermission || !microphonePermission) {
    return <ActivityIndicator />;
  }

  if (!device) {
    return <Text>Camera device not found</Text>;
  }
  
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {(
        <>
          <GestureDetector gesture={gesture}>
            <Reanimated.View onTouchEnd={onFocusTap} style={StyleSheet.absoluteFill}>
              <ReanimatedCamera
                ref={camera}
                style={StyleSheet.absoluteFill}
                device={device}
                format={format}
                fps={fps}
                isActive={!photo && !video}
                animatedProps={animatedProps}
                photoHdr={format?.supportsPhotoHdr && enableHdr}
                videoHdr={format?.supportsVideoHdr && enableHdr}
                photo={true}
                video={true}
                audio={true}
              />
            </Reanimated.View>
          </GestureDetector>
        </>
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
            style={styles.arrowLeft}
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
            style={styles.arrowLeft}
          />
          <View style={styles.imageContainer}>
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

            <TextButton 
              text={`${targetFps}\nFPS`}
              onPress={() => setTargetFps((t) => (t === 30 ? 60 : 30))}
            />

          </View>

          <Pressable
            onPress={onTakePicturePressed}
            onLongPress={onStartRecording}
            style={styles.captureButton}
          >
            <View
              style={[
                styles.captureButtonInner,
                { backgroundColor: isRecording ? 'red' : 'white' }
              ]}
            />
          </Pressable>

        </>
      )}
    </GestureHandlerRootView>
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
  },
  imageContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.40)',
  },
  arrowLeft: {
    position: 'absolute',
    top: 50,
    left: 30
  }
});
