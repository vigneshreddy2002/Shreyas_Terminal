import React, { useRef, useEffect } from 'react';
import { Terminal } from 'xterm';
import Markdown from "markdown-to-jsx";
import { renderToStaticMarkup } from 'react-dom/server';
import Terminal1 from './Terminal';

import 'xterm/css/xterm.css';

interface Terminal2Props {
  markdownText: string;
}

function Terminal2({ markdownText }: Terminal2Props) {
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const terminal = new Terminal();
    let singleLineTexts = markdownText.split("\r");
    if (terminalRef.current) {
      // terminal.open(terminalRef.current);
      for (let i = 0; i < singleLineTexts.length; i++) {
        // terminal.write('root@\x1B[1;3;31mncn-n001\x1B[0m :~ ')
        const jsx = <Markdown>{singleLineTexts[i]}</Markdown>;
        const html = renderToStaticMarkup(jsx);
        const convertedText = html.replace(/<\/?[^>]+(>|$)/g, "");
        // terminal.write(convertedText);
        // terminal.write("\n");
      }
    }

    return () => {
      terminal.dispose();
    };
  }, [markdownText]);

  return (
    <>
  {/* <div ref={terminalRef} /> */}
  {/* <Terminal1 c={markdownText}></Terminal1> */}
  </>
      );
}

export default Terminal2;

