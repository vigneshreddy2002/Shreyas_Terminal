import express from "express";
import http from "http";
import WebSocket from "ws";
import { spawn } from "child_process";
import { connectToDatabase } from "./database";
import { IncomingMessage } from 'http';
import { Socket } from 'net';
import net from "net";
//import shellQuote from 'shell-quote';

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let child: any;
let isChildRunning = false;
let cancel = false;
let childPid: any;
let chkserver=0;

async function insertDb(command: string, status: string, output: string) 
{
const db = await connectToDatabase();
const collection = db.collection("datas");
await collection.insertOne({ command, status, output });
}

wss.on("connection", (ws: WebSocket, request: IncomingMessage) =>
{
//wss.on("connection", (ws) => {
console.log("Client connected");

ws.on("message", async (message: string) =>   
{
console.log(`Received message: ${message}`);


const command = JSON.parse(message);

if (command && command.command && command.command.trim().localeCompare("ctrl-c") === 0) 
{
console.log("Hi ctrlc");
ws.close();
server.close(() => 
{
console.log("Server closed");
server.listen(8080, () => 
{
console.log("Server started on port 8080");
});
chkserver=1;
});
if (child && isChildRunning) 
{
child.kill("SIGINT");
child.on("exit", () => 
{
console.log("command stopped.");
});
} 
else 
{
}
return;
}

// Check if cancel flag is set
if (cancel) 
{
console.log("Skipping command execution");
cancel = false; // Reset cancel flag
return;
}

/*if (typeof command !== "string") 
{
console.error("Command must be a string");
cancel = true;

const message = 
{
command: "",
status: "0",
output: "Command must be a string",
};
ws.send(JSON.stringify(message));
ws.close();

if (child && isChildRunning) 
{
child.kill("SIGINT");
}
const pingProcess = spawn("kill", ["-9", child.pid.toString()]);
process.kill(childPid, "SIGINT");
pingProcess.on("exit", () => 
{
console.log("Ping command stopped.");
server.close(() => 
{
console.log("Server closed");
server.listen(8080, () => 
{
console.log("Server started on port 8080");
});
});
});

return;
}*/

let stdoutChunks: string[] = [];
let stderrChunks: string[] = [];

//let commandString = command;

let commandString = command.trim(); // Trim any leading/trailing whitespaces

let check=0;
const commands = commandString.split("&&");
let combinedStatus: number = 1;// Initialize combined status to 1
let subCommandStatus: number=1;
for (let i = 0; i < commands.length; i++) 
{
            const command = commands[i].trim();

            if (commandString.includes(".sh") && !commandString.includes("cat"))
            {   
                console.log("reached Shell script");
                //if (command.endsWith(".sh"))
                if (command.includes(".sh")) 
                {
                    // run the .sh file

                    const fs = require("fs");
                    if (fs.existsSync(command)) 
                    {
                        console.log("exists");
                        const data = fs.readFileSync(command, "utf8");

                        let scriptCommands = data
                        .split(/\r?\n/)
                        .map((line: string) => line.trim())
                        .filter((line: string) => line !== "" && !line.startsWith("#"));

                        if (scriptCommands.length>0) 
                        {
                            // Execute each command in the shell script file separately
                            // calculate status of the script
                            let scriptStatus: number = 1;
                            for (const scriptCommand of scriptCommands) 
                            {
                                console.log("came inside"+scriptCommand);
                                child = spawn(scriptCommand, 
                                {
                                    stdio: ["ignore", "pipe", "pipe"],
                                    detached: true,
                                    shell: true,
                                });
                                if (scriptCommand.startsWith("wget"))
                                {
                                    check=1;
                                }
                                // ... the rest of the code for executing the command ...
                                subCommandStatus = await runCommand(scriptCommand, ws);
                                console.log("subcommandstatus"+subCommandStatus);
                                scriptStatus = scriptStatus && subCommandStatus;
                                console.log("scriptstatus1"+scriptStatus);
                                //runCommand(scriptCommand, ws);

                            }
                            subCommandStatus = scriptStatus; // use the status of the script
                            console.log("scriptstatus2"+scriptStatus);
                        }
                           /* ws.send
                            (
                                JSON.stringify({
                                status: combinedStatus
                                })
                            );*/
                            
                    }
                    else 
                    {
                        console.log(`File ${command} not found`);
                        // handle the error as needed
                        ws.send
                        (
                        JSON.stringify({
                                command,
                                status: "0",
                                output: `Error: File not found`,
                                })
                        );
                    }
                } 
            }
            else
            {
                    // run the command as is
                    subCommandStatus = await runCommand(command, ws);
                    console.log("subCommandSatus2"+subCommandStatus);
            }
                combinedStatus = combinedStatus && subCommandStatus;
                console.log("combinedStatus"+combinedStatus);
                ws.send
                (
                    JSON.stringify
                    ({
                    status: combinedStatus
                    })
                );
}

async function runCommand(command: string, ws: WebSocket): Promise<number> 
 
//function runCommand(command: string, ws: WebSocket) 
{
console.log("received"+command);

child = spawn(command, 
{
stdio: ["ignore", "pipe", "pipe"],
detached: true,
shell: true,
});

// Handle errors that occur while spawning the child process
child.on("error", (err: Error & { code?: string }) => {
console.error("reached file not found"+err);
if (err.code === 'ENOENT') { // file not found error
ws.send(
JSON.stringify({
command,
status: "0",
output: `Error: File not found`,
})
);
} else { // other errors
ws.send(
JSON.stringify({
command,
status: "0",
output: `Error: ${err.message}`,
})
);
}
});



childPid = child.pid;
isChildRunning = true;

let stdoutOutput = "";
let stderrOutput = "";
let downloadedBytes = 0;
let fileSize = 0;

if (command.trim().startsWith("wget"))
{
console.log("Reached wget");
let wgetOutput = "";

let currentProgress: string = "";
let fileLength: number = 0; // define fileLength variable
check=1;
let message = { command: command, status: "0", output: "" };

child.stderr.on("data", (data: string) => 
{
const lines = data.toString().split("\n");
lines.forEach((line) => 
{
//console.log("Processing line:", line); // log each line to console
// Search for the line that contains the file length
const lengthMatch = line.match(/Length:\s*(\d+)/);
if (lengthMatch) 
{
fileLength = parseInt(lengthMatch[1]); // set fileLength
}
// Search for the line that contains the progress percentage
if (line.includes("%")) 
{
// Extract the progress percentage from the line
const progressMatch = line.match(/(\d+)%/);
if (progressMatch) 
{
// console.log("Found progress:", progressMatch[1]); // log progress to console
const progress = progressMatch[1];
const bytesDownloaded = (parseInt(progress) * fileLength) / 100; // calculate downloaded bytes
if (progress !== currentProgress) 
{
// console.log("entered final");
currentProgress = progress;
//const message = 
//{
//command: command,
message.status="0";
message.output=`Progress: ${progress}%, Downloaded: ${bytesDownloaded} bytes`;
// };
ws.send(JSON.stringify(message));
}
}
}
});
});

child.on('exit', (code: number) => 
{
if (code === 0) 
{
message.status = "1";
message.output = "Downloaded";
ws.send(JSON.stringify(message));
insertDb(command, "1", "No error");
}
else
{
message.status = "0";
message.output = wgetOutput;
ws.send(JSON.stringify(message));
}
});
}

child.stdout.on("data", (data: string) => 
{
stdoutChunks.push(data.toString());
if (command.trim().startsWith("ping")) 
{

/* const pingProcess = spawn(commandString, 
{
shell: true,
});*/

const pingProcess = spawn(command, 
{
shell: true,
});

let inputCommandSent = false;

let headerSent = false;

/*pingProcess.stdout.on("data", (data: string) => {
stdoutChunks.push(data.toString());
const lines = stdoutChunks.join("").split("\n");
for (let i = 0; i < lines.length; i++) {
const line = lines[i].trim();
if (line.startsWith("PING") && !headerSent) {
const message = { command: command, output: line + "\n", status: "1" };
ws.send(JSON.stringify(message));
headerSent = true;
} else if (line.startsWith("64 bytes")) {
const [bytes, from, icmpSeq, ttl, time] = line.split(" ");
const message = {
command: command,
output: `${bytes} ${from} ${icmpSeq} ${ttl} ${time}\n`,
status: "1",
};
ws.send(JSON.stringify(message));
}
}
stdoutChunks.length = 0;
});*/

pingProcess.stdout.on("data", (data: string) => {
stdoutChunks.push(data.toString());
const lines = stdoutChunks.join("").split("\n");
for (let i = 0; i < lines.length; i++) {
const line = lines[i].trim();
if (line.startsWith("PING") && !headerSent) {
const message = { command: command, output: command + "\n" + line + "\n", status: "1" };
ws.send(JSON.stringify(message));
headerSent = true;
} else if (line.startsWith("64 bytes")) {
const [bytes, from, icmpSeq, ttl, time] = line.split(" ");
const message = {
command: command,
output: `${bytes} ${from} ${icmpSeq} ${ttl} ${time}\n`,
status: "1",
};
ws.send(JSON.stringify(message));
}
}
stdoutChunks.length = 0;
});

pingProcess.stderr.on("data", (data: string) => 
{
stderrChunks.push(data.toString());

const lines = stderrChunks.join("").split("\n");
for (let line of lines) 
{
if (line.trim() !== "") 
{
const message = 
{
command: command,
output: line,
status: "1",
};
ws.send(JSON.stringify(message));
}
}
stderrChunks.length = 0;

});

pingProcess.on("exit", () => 
{
console.log("Ping command stopped.");
insertDb(command, "1", "No error");
server.close(() => 
{
console.log("Server closed");
server.listen(8080, () => 
{
console.log("Server started on port 8080");
});
});
});

} 
else 
{
// For other commands, accumulate the output and send it to the frontend after the command finishes
stdoutOutput += data.toString();
//console.log(stdoutOutput);
const message = 
{
command: command,
output: stdoutOutput,
status: "1"
};

if (!(command.trim().startsWith("wget"))) 
{
ws.send(JSON.stringify(message));
}

insertDb(command, "1", "No error");
}
});

child.stderr.on("data", (data: string) => 
{
//.log("checking..."+check);
stderrChunks.push(data.toString());
if (command.trim().startsWith("ping")) 
{
// For the ping command, send each line of output to the frontend
const lines = stderrChunks.join("").split("\n");
for (let line of lines) 
{
if (line.trim() !== "") 
{
const message = 
{
command: command,
output: line,
status: "1",
};
ws.send(JSON.stringify(message));
}
}
stderrChunks.length = 0;
// insertDb(command, "0", "Ping command error"); 
} 
else 
{
// For other commands, accumulate the output and send it to the frontend after the command finishes
stderrOutput += data.toString();
//console.log("OtherCommandserror"+command);
const message = 
{
command: command,
output: stderrOutput,
status: "0"
};
if (!(command.trim().startsWith("wget"))) 
{
ws.send(JSON.stringify(message));
}
// insertDb(command, "0", stderrOutput); 
}
});

/*child.on("exit", (code: number) => 
{
if (isChildRunning) 
{ 

wss.clients.forEach((client) => 
{
if (client.readyState === WebSocket.OPEN) 
{
// client.send(JSON.stringify(message));
}
});
isChildRunning = false;
}
});*/

return new Promise((resolve) => {
    child.on("exit", (code: number) => {
      if (code === 0) {
        resolve(1); // command succeeded
      } else {
        resolve(0); // command failed
      }
    });
  });





}

});
});
/*process.on("SIGTERM", () => {
console.log("Caught termination signal");
if (child) {
child.kill("SIGINT");
}
wss.clients.forEach((client) => {
if (client.readyState === WebSocket.OPEN) {
console.log("closed1");
client.send("Streaming stopped due to termination signal");
client.close();
}
});
process.exit();
});*/

if (chkserver===0)
{
server.listen(8080, () => {
console.log("Server started on port 8080");
});
}



