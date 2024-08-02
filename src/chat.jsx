import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from "@chatscope/chat-ui-kit-react"
import { useState } from 'react'

async function ChatScreen() {
        const [typing, setTyping] = useState(false);
        const [messages, setMessages] = useState([
          {
            message: "Hello, welcome to JumboGPT!",
            sender: "JumboGPT",
            direction : "incoming"
          }
        ]);
      
      
        const handleSend = async (message) => {
          const newMessage = {
            message,
            sender : "user",
            direction : "outgoing"
          }
      
          const newMessages = [...messages, newMessage];
      
          setMessages(newMessages);
      
          setTyping(true);
      
          await processGPTMessage(newMessages);
        }
      
        async function processGPTMessage(chatMessages){
          
        }
        return (
          <>
            <div className='App'>
              <div style={{position:"relative", height:"800px", width:"700px"}}>
                <MainContainer>
                  <ChatContainer>
                    <MessageList
                    typingIndicator={typing ? <TypingIndicator content = "JumboGPT is typing..." /> : null}>
                      {messages.map((message, i) => {
                        return <Message key={i} model={message} />
                      })}
                    </MessageList>
                    <MessageInput placeholder = "Type message here." onSend={handleSend}/>
                  </ChatContainer>
                </MainContainer>
      
              </div>
              
            </div>
          </>
        )
      }

      export default ChatScreen;