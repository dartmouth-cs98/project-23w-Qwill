# Qwill

Cellphones and social media have made it harder to forge genuine connections with your loved ones. Plus, there’s nothing like a handwritten letter!  

That’s why we created Qwill, an app that allows you to send letters to your chosen friends, in your own handwriting. The letters come with themes and stickers too!

<br>

<div align="center">
<img src="https://user-images.githubusercontent.com/45802767/224577276-d8e807a8-801c-41cc-bb3c-455217f0f76c.png" width="600">
</div>

<br>

## Home Screen
<div align="center">
<img src="https://github.com/dartmouth-cs98/project-23w-qwill/assets/102633877/19b5b31a-6438-47fd-aa57-689b277a429e" width="300">
<img src="https://github.com/dartmouth-cs98/project-23w-qwill/assets/102633877/fd4d96bf-1402-4e3d-91ff-7b535fb83125" width="300">
</div>

## Friends Screen
<div align="center">
<img src="https://github.com/dartmouth-cs98/project-23w-qwill/assets/102633877/dd3a425e-8746-41be-85dd-f564ff5d9d8d" width="300">
<img src="https://github.com/dartmouth-cs98/project-23w-qwill/assets/102633877/246b3460-7f47-43ce-a1ad-de5fbc59f22f" width="300">
</div>

## Font Screen
<div align="center">
<img src="https://github.com/dartmouth-cs98/project-23w-qwill/assets/102633877/06b3095e-161e-47c2-b928-17d9ad978c6d" width="300">
<img src="https://github.com/dartmouth-cs98/project-23w-qwill/assets/102633877/4c19ee6a-f8a3-4cba-8915-71d335672296" width="300">
 </div>

## Preview Screen
<div align="center">
<img src="https://github.com/dartmouth-cs98/project-23w-qwill/assets/102633877/719d7f75-d9f5-40fc-8fa1-831dadcae662" width="300">
<img src="https://github.com/dartmouth-cs98/project-23w-qwill/assets/102633877/39ee4efd-5d4c-451e-9627-9bcf7f702a17" width="300">
</div>

## Profile Screen
<div align="center">
<img src="https://github.com/dartmouth-cs98/project-23w-qwill/assets/102633877/20d8e44e-c2b2-4eca-9c33-fed69fa2780d" width="300">
</div>




## Architecture

### Frontend

#### React Native
React Native is the chosen tool for mobile development. React Native is a open-source mobile application framework which gives access to native UI controls. This means React Native is cross-platform friendly so we can eventually deploy Qwill on both Apple and Android devices.

Please see: [https://reactnative.dev/](https://reactnative.dev/) for more information.

#### Expo
Expo is a development tool that allows developers to view the mobile development in progress on a device.

Please see: [https://expo.dev/](https://expo.dev/) for more information.

#### React Native navigation stack structure (client)
```
Root navigation stack (components/Navigation.js)
├── Auth screens (screens/auth)
│   ├── SignInScreen.js
│   └── SignUpScreen.js
├── Main navigation bar (components/NavBar.js)
│   ├── Mailbox stack (components/HomeStack.js)
|   |   ├── HomeScreen.js
│   |   └── DraftsScreen.js
│   ├── Compose stack (components/ComposeStack.js)
|   |   ├── SelectRecipientScreen.js
|   |   ├── SelectThemeScreen.js
|   |   ├── SelectFontScreen.js
|   |   ├── ComposeScreen.js
|   |   ├── Letter Edit Modals
|   |   |   ├── ChangeRecipientScreen.js (modal view)
|   |   |   ├── ChangeThemeScreen.js (modal view)
|   |   |   ├── ChangeFontScreen.js (modal view)
|   |   |   ├── AddStickerScreen.js (modal view)
│   |   └── PreviewScreen.js
│   ├── Friend stack (components/FriendStack.js)
|   |   ├── HomeFriendsScreen.js
|   |   ├── AddFriendsScreen.js (modal view)
|   |   ├── FriendHistoryScreen.js
|   └── Fonts
│   └── Profile 
|   |   ├── ProfileScreen.js
```

### Backend

The backend runs on a NodeJS server launched through a bash script. We use the [Express](https://expressjs.com) library for route and controller management. Our backend interface is purely terminal-based. Frontend to backend communication is enabled by the [axios](https://axios-http.com) library. 

### MongoDB

We use the Mongoose MongoDB library to store data, including user profiles, friend information, custom fonts, and letters sent. For custom fonts, we store them only on the sender's side. The receiver gets a letter with an image of the words in the sender's font. This approach avoids the need to transmit a new font for each letter. For accessibility, the transmission also includes a plaintext version of the letter.

Our database schema are structured as follows:

#### User Schema:
```
name: String < 30 characters,
email: String that must be valid email syntax,
username: String that must be alphanumeric or '.' or '_',
password: String that is encrypted and hidden on backend,
```

#### Letter Schema:
```
sender: ObjectID that is a foreign key to the user collection,
recipient: ObjectID that is a foreign key to the user collection,
text: String representing the letter content
status: String representing the current status of the letter (draft, sent, read, archive),
theme: String representing the filename of the theme,
font: String represeting the filename of the font,
customFont: Boolean indicating if font on the letter is custom or not,
stickers: Array of JSON object indicating stickerID and placement of each sticker in the letter
```

#### Friend Schema:
```
friendReqSender: ObjectID that is a foreign key to the user collection,
friendReqRecipient: ObjectID that is a foreign key to the user collection,
status: String that represents the current status of the friendship (pending, friends)
```

#### Font Schema:
```
creator: ObjectID that is a foreign key to the user collection,
name: String that represents the name of the font for the user,
firebaseDownloadLink: URL string that instantly downloads the .ttf file stored in Google Firebase,
firebaseFilePath: String representing path to the .ttf file in Firebase,
isDeleted: Boolean that represents if the font has been deleted from the user's frontend fonts,
```

Please see: [https://www.mongodb.com/](https://www.mongodb.com/) for more information.

### Custom Font Generation

#### Google Cloud Vision OCR

Once an image is uploaded to the backend, a Python child process performs minor image processing and character detection using the Optical Character Recognition (OCR) API of Google Cloud Vision.

For more information, please refer to the [Google Cloud Vision OCR documentation](https://cloud.google.com/vision/docs/handwriting#detect_document_text_in_a_remote_image).

#### FontForge

After text detection, we calculate a bounding box around each character, and create individual vector files in SVG format. We then use the [FontForge](https://fontforge.org/en-US/) library to generate a font, importing each vector as a glyph corresponding to its character. The resultant font file is then passed back to the Express server for saving in the database.

#### Google Firebase

After generating the font file and piping it back to the parent process, we store the .ttf font file using [Google Firebase](https://firebase.google.com/) file storage. A download link is created and stored in the MongoDB database for referencing the file. Please note that deleting fonts and files on the frontend does not actually remove the file from Firebase, as the download link needs to remain active for users to view their past letter history.

### Server Hosting

We host our server on [render.com](https://render.com), which connects to our Git repository and auto-deploys the backend using Docker. Due to the limitations of the free tier, the server goes into sleep mode after 15 minutes of inactivity. To prevent this, we use [Uptime Robot](https://uptimerobot.com/) to ping a backend controller every 14 minutes, keeping the server awake.

## Installation

### Frontend

The latest version of our frontend is already deployed on TestFlight and can be accessed using the following link: [TestFlight App](https://testflight.apple.com/join/iNkrVm3O).

However, if you want to run the React Native code on your local machine, please follow the steps below:

First, make sure that you have Expo installed on your machine. If not, you can install it by following the instructions in the official Expo documentation: [Expo Installation Guide](https://docs.expo.dev/get-started/installation/).

Additionally, you might find the React Native Expo Go quickstart guide useful: [React Native Expo Go Quickstart Guide](https://reactnative.dev/docs/environment-setup).

Once you have Expo installed, navigate to the root directory and run the following command:

```bash
cd send-letters/client
npm install
```

## Backend

No installation is required for the backend as it is already deployed on [Render](Render.com).

However, if you want to run the backend server on your local machine, please follow the steps below:

First, navigate to the root directory in your terminal. Then, move to the server folder and install all necessary dependencies with npm install:

```bash
cd send-letters/server
npm install
```

This will install all the required dependencies for the server to run.

Please note, if you want the frontend to make axios requests to the locally run backend instead of the Render deployment, you will need to make a small adjustment. Navigate to the `send-letters/client/helpers/findIP.js` file and change the `status` variable to `"dev"`. This ensures that the frontend will communicate with your local backend during development.

## Build

## Build

### Frontend

To run the frontend locally, use the following commands from the base directory:

```bash
cd send-letters/client
npm expo start
```

This will prompt the user to either open up an emulator through the terminal or use the barcode to open the app on a smartphone.

### Backend

To run the backend locally, use the following commands from the base directory:

```bash
cd send-letters/server
npm run dev:start
```

## Authors
![team1](https://user-images.githubusercontent.com/45802767/213886442-e6182d95-9df6-4775-bfa4-18b788df374b.jpg)
From left to right: Thomas Rogers, Rachael Williams, Amanda Sun, Tate Toussaint, Pierce Wilson <br>
Front and center: Leah Ryu <br>

## Acknowledgments
Backend Tutorial to initialize express server and mongodb connection: https://nabendu82.medium.com/react-native-project-with-nodejs-and-mongodb-part-1-443cc5b65b46
Apploading is now SplashPage thanks for documentation Expo: https://docs.expo.dev/versions/v45.0.0/sdk/app-loading/

## Required Installations
Ask Amanda for the package.json for client and server and then run npm install instead of installing packages individually.
** Note that [react-navigation is deprecated](https://www.npmjs.com/package/react-navigation)! Must use [react-native-navigation](https://www.npmjs.com/package/react-native-navigation) instead.


## Troubleshooting for Development

## Read this before anything else to understand how the packages works!
There are 4 files:
- `package.json` 
- `package-lock.json`
- `node_modules`
- `.expo`

`package.json` is the recipe that your computer follows when running `npm install` and it will build `package-lock.json` and `node_modules`
- anytime you run npm i/install <packagename>, it adds a line to package.json as a recipe
- to check any version of your package, go to package.json

Package Managing
*node_modules and package.json*
package.json tells `npm install` what to install into node_modules
Thus, never edit node_modules!! Instead, edit package.json and then run `npm install`

*.expo file*
.expo is only needed on client side. It should not exist in server or top-level.

### .expo not found in the folder
Running `npm audit fix --force` after running an `npm install` may sneakily downgrade your Expo to version 1.0.0. If you're getting an "Expo not found in the folder" error, try running `expo update.`

### Specific Error
```
amanda@Amandas-MacBook-Air-3 client (main)*$ npx expo start
npm ERR! could not determine executable to run

npm ERR! A complete log of this run can be found in:
npm ERR!     /Users/amanda/.npm/_logs/2023-04-06T20_07_51_354Z-debug-0.log
```
Running expo update may fix the issue.

### Module not found errors
You may see an error during app bundling "While trying to resolve module..." in `client`. In this case, try stopping the server and running `npm rebuild`, then restarting. 

If this doesn't work, run `killall node` and then start both the server and the client again. 

The most drastic action if none of the above works is to `killall node` or stop both the client and server in their respective terminals. Then, run `rm -rf node_modules` in the `client` directory to delete the node modules folder. Run `npm install` (you will most likely need to run `npm audit fix --force` and `expo update` after this). Then, restart the server in one terminal window, and the client in another by running `npx expo start` or `expo r -c` (the latter removes all caches from Expo as well). 

### Promisify Error
If signing up is not working with Promisify, I was able to `npm i react-native-paper.` Also make sure your expo, Node, etc are on the most recent version.
