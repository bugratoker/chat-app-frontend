import React, { useContext, useEffect, useRef, useState } from 'react'
import {over} from 'stompjs';
import SockJS from 'sockjs-client';
import "./index.css"
import { loginContext } from './TestContext';
let stompClient=null;
const ChatRoom = () => {
    const initialData = JSON.parse(localStorage.getItem('data')) || {
        username:"",
        receivername: '',
        connected: false,
        message: ''
    };
    const initial={
        username: initialData.name,
        receivername: '',
        connected: false,
        message: ''
    }
    const {data} = useContext(loginContext);
    const loginRef = useRef(false);
    const [privateChats, setPrivateChats] = useState(new Map());     
    const [publicChats, setPublicChats] = useState([]); 
    const [tab,setTab] =useState("CHATROOM");
    const [userData, setUserData] = useState(initial);
      //USEREDUCER
      useEffect(()=>{
        
        console.log("connectedTo effectinin icinde")
      
        if(loginRef.current){

            console.log("connected to")
            connect();
            console.log(userData.username);
            console.log(initial.username)
            
        }else{
            console.log("first not connected to")
            loginRef.current=true;
        }
      

      },[userData.connected])

    useEffect(()=>{
        
        if(!initialData.connected){

            console.log(JSON.stringify(data));
            setUserData(prevState=>({...prevState,"connected":true}));
            console.log(initial.username)    
        }
        

    },[]);
    
    const connect =()=>{
        let Sock = new SockJS('http://localhost:8082/ws');
        stompClient = over(Sock);
        stompClient.connect({},onConnected, onError);
        console.log("burda");
    }

    const onConnected = () => {
        //setUserData({...userData,"connected": true});
        //topic/publice her mesaj geldiğinde onMessageReceived otomatik olarak çalıştırılır 
        stompClient.subscribe('/topic/public', onMessageReceived);
        stompClient.subscribe('/user/'+userData.username+'/private', onPrivateMessage);
        userJoin();
    }

    const userJoin=()=>{
        var chatMessage = {
            messageType:"JOIN",
            content: "",
            sender: userData.username,
            receiver:"",
            time:""
          };
          stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
          
          //console.log(JSON.stringify(chatMessage))
          //log >> {"sender":"asd","status":"JOIN"}
    }

    const onMessageReceived = (payload)=>{
        // payloadData example : {messageType: 'MESSAGE', content: 'sdsd', sender: 'asd', receiver: '', time: ''}
        //console.log("mesaj alındı");
        var payloadData = JSON.parse(payload.body);
        //console.log("payload datanın bodysi : "+JSON.stringify(payloadData));
        switch(payloadData.messageType){
            case "JOIN":
                if(!privateChats.get(payloadData.sender)){
                    privateChats.set(payloadData.sender,[]);
                    setPrivateChats(new Map(privateChats));
                }
                break;
            case "MESSAGE":
                publicChats.push(payloadData);
                console.log("burda12345")
                setPublicChats([...publicChats]);
                break;
        }
    }
    
    const onPrivateMessage = (payload)=>{
        console.log(JSON.stringify(payload));
        var payloadData = JSON.parse(payload.body);
        if(privateChats.get(payloadData.sender)){
            privateChats.get(payloadData.sender).push(payloadData);
            setPrivateChats(new Map(privateChats));
        }else{
            let list =[];
            list.push(payloadData);
            privateChats.set(payloadData.sender,list);
            setPrivateChats(new Map(privateChats));
        }
    }

    const onError = (err) => {
        console.log(err);
        
    }

    const handleMessage =(event)=>{
        const {value}=event.target;
        setUserData({...userData,"message": value});
    }

    const sendValue=()=>{
        console.log(JSON.stringify(userData));
           
           
        var chatMessage = {
            messageType:"MESSAGE",
            content: userData.message,
            sender: userData.username,
            receiver:"",
            time:""
          };
          
          if(chatMessage.content!==""){

            stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
            setUserData({...userData,"message": ""});
          }
        
              
            
    }

    const sendPrivateValue=()=>{
        if (stompClient) {
          var chatMessage = {
            sender: userData.username,
            receiverName:tab,
            message: userData.message,
            status:"MESSAGE",
            time:""
          };
          
          if(userData.username !== tab){
            privateChats.get(tab).push(chatMessage);
            setPrivateChats(new Map(privateChats));
          }
          if(chatMessage.message!==""){

            stompClient.send(`/user/${tab}/private`, {}, JSON.stringify(chatMessage));
          setUserData({...userData,"message": ""});
          }
        }
    }

    return (
    <div className="container">
        
        <div className="chat-box">
            
            
            <div className="member-list">
                <ul>
                    <li onClick={()=>{setTab("CHATROOM")}} className={`member ${tab==="CHATROOM" && "active"}`}>Chatroom</li>
                    {[...privateChats.keys()].map((name,index)=>(
                        <li onClick={()=>{setTab(name)}} className={`member ${tab===name && "active"}`} key={index}>{name}</li>
                    ))}
                </ul>
            </div>


            {tab==="CHATROOM" && <div className="chat-content">
                <ul className="chat-messages">
                    {publicChats.map((chat,index)=>(
                            // payloadData example : {messageType: 'MESSAGE', content: 'sdsd', sender: 'asd', receiver: '', time: ''}
                            //  userData example : username: '',receivername: '' connected: false,message: ''
                        <li className={`message ${chat.sender === userData.username && "self"}`} key={index}>
                            {chat.sender !== userData.username && <div className="avatar">{chat.sender}</div>}
                            <div className="message-data">{chat.content}</div>
                            {chat.sender === userData.username && <div className="avatar self">{chat.sender}</div>}
                        </li>
                    ))}
                </ul>

                <div className="send-message">
                    <input type="text" className="input-message" placeholder="enter the message" value={userData.message} onChange={handleMessage} /> 
                    <button type="button" className="send-button" onClick={sendValue}>send</button>
                </div>
            </div>}


            {tab!=="CHATROOM" && <div className="chat-content">
                <ul className="chat-messages">
                    {[...privateChats.get(tab)].map((chat,index)=>(
                        <li className={`message ${chat.sender === userData.username && "self"}`} key={index}>
                            {chat.sender !== userData.username && <div className="avatar">{chat.sender}</div>}
                            <div className="message-data">{chat.message}</div>
                            {chat.sender === userData.username && <div className="avatar self">{chat.sender}</div>}
                        </li>
                    ))}
                </ul>

                <div className="send-message">
                    <input type="text" className="input-message" placeholder="enter the message" value={userData.message} onChange={handleMessage} /> 
                    <button type="button" className="send-button" onClick={sendPrivateValue}>send</button>
                </div>
            </div>}


        </div>
        
        
        
 



    </div>
    )
}
//public mesajlar /app/message'a gönderilir
//public mesajlar /topic/public'e subscribe olan clientlar tarafından alınır
export default ChatRoom