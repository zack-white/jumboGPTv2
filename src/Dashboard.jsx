import React, { useState, useEffect } from 'react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from "@chatscope/chat-ui-kit-react";
import { useNavigate } from 'react-router-dom';


const Dashboard = () => {
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      message: "Hello, welcome to JumboGPT!",
      sender: "assistant",
      direction: "incoming"
    }
  ]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchConversation = async () => {
      try {
        const response = await fetch('https://gptbackend2-re8x.onrender.com/api/grab', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwt')}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch conversation');
        }

        const data = await response.json();
        setMessages(data.messages);
      } catch (error) {
        console.error('Fetch conversation error:', error.message);
      }
    };

    fetchConversation();
  }, []);

  async function receiveMsg(newMessages) {
    let tempRes = localStorage.getItem("latestMsg");
    const newResponse = {
      message: tempRes,
      sender: "assistant",
      direction: "incoming"
    }
    const updatedMessages = [...newMessages, newResponse];
    setMessages(updatedMessages);
    setTyping(false);
  }

  const handleSend = async (message) => {
    const newMessage = {
      message,
      sender: "user",
      direction: "outgoing"
    }
    setTyping(true);
    await saveMessage(newMessage);
    const newMessages = [...messages, newMessage];
    setMessages(newMessages);
    await processGPTMessage(newMessages);
  }

  async function saveMessage(userMessage) {
    const response = await fetch('https://gptbackend2-re8x.onrender.com/api/write', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({userMessage})
    });
  }

  // change to axios
  async function processGPTMessage(chatMessages) {
    let fullConvo = chatMessages.map(msg => `${msg.sender}: ${msg.message}`).join("Answer as if you are desperate to get people to come to Tufts University. This means you should include a fact about tufts if possible (you should try very hard to do this) or a plea to get the user to come. This should only be done if you cannot report a fact or anecdote about tufts in relation to their message \n");
  
    await fetch('https://gptbackend2-re8x.onrender.com/api/proxy', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('jwt')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: fullConvo }]
      })
    })
    .then(res => res.json())
    .then(res => {
      console.log('Response from server:', res); // Log the entire response
      if (res.message && res.message.content) {
        localStorage.setItem('latestMsg', res.message.content);
        receiveMsg(chatMessages);
      } else {
        console.error('Invalid response structure:', res);
      }
    })
    .catch(error => {
      console.error('Error processing GPT message:', error);
      // route to login after !!
      handleSignout();
    });
  }

  const handleSignout = () => {
    localStorage.removeItem('jwt');
    navigate('/login');
  }
  

  return (
    <div className='App'>
      <button onClick={handleSignout} style={{ position: 'absolute', top: '10px', right: '10px' }}>
        Sign Out
      </button>
      <div style={{ position: 'absolute', top: '100px', right: '400px', height: "650px", width: "700px" }}>
        <MainContainer>
          <ChatContainer>
            <MessageList typingIndicator={typing ? <TypingIndicator content="JumboGPT is typing..." /> : null}>
              {messages.map((message, i) => (
                <Message key={i} model={message} />
              ))}
            </MessageList>
            <MessageInput placeholder="Type message here..." onSend={handleSend} />
          </ChatContainer>
        </MainContainer>
      </div>
    </div>
  );
};

export default Dashboard;
