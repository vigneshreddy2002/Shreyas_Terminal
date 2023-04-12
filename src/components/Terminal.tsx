import React, { useState, useEffect, useRef } from "react";
import {XTerm} from 'xterm-for-react'
import "../styles/Terminal.css"

const Terminal = ({c,sclr}:any) => {
// const xtermRef = useRef<any>(null)
const terminalRef = useRef<HTMLDivElement | null>(null);
const [command, setCommand] = useState("");
const [output, setOutput] = useState("$");
const [prompt, setPrompt] = useState("");
const [commandHistory, setCommandHistory] = useState<string[]>([]);
const [labelColor, setLabelColor] = useState("");
const headerDisplayed = useRef(false);

const ws = useRef<WebSocket | null>(null);
const commandIndex = useRef<number>(-1);
const radioStyle = {
backgroundColor: labelColor,
padding: "10px",
borderRadius: "50%",
display: "inline-block"
};

let cancel = false; // Flag to cancel the stream if the user presses Ctrl+C
/* useEffect(() => {
// You can call any method in XTerm.js by using 'xterm xtermRef.current.terminal.[What you want to call]
xtermRef.current.terminal.writeln("Hello, World!")
}, [])*/
useEffect(() => 
{ 
const setupWebSocket = () => {
ws.current = new WebSocket("ws://localhost:8080");

ws.current.onopen = () => {
console.log("WebSocket connection established.");
cancel = false; // reset the flag
if (c) {
console.log(c);
handleSubmit();
console.log("ok");
} 

};

ws.current.onmessage = (event) => {
const message = JSON.parse(event.data);
if (cancel) {
return; // Stop the stream if the flag is set
}

let pingCommandExecuted = false;

if (message.command.startsWith("ping")) {
//setOutput((prevOutput) => prevOutput+ "$"+ message.command + "\n");
const lines = message.output.split("\n");
for (let i = 0; i < lines.length; i++) {
const line = lines[i].trim();
if (line.startsWith("PING") && !headerDisplayed.current) {
setOutput((prevOutput) => prevOutput+ line + "\n");
headerDisplayed.current = true;
} else if (line.startsWith("64 bytes")) {
setOutput((prevOutput) => prevOutput + line + "\n");
}
}
}
else if (message.command.startsWith("wget")) {
// If the command is wget, update the progress in the same line
setOutput((prevOutput) => {
const lines = prevOutput.trim().split("\n");
// Remove newline character
const lastLine = lines[lines.length - 1].replace(/\n$/, "");
if (lastLine.startsWith("$")) {
// If the last line already ends with "$", replace it with the new command
lines[lines.length - 1] = `$ ${message.command}`;
// Add a new line for progress update
lines.push("");
} else {
// Move the cursor to the beginning of the current line
lines[lines.length - 1] = "\r";
}
// Update the progress on the same line
lines[lines.length - 1] += message.output;
console.log(message.status);
if (message.status === "1") {
console.log("okyeah");
// Add a new line for the next command prompt
lines.push("\n$ ");
}
return lines.join("\n");
});
} else {
// For other commands, display the command and output in different lines
setOutput((prevOutput) => prevOutput + `${message.command}\n${message.output}\n\n$`);
}
setPrompt("");
scrollToBottom();

if (message.status === "1") {
sclr("green");
} else {
sclr("red");
}
};

ws.current.onclose = (event) => {
console.log(`WebSocket connection closed with code ${event.code}.`);
console.log(cancel);
if (cancel) {
// Close the WebSocket connection
if (ws.current) {
ws.current.close();
}
// Reconnect if the cancel flag is set
setTimeout(() => {
console.log("Reconnecting to WebSocket...");
setupWebSocket(); // Set up a new WebSocket connection
}, 1000);
}
};
};

setupWebSocket();

const handleWindowKeyDown = (event: KeyboardEvent) => 
{
if (event.key === "c" && event.ctrlKey) 
{
// Handle Ctrl+C key press
console.log("hello");
event.preventDefault();
if (ws.current) 
{
console.log("hello2");
cancel = true; // Set the cancel flag
ws.current.send(JSON.stringify({ command: "ctrl-c" }));
setTimeout(() => 
{
console.log("hello3");
console.log(cancel);
if (ws.current) 
{
ws.current.close();
}
// ws.current = null;
console.log(ws.current);
setOutput((prevOutput) => prevOutput + "^C\n"+"\n$");
setPrompt("$");
}, 500); // add a delay to ensure the message is sent before closing the websocket
}
}
};
window.addEventListener("keydown", handleWindowKeyDown);

return () => 
{
window.removeEventListener("keydown", handleWindowKeyDown);
ws.current?.close();
};

}, [c]);

//const handleSubmit = (event?: React.FormEvent) => {
const handleSubmit = () => { 
//event?.preventDefault();
if (ws.current) 
{
//ws.current.send(JSON.stringify(command));
console.log("checked"+c);
ws.current.send(JSON.stringify(c));
//setCommandHistory([...commandHistory, command]);
//setPrompt(command);
setCommandHistory([...commandHistory, c]);
setPrompt(c);
scrollToBottom();
commandIndex.current = -1; // Reset commandIndex when a new command is submitted
}
setCommand("");
};

const handleCommandClick = (clickedCommand: string) => 
{
setCommand(clickedCommand);
};

const scrollToBottom = () => 
{
if (terminalRef.current) 
{
terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
}
};

return (

<div>
<div className="firstPart">
<label>
<span style={radioStyle}><input type="radio" name="color" value={labelColor} /></span>
</label>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
<a href="http://localhost:3000/">Click to view Graph</a>
</div>

<div className="firstPart">

</div>
<div ref={terminalRef} className="terminal">
{output && <pre>{output}</pre>}
</div>
</div>
);
}

export default Terminal

