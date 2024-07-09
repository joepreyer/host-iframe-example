import React, { useEffect, useRef, useState } from "react";
import "./App.css";

const App: React.FC = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      console.log("HOST SITE EVENT");
      console.log(event.data);
      if (event.data === "closeChat") {
        return setChatOpen(false);
      }
      if (event.data === "openChat") {
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
      iframeRef.current.contentWindow.postMessage("openChat", "*");
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
          src="http://localhost:5173/"
          width="100%"
          height="600px"
          frameBorder="0"
          title="Embedded React App"
          style={{
            border: "2px solid red",
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
