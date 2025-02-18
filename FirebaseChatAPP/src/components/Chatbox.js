import React, { useEffect, useRef, useState } from "react";
import Message from "./Message";
import SendMessage from "./SendMessage";
import { getChat } from "../api";

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const scroll = useRef();
  

  useEffect(() => {
    // const q = query(
    //   collection(db, "messages"),
    //   orderBy("createdAt", "desc"),
    //   limit(50)
    // );

    // const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
    //   const fetchedMessages = [];
    //   QuerySnapshot.forEach((doc) => {
    //     fetchedMessages.push({ ...doc.data(), id: doc.id });
    //   });
    //   const sortedMessages = fetchedMessages.sort(
    //     (a, b) => a.createdAt - b.createdAt
    //   );
    //   setMessages(sortedMessages);
    // });
    // return () => unsubscribe;
    getChat().then((data) => {
      setMessages(data);
      console.log(messages);
      // Ensure the messages state is updated before scrolling
      setTimeout(() => {
        if (scroll.current) {
          scroll.current.scrollIntoView({ behavior: "smooth" });
        }
      }, 25);
    });
    console.log("called");
    return () => getChat;
  }, [refreshTrigger]);

  return (
    <main className="chat-box">
      <div className="messages-wrapper">
        {messages?.map((message) => (
          <Message key={message.id} message={message} />
        ))}
      </div>
      <span ref={scroll}></span>
      <SendMessage scroll={scroll} setRefreshTrigger={setRefreshTrigger}/>
    </main>
  );
};

export default ChatBox;