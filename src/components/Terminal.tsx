import React, { useState, useEffect, useRef } from "react";
import "../styles/Terminal.css"


const Terminal = ({c,sclr}:any) => 
{

                const terminalRef = useRef<HTMLDivElement | null>(null);
                const [command, setCommand] = useState("");
                const [output, setOutput] = useState("$");
                const [prompt, setPrompt] = useState("");
                const [commandHistory, setCommandHistory] = useState<string[]>([]);
                const [labelColor, setLabelColor] = useState("");
                const headerDisplayed = useRef(false);

                const ws = useRef<WebSocket | null>(null);
                const commandIndex = useRef<number>(-1);
                const radioStyle = 
                {
                    backgroundColor: labelColor,
                    padding: "10px",
                    borderRadius: "50%",
                    display: "inline-block"
                };

                let cancel = false; // Flag to cancel the stream if the user presses Ctrl+C
                useEffect(() => 
                { 
                    const setupWebSocket = () => 
                    {
                        ws.current = new WebSocket("ws://localhost:8080");
                        ws.current.onopen = () => 
                        {
                            console.log("WebSocket connection established.");
                            cancel = false; // reset the flag
                            if (c) 
                            {
                                handleSubmit();
                                
                            } 

                        };

                        ws.current.onmessage = (event) => 
                        {
                            const message = JSON.parse(event.data);
                            console.log('message1:',typeof message.command);
                            console.log('message2:',typeof message.output);
                            console.log('message3:',typeof message.status);
                            if (cancel) 
                            {
                                return; // Stop the stream if the flag is set
                            }

                            let pingCommandExecuted = false;

                            //if (message && message.command.startsWith("ping")) 
                            if (message.command.trim().startsWith("ping"))
                            {

                                const lines = message.output.split("\n");
                                for (let i = 0; i < lines.length; i++) 
                                {
                                    const line = lines[i].trim();
                                    if (line.startsWith("PING") && !headerDisplayed.current) 
                                    {
                                        setOutput((prevOutput) => prevOutput+ line + "\n");
                                        headerDisplayed.current = true;
                                    } 
                                    else if (line.startsWith("64 bytes")) 
                                    {
                                        setOutput((prevOutput) => prevOutput + line + "\n");
                                    }
                                }
                            }
                            else if (message.command.trim().startsWith("wget")) 
                            {
                                // If the command is wget, update the progress in the same line
                                setOutput((prevOutput) => 
                                {
                                    const lines = prevOutput.trim().split("\n");
                                    // Remove newline character
                                    const lastLine = lines[lines.length - 1].replace(/\n$/, "");
                                    if (lastLine.startsWith("$")) 
                                    {
                                        // If the last line already ends with "$", replace it with the new command
                                        lines[lines.length - 1] = `$ ${message.command}`;
                                        // Add a new line for progress update
                                        lines.push("");
                                    } 
                                    else 
                                    {
                                        // Move the cursor to the beginning of the current line
                                        lines[lines.length - 1] = "\r";
                                    }
                                    // Update the progress on the same line
                                    lines[lines.length - 1] += message.output;
                                   // console.log(message.status);
                                    if (message.status === "1") 
                                    {
                                            // Add a new line for the next command prompt
                                            lines.push("\n$ ");
                                    }
                                    return lines.join("\n");
                                });
                            } 
                            else 
                            {
                                // For other commands, display the command and output in different lines
                                setOutput((prevOutput) => prevOutput + `${message.command}\n${message.output}\n\n$`);
                            }
                            setPrompt("");
                            scrollToBottom();
                            if (message.status === "1") 
                            {
                                sclr("green");
                            } 
                            else 
                            {
                                sclr("red");
                            }
                        }; // end of ws.current

                        ws.current.onclose = (event) => 
                        {
                            console.log(`WebSocket connection closed with code ${event.code}.`);
                            console.log(cancel);
                            if (cancel) 
                            {
                                // Close the WebSocket connection
                                if (ws.current) 
                                {
                                    ws.current.close();
                                }
                                // Reconnect if the cancel flag is set
                                setTimeout(() => 
                                {
                                    console.log("Reconnecting to WebSocket...");
                                    setupWebSocket(); // Set up a new WebSocket connection
                                }, 1000);
                            }
                        };
                    }; //end of setUpSocket

                    setupWebSocket();

                    const handleWindowKeyDown = (event: KeyboardEvent) => 
                    {
                        if (event.key === "c" && event.ctrlKey) 
                        {
                            // Handle Ctrl+C key press
                            event.preventDefault();
                            if (ws.current) 
                            {
                                cancel = true; // Set the cancel flag
                                ws.current.send(JSON.stringify({ command: "ctrl-c" }));
                                setTimeout(() => 
                                {
                                    if (ws.current) 
                                    {
                                        ws.current.close();
                                    }
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

            }, [c]); //end of use Effect


            const handleSubmit = () => 
            { 
                    if (ws.current) 
                    {
                            ws.current.send(JSON.stringify(c));
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
                <div className="terminal">
                <div ref={terminalRef}>
                        {output && <pre>{output}</pre>}
                </div>
                </div>
            );
}

export default Terminal

