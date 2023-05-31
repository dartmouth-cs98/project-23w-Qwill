# Qwill

![logo](https://user-images.githubusercontent.com/45802767/224577276-d8e807a8-801c-41cc-bb3c-455217f0f76c.png)

Qwill is a mobile app to customize your handwriting into digital letters. <br>
![home view no letters](https://github.com/dartmouth-cs98/project-23w-qwill/assets/102633877/19b5b31a-6438-47fd-aa57-689b277a429e)
![home view one letter]((https://github.com/dartmouth-cs98/project-23w-qwill/assets/102633877/fd4d96bf-1402-4e3d-91ff-7b535fb83125)
![friends view]((https://github.com/dartmouth-cs98/project-23w-qwill/assets/102633877/dd3a425e-8746-41be-85dd-f564ff5d9d8d)
![fonts view](https://user-images.githubusercontent.com/45802767/237006117-ed66ccda-783e-4487-aaca-0d6e10f7ff4a.png)
![select theme view](https://user-images.githubusercontent.com/45802767/237006118-2ff17012-9341-4938-81a0-1b0bec58fbe4.png)
![letter preview](https://user-images.githubusercontent.com/45802767/237006119-19f8924c-f224-4d31-8bf6-c7fba9ab0e68.png)


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
|   |   ├── ComposeScreen.js
│   |   └── PreviewScreen.js
│   ├── Friend stack (components/FriendStack.js)
|   |   ├── HomeFriendsScreen.js
|   |   ├── AddFriendsScreen.js (modal view)
│   |   └── PendingFriendsScreen.js (modal view)
|   └── Fonts
│   └── Profile 
└── 
```

### Backend

### Express / NodeJS Server

The backend is run using a NodeJS server run through a bash script. The [Express](https://expressjs.com) library manages the routes and controllers of the server. There is no UI to the backend other than the terminal interface. Calls to the server from the frontend are made using the [axios](https://axios-http.com) library. 

#### MongoDB

The backend uses the Mongoose MongoDB library store information, such as user profiles and letters sent.

Handwritten fonts will be only stored on the sender's database. The receiver will get a letter that just has a photo of their words in their font, that way the database does not need to trasmit a new font. The transmission will also include a plain text version for voice accessibility.

User Schema:
```
name: String < 30 characters,
email: String that must be valid email syntax,
username: String that must be alphanumeric or '.' or '_'
password: String that is hashed and hidden on backend
```

Letter Schema:
```
sender: ObjectID that is a foreign key to the user collection,
recipient: ObjectID that is a foreign key to the user collection,
text: String representing the letter content
status: String representing the current status of the letter,
    // 4 options: draft, sent, read, archive
theme: String representing the filename of the theme
font: String represeting the filename of the font
```

Please see: [https://www.mongodb.com/](https://www.mongodb.com/) for more information.

### Render.com

The server is hosted on [render.com](render.com), which connects to the Git reporsitory and autodeploys the backend. Currently, only the free tier is activated which causes the backend to go into sleep mode if not used for a period of time. This may cause delays of up to a minute when beginning to use the app. 

## Installation

Download Expo, following the official docs: [https://docs.expo.dev/get-started/installation/](https://docs.expo.dev/get-started/installation/)

Also see the React Native Expo Go quickstart guide: [https://reactnative.dev/docs/environment-setup](https://reactnative.dev/docs/environment-setup)

## Build

### Backend

To run the backend, use the following commands from the base directory:
```bash
cd send-letters/server
npm run dev:start
```

### Frontend

To run the frontend, use the following commands from the base directory:
```bash
cd send-letters/client
npm run start
```

This will prompt the user to open up an emulator through the terminal or use the barcode to open the app on a smartphone.

## Authors
![team1](https://user-images.githubusercontent.com/45802767/213886442-e6182d95-9df6-4775-bfa4-18b788df374b.jpg)
From left to right: Thomas Rogers, Rachael Williams, Amanda Sun, Tate Toussaint, Pierce Wilson <br>
Front and center: Leah Ryu <br>

## Acknowledgments
Thanks tutorial!!
Backend Tutorial to initialize express server and mongodb connection: https://nabendu82.medium.com/react-native-project-with-nodejs-and-mongodb-part-1-443cc5b65b46
Apploading is now SplashPage thanks for documentation Expo: https://docs.expo.dev/versions/v45.0.0/sdk/app-loading/

## Required Installations
Ask Amanda for the package.json for client and server and then run npm install instead of installing packages individually.
** Note that [react-navigation is deprecated](https://www.npmjs.com/package/react-navigation)! Must use [react-native-navigation](https://www.npmjs.com/package/react-native-navigation) instead.

# serverside
npm install express
npm install express-jwt
npm install jsonwebtoken
npm install mongoose
npm install morgan
npm install nanoid
npm install @sendgrid/mail
npm install bcrypt
npm install cors
npm install dotenv
npm install esm
npm install node-cron
pip install google-cloud
pip install google-cloud-vision
npm install firebase-admin
```

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
