import React, { useEffect, useState, useRef } from "react";
import './App.css';

let webSocket = new WebSocket("ws://localhost:1337");

// webSocket.onopen = (event) => {
//   return messagesJSON = [];
// }

function App() {

  const _isMounted = useRef(true);

  const [isLogged, setIsLogged] = useState(false);
  const [username, setUsername] = useState("");
  const [history, setHistory] = useState([]);
  const [messages, setMessages] = useState([]);

  function sendMessage(event) {
    webSocket.send(event);
  }

  useEffect(() => {
    webSocket.onmessage = (event) => {
      let message = JSON.parse(event.data);
      if(message.type == "history") {
        setHistory(message.data);
      } else {
        setMessages(newMessage => [...newMessage, message.data]);
      }
    }

    return () => { _isMounted.current = false; }
  }, []);

  if(!isLogged) {
    return (
      <div className="container d-flex vh-100 justify-content-md-center align-items-center">
        <div className="row">
          
          <form className="p-5 border rounded border-info">
            <div className="form-group">
              <h1 className="mb-4">OutSmart Frontend Challenge App</h1>
              <div className="mb-3">
                <label for="inputUsername" class="form-label">Nome de usuário</label>
                <input type="text" className="form-control" id="inputUsername" placeholder="Insira seu nome de usuário"/>
              </div>
              
              <button 
                type="submit" 
                className="btn btn-info" 
                onClick={(event) => { 
                  event.preventDefault();

                  let value = document.getElementById("inputUsername").value;

                  if(value.length > 0) {
                    setUsername(value);
                    setIsLogged(true);
                  } else {
                    alert("Por favor, insira um nome de usuário para prosseguir.");
                  }

                  sendMessage(value);
                }}>Entrar</button>

                
            
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

          { history.length > 0 ?
          <>
            <div className="row">
              <div className="alert alert-info" role="alert">
                <h6 className=" mb-0">Mensagens no histórico:  <span class="badge bg-primary text-white"> { history.length } </span></h6>
              </div>
            </div>
            { history.map((item, index) => {
              return(
                <div className="row" key={index}>
                  <div className="col">
                    <div className="card">
                      <div className="card-body">
                        <h5 className="card-title">{ item.author } - { Date(item.date) }</h5>
                        <p className="card-text">{ item.text }</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })

            }
            <div className="row">
              <div className="alert alert-info" role="alert">
                <h6 className=" mb-0">Fim do histórico</h6>
              </div>
            </div>
            </>
            :
            <div className="row">
              <div className="alert alert-info" role="alert">
                <h6 className=" mb-0">Nenhuma mensagem no histórico</h6>
              </div>
            </div>
          }
        

        
        { messages.map((item, index) => {
          console.log(item)
            return(
              <div className="row" key={index}>
                <div className="col">
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title">{ item.author } - {  Date(item.date) } </h5>
                      <p className="card-text">{ item.text }</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        }
            <div className="row">
           <form className="form-inline">
             <div className="form-group">
               <input type="text" className="form-text" id="inputMessage" placeholder="Digite sua mensagem"/>
               <button 
                 type="submit" 
                 className="btn btn-primary" 
                onClick={(event) => { 
                   event.preventDefault();
                  sendMessage(document.getElementById("inputMessage").value)
                }}>Submit</button>
             </div>
           </form>
         </div>
       
      </div>
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
