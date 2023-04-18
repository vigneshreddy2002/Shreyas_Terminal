import express from "express";
import http from "http";
import WebSocket from "ws";
import { spawn } from "child_process";
//import { connectToDatabase } from "./database";
import { IncomingMessage } from 'http';

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let child: any;
let isChildRunning = false;
let cancel = false;
let childPid: any;
let chkserver=0;


/*async function insertDb(command: string, status: string, output: string) 
{
const db = await connectToDatabase();
const collection = db.collection("datas");
await collection.insertOne({ command, status, output });
}*/

wss.on("connection", (ws: WebSocket, request: IncomingMessage) =>
{
        //Check whether client is connexted
        console.log("Client connected");

        ws.on("message", async (message: string) =>   
        {
            //Receiving the command
            console.log(`Received message: ${message}`);


            const command = JSON.parse(message);
            //Handle ctrl+C at the backend
            if (command && command.command && command.command.trim().localeCompare("ctrl-c") === 0) 
            {
                    
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
                   
                    return;
            }

            // Check if cancel flag is set
            if (cancel) 
            {
                console.log("Skipping command execution");
                cancel = false; // Reset cancel flag
                return;
            }


            //For handling streams in terms of Chunks
            let stdoutChunks: string[] = [];
            let stderrChunks: string[] = [];



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
                //For handling files ending with sh
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
                            //  and calculate status of the script
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
                               // console.log("subcommandstatus"+subCommandStatus);
                                scriptStatus = scriptStatus && subCommandStatus;
                               // console.log("scriptstatus1"+scriptStatus);
                               

                            }
                            subCommandStatus = scriptStatus; // use the status of the script
                            //console.log("scriptstatus2"+scriptStatus);
                        }
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

//Common function for running the command
async function runCommand(command: string, ws: WebSocket): Promise<number> 
{
                console.log("received"+command);

                child = spawn(command, 
                {
                    stdio: ["ignore", "pipe", "pipe"],
                    detached: true,
                    shell: true,
                });

                // Handle errors that occur while spawning the child process
                child.on("error", (err: Error & { code?: string }) => 
                {
                    // file not found error
                    console.error("reached file not found"+err);
                    if (err.code === 'ENOENT') 
                    { 
                            ws.send
                            (
                                    JSON.stringify
                                    ({
                                        command,
                                        status: "0",
                                        output: `Error: File not found`,
                                    })
                            );
                    } 
                    // other errors
                    else 
                    { 
                            ws.send
                            (
                                    JSON.stringify
                                    ({
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
                                                                currentProgress = progress;
  
                                                                message.status="0";
                                                                message.output=`Progress: ${progress}%, Downloaded: ${bytesDownloaded} bytes`;

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
                                                //insertDb(command, "1", "No error");
                                            }
                                            else
                                            {
                                                message.status = "0";
                                                message.output = wgetOutput;
                                                ws.send(JSON.stringify(message));
                                            }
                                        });
                }


                //Standard out of websocket connection
                child.stdout.on("data", (data: string) => 
                {
                            stdoutChunks.push(data.toString());

                            if (command.trim().startsWith("ping")) 
                            {

                                const pingProcess = spawn(command, 
                                {
                                        shell: true,
                                });

                                let inputCommandSent = false;
                                let headerSent = false;

                                pingProcess.stdout.on("data", (data: string) => 
                                {
                                        stdoutChunks.push(data.toString());
                                        const lines = stdoutChunks.join("").split("\n");
                                        for (let i = 0; i < lines.length; i++) 
                                        {
                                            const line = lines[i].trim();
                                            if (line.startsWith("PING") && !headerSent) 
                                            {
                                                const message = { command: command, output: command + "\n" + line + "\n", status: "1" };
                                                ws.send(JSON.stringify(message));
                                                headerSent = true;
                                            } 
                                            else if (line.startsWith("64 bytes")) 
                                            {
                                                const [bytes, from, icmpSeq, ttl, time] = line.split(" ");
                                                const message = 
                                                {
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
                                        //insertDb(command, "1", "No error");
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

                                //insertDb(command, "1", "No error");
                            }
                });

                child.stderr.on("data", (data: string) => 
                {
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
                        } 
                        else 
                        {
                        // For other commands, accumulate the output and send it to the frontend after the command finishes
                            stderrOutput += data.toString();

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

                        }
                });


            return new Promise((resolve) => 
            {
                    child.on("exit", (code: number) => 
                    {
                        if ((code === 0) && ( (stdoutOutput.trim() === '') ) && (!(command.trim().startsWith("wget"))) )
                        {
                            const message = 
                            {
                                command: command,
                                output:"",
                                status: "1",
                            };
                            ws.send(JSON.stringify(message));
                            
                            resolve(1); // command succeeded
                        } 
                        else 
                        {
                                resolve(0); // command failed
                        }
                    });
            });

} //end of function

        }); // end of ws
}); // end of wss

//Nodejs Server starting
if (chkserver===0)
{
server.listen(8080, () => {
console.log("Server started on port 8080");
});
}



