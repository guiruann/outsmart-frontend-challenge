import React, { useEffect, useState } from "react";
import './App.css';

let webSocket = new WebSocket("ws://localhost:1337");

// webSocket.onopen = (event) => {
//   return messagesJSON = [];
// }

function App() {

  const [isLogged, setIsLogged] = useState(false);
  const [username, setUsername] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    getMessage();
  }, []);

  function sendMessage(message) {
    return webSocket.send(message);
  }
  
  function getMessage() {
    webSocket.onmessage = (message) => {
      message = JSON.parse(message.data);
      setMessages(newMessage => [...newMessage, message.data]);
    }
  }

  if(!isLogged) {
    return (
      <div className="container">
        <div className="row">
          <form className="form-inline">
            <div className="form-group">
              <input type="text" className="form-text" id="inputUsername" placeholder="Insira seu nome de usuário"/>
              <button 
                type="submit" 
                className="btn btn-primary" 
                onClick={(event) => { 
                  event.preventDefault();

                  let value = document.getElementById("inputUsername").value;

                  if(value.length > 0) {
                    setUsername(value);
                    setIsLogged(true);
                  } else {
                    alert("Por favor, insira um nome de usuário");
                  }

                  sendMessage(value);
                }}>Submit</button>
            </div>
          </form>
        </div>
      </div>
    );
  } else {
    return(
      
      <div>
        <div className="container">
          <div className="row">
            <div className="col">Conversa OutSmart</div>
          </div>
        </div>
        {messages.map((item, i) => {
         return(
          // <div className="row" key={i}>
          //   <div className="col">
          //     <div className="card">
          //       <div className="card-body">
          //         <h5 className="card-title">{ item[i].author }</h5>
          //         <h6 className="card-subtitle mb-2 text-muted">{ item.time }</h6>
          //         <p className="card-text">{ item.text }</p>
          //       </div>
          //     </div>
          //   </div>
          // </div>
          <span>{ item.time }</span>
        );
        })}
      </div>

    );



        
        
        
        /* { 
        (messagesJSON.length !== 0) ?
        messagesJSON.map((item, i) => {
          console.log(item.data[i].text)
          return(
            <div className="row">
              <div className="col">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">{ item.data[i].author }</h5>
                    <h6 className="card-subtitle mb-2 text-muted">{ item.data[i].time }</h6>
                    <p className="card-text">{ item.data[i].text }</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })
      :
      <p>dasdsasdasad</p>
      } */
  
      //   <div className="row">
      //     <form className="form-inline">
      //       <div className="form-group">
      //         <input type="text" className="form-text" id="inputMessage" placeholder="Digite sua mensagem"/>
      //         <button 
      //           type="submit" 
      //           className="btn btn-primary" 
      //           onClick={(event) => { 
      //             event.preventDefault();
      //             sendMessage(document.getElementById("inputMessage").value)
      //           }}>Submit</button>
      //       </div>
      //     </form>
      //   </div>
      // </div>
   
  }
}

export default App;
