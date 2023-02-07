# Qwill

TODO: Make an add an official logo and display it here

Qwill is a mobile app to customize your handwriting into digital letters. <br>

![homepage](https://user-images.githubusercontent.com/67716136/216882499-6d6f2f69-205a-4947-8352-9b44847b9ec0.JPG)
![mailbox](https://user-images.githubusercontent.com/67716136/216882575-8a990e8c-294e-4e22-9c29-3ec77b50342c.JPG)
![fonts](https://user-images.githubusercontent.com/67716136/216883213-fe6d7e58-74c2-47c2-b76d-021a052eb7fe.JPG)
![sampleletter](https://user-images.githubusercontent.com/67716136/216883200-e9552c38-7459-4fad-bdbe-0dbeeaf2a404.JPG)

## Architecture

### React Native
React Native is the chosen tool for mobile development. React Native is a open-source mobile application framework which gives access to native UI controls. This means React Native is cross-platform friendly so we can eventually deploy Qwill on both Apple and Android devices.

Please see: [https://reactnative.dev/](https://reactnative.dev/) for more information.

### Expo
Expo is a development tool that allows developers to view the mobile development in progress on a device.

Please see: [https://expo.dev/](https://expo.dev/) for more information.

Test issue Amanda

### MongoDB
The backend will use MongoDB for a database to store infromation, such as user profiles and letters sent and received.

Handwritten fonts will be only stored on the sender's database. The receiver will get a letter that just has a photo of their words in their font, that way the database does not need to trasmit a new font. The transmission will also include a plain text version for voice accessibility.

TODO: Flesh out this section about MongoDB once we have tables established, how they relate to each other, etc. Preferably make a graphic.

Please see: [https://www.mongodb.com/](https://www.mongodb.com/) for more information.

TODO: Add more tools and libraries as we use more in this project.

## Setup

Download Expo, following the official docs: [https://docs.expo.dev/get-started/installation/](https://docs.expo.dev/get-started/installation/)

Also see the React Native Expo Go quickstart guide: [https://reactnative.dev/docs/environment-setup](https://reactnative.dev/docs/environment-setup)

## Deployment

TBD once we have the project ready to deploy.
The goal is to make a mobile app which can be placed in the app stores for Apple and Android devices.

## Authors
![team1](https://user-images.githubusercontent.com/45802767/213886442-e6182d95-9df6-4775-bfa4-18b788df374b.jpg)
From left to right: Thomas Rogers, Rachael Williams, Amanda Sun, Tate Toussaint, Pierce Wilson <br>
FRONT AND CENTER: Leah Ryu <br>

## Acknowledgments
Thanks tutorial!!

## Required Installations
npm install @react-navigation/native <br>
npm install @react-navigation/bottom-tabs
npm install -g mongodb-realm-cli
