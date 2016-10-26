/**
 * Copyright (c) 2016, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require('path');
var serviceProcess;

let mainWindow;

function createService(){

	var appDir = `${__dirname}`;
	const spawn = require('child_process').spawn;
	serviceProcess = spawn('java', ['-jar', appDir + path.sep + "services" + path.sep + "workspace-service.jar"]);

	serviceProcess.stdout.on('data', function(data){
		console.log('Service log: ' + data);
	});

	serviceProcess.stderr.on('data', function(data){
		console.log('Service error: ' + data);
	});

	serviceProcess.on('close', function(code){
		console.log('Service closed: ' + code);
	});
}

function createWindow () {
	// Create the browser window
	mainWindow = new BrowserWindow({
		width: 1200,
		height: 800,
		minWidth: 1200,
		minHeight: 800
	});
	
	// Load the index.html of the application
	mainWindow.loadURL(`file://${__dirname}/modules/sequence-diagram-editor/index.html`);

	// Open the DevTools
	//mainWindow.webContents.openDevTools()

	// Emitted when the window is closed
	mainWindow.on('closed', function () {
		// Dereference the window object, usually you would store windows
    	// in an array if your app supports multi windows, this is the time
    	// when you should delete the corresponding element.
		mainWindow = null;
	});
}

// This method will be called when Electron has finished initialization and is 
// ready to create browser windows. Some APIs can only be used after this event occurs.
app.on('ready', function(){
	createService();
	createWindow();
});

// Quit application when all windows are closed.
app.on('window-all-closed', function () {
	// On macOS it is common for applications and their menu bar
  	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin') {
		app.quit()
	}
	// kill the service child process
	serviceProcess.kill();
});

app.on('activate', function () {
	// On macOS it's common to re-create a window in the app when the
  	// dock icon is clicked and there are no other windows open.
	if (mainWindow === null) {
		createWindow()
	}
});
