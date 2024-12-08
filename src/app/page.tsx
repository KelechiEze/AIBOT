"use client";

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChessKing,
  faArrowLeft,
  faPaperPlane,
  faStar,
  faPaperclip,
  faSmile,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import styles from "./styles/Page.module.css";

const Page = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isChatPage, setIsChatPage] = useState(false);
  const [inputText, setInputText] = useState("");
  const [isMessageVisible, setIsMessageVisible] = useState(false);
  const [messages, setMessages] = useState<
    { role: string; content: string }[]
  >([]);
  const [showChatText, setShowChatText] = useState(true);

  const handleCustomerCareClick = () => {
    setIsModalOpen(true);
    setTimeout(() => setIsVisible(true), 50);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsVisible(false);
    setTimeout(() => {
      setIsModalOpen(false);
      setIsChatPage(false);
      document.body.style.overflow = "";
    }, 300);
  };

  const openChatPage = () => {
    setIsChatPage(true);
  };

  const goBackToModalPage = () => {
    setIsChatPage(false);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(event.target.value);
  };

  const sendMessage = async () => {
    if (inputText.trim() === "") return;

    setMessages([...messages, { role: "user", content: inputText }]);

    try {
      const response = await axios.post("http://localhost:5000/send-message", {
        message: inputText,
      });

      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "assistant", content: response.data.message },
      ]);

      setInputText("");
      setIsMessageVisible(true);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isModalOpen) {
        closeModal();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen]);

  useEffect(() => {
    if (isChatPage && isMessageVisible) {
      const timeout = setTimeout(() => {
        setIsMessageVisible(false);
      }, 10000);
      return () => clearTimeout(timeout);
    }
  }, [isMessageVisible, isChatPage]);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowChatText((prev) => !prev);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.overlay}></div>

      <div className={styles.leftSection}>
        <h1 className={styles.heading}>
          Revolutionize Your Workflow <br /> with AI-Driven Solutions
        </h1>
        <ul className={styles.list}>
          <li>Register to unlock access to cutting-edge AI tools and resources.</li>
          <li>Explore personalized AI solutions tailored to your business needs.</li>
          <li>Gain real-time analytics powered by advanced AI algorithms.</li>
          <li>Stay ahead with predictive insights and data-driven decision-making.</li>
        </ul>
        <button className={styles.button}>Get Started</button>
      </div>

      <div className={styles.rightSection}>
        <img
          src="/aiimage.png"
          alt="AI Integration"
          className={styles.image}
        />
      </div>

      <div className={styles.chatIcon} onClick={handleCustomerCareClick}>
        <FontAwesomeIcon icon={faChessKing} size="2x" color="#fff" />
        {showChatText && (
          <span className={styles.chatText}>Chat with AI</span>
        )}
      </div>

      {isModalOpen && (
        <div
          className={`${styles.modal} ${isVisible ? styles.open : ""}`}
          role="dialog"
          aria-hidden={!isModalOpen}
          aria-modal="true"
        >
          {isChatPage ? (
            <div className={styles.chatPage}>
              <div className={styles.modalHeader}>
                <button
                  onClick={goBackToModalPage}
                  className={styles.backButton}
                  aria-label="Back to initial modal"
                >
                  <FontAwesomeIcon icon={faArrowLeft} />
                </button>
                <h2>Chat with AI Bot</h2>
                <button
                  onClick={closeModal}
                  className={styles.closeButton}
                  aria-label="Close modal"
                >
                  &times;
                </button>
              </div>

              <div className={styles.chatContent}>
                {messages.map((msg, index) => (
                  <div key={index} className="messageContainer">
                    <div
                      className={
                        msg.role === "assistant"
                          ? styles.botMessage
                          : "userMessage"
                      }
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles.chatInputContainer}>
                <textarea
                  className={styles.chatInput}
                  placeholder="Type your message..."
                  value={inputText}
                  onChange={handleInputChange}
                />
                {inputText === "" && (
                  <div className={styles.iconContainer}>
                    <button className={styles.iconButton}>
                      <FontAwesomeIcon icon={faStar} />
                    </button>
                    <button className={styles.iconButton}>
                      <FontAwesomeIcon icon={faPaperclip} />
                    </button>
                    <button className={styles.iconButton}>
                      <FontAwesomeIcon icon={faSmile} />
                    </button>
                  </div>
                )}
                <button
                  className={styles.sendButton}
                  onClick={sendMessage}
                >
                  <FontAwesomeIcon icon={faPaperPlane} />
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className={styles.modalHeader2}>
                <div className={styles.modalHeader}>
                  <h2>Hi there 👋</h2>
                  <button
                    onClick={closeModal}
                    className={styles.closeButton}
                    aria-label="Close modal"
                  >
                    &times;
                  </button>
                </div>
                <div>
                  <p>Welcome to Takeover At The Summit 2025</p>
                </div>
              </div>
              <div className={styles.modalContent}>
                <div className={styles.newConversationContainer}>
                  <button
                    className={styles.newConversationButton}
                    onClick={openChatPage}
                  >
                    <FontAwesomeIcon
                      icon={faPaperPlane}
                      style={{ marginRight: "0.5rem" }}
                    />
                    New Conversation
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Page;
