import React, { useEffect, useState, useRef } from "react";
import './App.css';

let webSocket = new WebSocket("ws://localhost:1337");

function App() {

  const _isMounted = useRef(true);

  const [isLogged, setIsLogged] = useState(false);
  const [username, setUsername] = useState();
  const [history, setHistory] = useState([]);
  const [messages, setMessages] = useState([]);

  const endMessages = useRef(null);

  function sendMessage(event) {
    webSocket.send(event);
  }

  const getInput = (id) =>  {
    let value = document.getElementById(id).value;
    document.getElementById(id).value = "";

    return value;
  }

  useEffect(() => {
    webSocket.onmessage = (event) => {
      let message = JSON.parse(event.data);
      if(message.type === "history") {
        setHistory(message.data);
      } else {
        setMessages(newMessage => [...newMessage, message.data]);
      }
    }

    if(messages.length > 0) {
      endMessages.current.scrollIntoView({ behavior: 'smooth'});
    }

    return () => { _isMounted.current = false; }
  }, [messages]);

  if(!isLogged) {
    return (
      <div className="container d-flex vh-100 justify-content-md-center align-items-center">
        <div className="row">
          <form className="p-5 border rounded border-info">
            <div className="form-group">
              <h1 className="mb-4">OutSmart Frontend Challenge App</h1>
              <div className="mb-3">
                <label className="form-label">Nome de usuário</label>
                <input type="text" className="form-control" id="inputUsername" placeholder="Insira seu nome de usuário"/>
              </div>
              <button 
                type="submit" 
                className="btn btn-info" 
                onClick={(event) => { 
                  event.preventDefault();

                  let value = getInput("inputUsername");

                  if(value.length > 0) {
                    setUsername(value);
                    sendMessage(value);
                    setIsLogged(true);
                  } else {
                    alert("Por favor, insira um nome de usuário para prosseguir.");
                  }
                }}>Entrar</button>
            </div>
          </form>
        </div>
      </div>
    );
  } else {
    return(
      <div className="vh-100">
        <div className="container-fluid px-0 custom-navbar-height">
          <div className="row">
            <div className="col-md-12">
              <nav className="navbar navbar-dark bg-dark">
                <span className="navbar-brand">Conversa OutSmart - Usuário: { username }</span>
              </nav>
            </div>
          </div>
        </div>
        <div className="container overflow-auto custom-container-height">
          { history.length > 0 ?
            <>
              <div className="row my-2 justify-content-center">
                <div className="alert alert-info" role="alert">
                  <h6 className="mb-0">Mensagens no histórico:  <span className="badge bg-primary text-white">{ history.length }</span></h6>
                </div>
              </div>
              { history.map((item, index) => {
                return(
                  <div className="row my-3 justify-content-center" key={index}>
                    <div className="col-md-8">
                      <div className="card">
                        <div className="card-body">
                          <p className="card-title">
                            <span><strong style={{color: item.color}}>{ item.author }</strong> - { new Date(item.time).toLocaleString() }</span>
                          </p>
                          <p className="card-text">{ item.text }</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div className="row my-2 justify-content-center">
                <div className="alert alert-info" role="alert">
                  <h6 className="mb-0">Fim do histórico</h6>
                </div>
              </div>
            </>
            :
              <div className="row my-2 justify-content-center">
                <div className="alert alert-info" role="alert">
                  <h6 className=" mb-0">Nenhuma mensagem no histórico</h6>
                </div>
              </div>
          }
          { messages.map((item, index) => {
            return(
              <div className={"row my-3 " + (item.author === username ? "justify-content-end" : "justify-content-start")} key={index} ref={ (index+1 === messages.length) ? endMessages : null }>
                <div className="col-md-8">
                  <div className="card">
                    <div className="card-body">
                      <p className="card-title">
                        <span><strong style={{color: item.color}}>{ item.author }</strong> - { new Date(item.time).toLocaleString() }</span>
                      </p>
                      <p className="card-text">{ item.text }</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="container-fluid px-0 static-bottom custom-footer-height">
          <div className="row py-3 justify-content-center bg-dark">
           <form className="form-inline">
             <div className="form-group">
                <input type="text" className="form-control mr-3" id="inputMessage" placeholder="Digite sua mensagem"/>
                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  onClick={(event) => { 
                    event.preventDefault();
                    sendMessage(getInput("inputMessage"));
                  }}>Enviar</button>
             </div>
           </form>
         </div>
        </div>
      </div>
    );
  }
}

export default App;