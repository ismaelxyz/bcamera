# Bcamera

This is a mobile app developed with React Native using the [react-native-vision-camera](https://react-native-vision-camera.com/) plugin. It is important to note that it is not designed to replace the default camera app on your device, especially if the latter includes features such as filters. However, it can be used for school projects, to test react-native-vision-camera, or as a basis for developing a more complex application, among other possibilities.

## Features

- **Flash:** Allows you to illuminate your surroundings when taking a photo, providing the light you need to capture what you want clearly.

- **Switch camera:** Allows you to switch between the rear and front camera according to your needs or preferences.

- **Shutter sound:** You can turn this sound on or off as you like, allowing you to take photos discreetly if you wish.

- **HDR:** This feature allows you to capture images with a wider dynamic range, improving the quality of photos in difficult lighting conditions.

- **FPS (Frames per second):** This feature allows you to adjust the number of frames per second when capturing video, with 60 or 30 frames per second being the usual options, depending on your specific needs.

- **Thumbnails:** The application will display thumbnails of the last three photos captured, allowing the user to quickly view recent images.

- **Video Capture:** The user will be allowed to capture videos in addition to taking photos, expanding the media capture options within the application.


## Running

Assuming you have [Nodejs](https://nodejs.org/) installed, basic knowledge of [Expo](https://docs.expo.dev/tutorial/introduction/) and [React Native](https://reactnative.dev/), plus an android device connected to the pc, you should just do the classics:

````bash
git clone https://github.com/ismaelxyz/bcamera
cd bcamera
npm install
npx expo run android
```

