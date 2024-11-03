import React, { useState } from "react";
import axios from "axios";

const App = () => {
  const [processMessage, setProcessMessage] = useState("");
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([]);

  const handleSendProcess = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post("http://localhost:3001/send-process", {
        message: processMessage,
      });
      setStatus(`Proceso enviado: ID ${response.data.messageId}`);
    } catch (error) {
      if (error.response) {
        setStatus(error.response.data.error);
      } else {
        setStatus("Error enviando el proceso");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckProcess = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("http://localhost:3001/messages");
      setMessages(response.data);
      setStatus("Mensajes obtenidos correctamente");
    } catch (error) {
      if (error.response) {
        setStatus(error.response.data.error);
      } else {
        setStatus("Error verificando los mensajes");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1>Monitor de Procesos</h1>
      <input
        type="text"
        placeholder="Escribe el proceso"
        value={processMessage}
        onChange={(e) => setProcessMessage(e.target.value)}
      />
      <button onClick={handleSendProcess} disabled={isLoading}>
        {isLoading ? "Enviando..." : "Enviar Proceso"}
      </button>
      <button onClick={handleCheckProcess} disabled={isLoading}>
        {isLoading ? "Verificando..." : "Verificar Procesos"}
      </button>
      <p>{status}</p>
      <ul>
        {messages.map((msg) => (
          <li key={msg.messageId}>
            {msg.body} - {msg.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;