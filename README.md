# Terminal Emulator using React Typescript and Nodejs 

This is a React Typescript Nodejs program combination, wherein the frontend sends the commands to backend Nodejs program and returns the results of the command execution to the front end. This uses the websocket programming as a two way communication between the server and the client.

The two files used for communication are Terminal.tsx (Frontend part, available under /src/components) and Server.ts (Available in the folder Shreyasbackend). Install Visual Studio code editor for amendments(Optional)

Steps for installation of backend server:

1. Create a separate directory for backend and run the following commands to install nodejs dependencies
2. sudo apt update && upgrade
3. sudo apt install nodejs
4. sudo apt install npm
5. npm install express 
6. npm install cors
7. npm install http
8. npm install ws
9. npm install child_process
10. npm install nodemon --save-dev
11. npm install mongodb
12. npm install mongoose
13. After installation, using an editor check whether package.json contains the following code part (Add the "dev" part, if not available).
 "scripts": {
    "start": "node server.ts",
    "dev": "nodemon server.ts",
    "test": "echo \"Error: no test specified\" && exit 1"
  }
14. run the server side using the command (npm run dev) and from the client side(npm start)

The above commands are also available as script file i.e., steps.sh (in the folder Shreyasbackend).

15. This project has an extension to database connectivity. The commands along with status are being stored in mongodb (Mongodb to be installed with default port and a database with name "datas" to be created). At present, the connectivity to database is removed in server.ts file. Soon, it would be added along with the pie chart representation for data analytics.


# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).


