import React, { useEffect, useRef, useState } from "react";
import "./App.css";

const CHAT_ORIGIN = "http://localhost:5173/";

enum MessageType {
  OPEN_CHAT = "openChat",
  CLOSE_CHAT = "closeChat",
}

type OpenChatMessage = {
  type: MessageType;
};

const App: React.FC = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent<OpenChatMessage>) => {
      if (event.data.type === MessageType.CLOSE_CHAT) {
        return setChatOpen(false);
      }
      if (event.data.type === MessageType.OPEN_CHAT) {
        return setChatOpen(true);
      }
    };

    window && window.addEventListener("message", handleMessage);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  const openChat = () => {
    setChatOpen(true);
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        { type: MessageType.OPEN_CHAT },
        CHAT_ORIGIN
      );
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Host Application</h1>
      </header>
      <main>
        <iframe
          ref={iframeRef}
          src={CHAT_ORIGIN}
          width="100%"
          height="600px"
          frameBorder="0"
          title="Embedded React App"
          style={{
            maxWidth: "32rem",
            height: "100svh",
            transform: chatOpen ? "translateX(0)" : "translateX(-100%)",
            transition: "transform 0.3s ease-in-out",
            width: "100vw",
            left: 0,
            bottom: 0,
            position: "fixed",
            zIndex: 50,
          }}
        ></iframe>

        <button
          onClick={openChat}
          style={{
            border: "2px solid red",
            width: "64px",
            height: "64px",
            left: "1.5rem",
            bottom: "1.5rem",
            position: "fixed",
          }}
        >
          Open
        </button>
      </main>
    </div>
  );
};

export default App;
