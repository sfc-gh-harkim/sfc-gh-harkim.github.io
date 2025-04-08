'use client';

import React, { useState, useEffect, Suspense } from 'react';
import styles from './intelligence.module.css';
import Image from 'next/image';
import Link from 'next/link';

// Main export component with Suspense
export default function IntelligencePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <IntelligenceContent />
    </Suspense>
  );
}

// Client component that uses searchParams
function IntelligenceContent() {
  const [introState, setIntroState] = useState({
    started: false,
    animate: false,
    removeMask: false
  });
  
  const [setupState, setSetupState] = useState({
    started: false,
    animate: false
  });
  
  const [inputFocused, setInputFocused] = useState(false);
  const [inputText, setInputText] = useState('');
  const [chatActive, setChatActive] = useState(false);
  const [messages, setMessages] = useState<Array<{type: string; text: string}>>([]);
  const [streamingResponse, setStreamingResponse] = useState(false);
  const [streamedText, setStreamedText] = useState('');
  const [responseComplete, setResponseComplete] = useState(false);
  const [streamingCode, setStreamingCode] = useState(false);
  const [streamedCode, setStreamedCode] = useState('');
  const [codeComplete, setCodeComplete] = useState(false);
  const [currentResponse, setCurrentResponse] = useState({
    header: "Here's a summary of yesterday's performance:",
    text: "",
    code: ""
  });
  
  // Database factoids to display for subsequent submissions
  const databaseFactoids = [
    {
      header: "Did you know?",
      text: "The first commercial database was created by IBM in the 1960s. Known as IMS (Information Management System), it was developed for NASA's Apollo space program to inventory the massive bill of materials for the Saturn V moon rocket and Apollo space vehicle.",
      code: `SELECT 'Apollo' AS program, 'IMS' AS first_commercial_db;`
    },
    {
      header: "Database Fun Fact",
      text: "PostgreSQL, one of the most popular open-source databases, was originally called POSTGRES and was developed at the University of California, Berkeley. It was later renamed to PostgreSQL to reflect its support for SQL.",
      code: `SELECT version(), 
       'University of California, Berkeley' AS origin;`
    },
    {
      header: "SQL Trivia",
      text: "SQL (Structured Query Language) was initially developed at IBM in the 1970s and was originally called SEQUEL (Structured English Query Language). The name was later shortened to SQL due to trademark issues.",
      code: `-- Originally SEQUEL: Structured English QUEry Language
WITH history AS (
  SELECT 1970 AS year_created, 'IBM' AS creator
)
SELECT * FROM history;`
    }
  ];
  
  const mockResponse = {
    header: "Here's a summary of yesterday's performance:",
    text: "Total sales reached 132 units across all regions, which is a 7% increase from the previous day. The Model Y accounted for 54% of sales, followed by the Model 3 at 32%. The most successful region was California, contributing 42 units. Additionally, customer inquiries related to the Cybertruck increased by 18% after the latest social media campaign",
    code: `-- Simple Moving Average prediction
WITH historical_sales AS (
  SELECT
    date,
    product_id,
    sales_amount,
    AVG(sales_amount) OVER (
      ORDER BY date
      ROWS BETWEEN 3 PRECEDING AND 1 PRECEDING
    ) as moving_avg
  FROM sales_data
)
SELECT
  date,`
  };

  const handleSubmit = () => {
    if (!inputText.trim()) return;
    
    // Add user message
    setMessages(prev => [...prev, { type: 'user', text: inputText }]);
    setInputText('');
    
    // Apply overflow-y scroll to container if not already active
    if (!chatActive) {
      setChatActive(true);
      document.querySelector(`.${styles.container}`)?.classList.add(styles.chatActiveContainer);
    }
    
    // Reset streaming states
    setStreamingResponse(true);
    setResponseComplete(false);
    setStreamingCode(false);
    setCodeComplete(false);
    
    // Use a factoid if this is a subsequent submission (chat already active)
    const responseToUse = chatActive 
      ? databaseFactoids[Math.floor(Math.random() * databaseFactoids.length)]
      : mockResponse;
    
    // Save the current response for consistent display
    setCurrentResponse(responseToUse);
    
    // Simulate streaming the AI response
    let currentText = '';
    const fullResponse = responseToUse.text;
    const interval = setInterval(() => {
      if (currentText.length < fullResponse.length) {
        currentText = fullResponse.substring(0, currentText.length + 3);
        setStreamedText(currentText);
      } else {
        clearInterval(interval);
        setStreamingResponse(false);
        setResponseComplete(true);
        
        // Add AI response to messages
        setMessages(prev => [...prev, { 
          type: 'ai', 
          text: `${responseToUse.header}\n\n${responseToUse.text}` 
        }]);
        
        // Only show code block for the initial response, not for factoids
        if (!chatActive || responseToUse === mockResponse) {
          // Start streaming code after response completes
          setStreamingCode(true);
          streamCode(responseToUse.code);
        }
      }
    }, 30);
  };
  
  const streamCode = (codeToStream: string) => {
    let currentCode = '';
    const fullCode = codeToStream;
    const codeInterval = setInterval(() => {
      if (currentCode.length < fullCode.length) {
        currentCode = fullCode.substring(0, currentCode.length + 2);
        setStreamedCode(currentCode);
      } else {
        clearInterval(codeInterval);
        setStreamingCode(false);
        setCodeComplete(true);
        
        // Add code to messages list
        setMessages(prev => [...prev, { type: 'code', text: fullCode }]);
      }
    }, 20);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  useEffect(() => {
    // Make sure we're in client-side environment
    if (typeof window !== 'undefined') {
      console.log('Starting animation sequence');
      
      // Start both animations immediately without delay
      setIntroState({
        started: true,
        animate: true,
        removeMask: false
      });

      // Start setup animation immediately too
      setSetupState({
        started: true,
        animate: true
      });
      
      console.log('Animation states set');
      
      // Apply removeMask animation after mainContent animation finishes
      // mainContent animation has 0.75s delay and 1.2s duration = 1.95s total
      setTimeout(() => {
        setIntroState(prev => ({
          ...prev,
          removeMask: true
        }));
        console.log('Remove mask applied');
      }, 1200); // Slightly longer than 1.95s to ensure smooth transition
    }
  }, []);

  // Track current conversation state
  useEffect(() => {
    // Debug current state
    if (responseComplete) {
      console.log('Response completed');
    }
    
    if (codeComplete) {
      console.log('Code completed');
    }
  }, [responseComplete, codeComplete]);

  // Determine container classes based on animation states
  const containerClasses = [styles.container];
  
  // Add gradient background class if in animation state
  if (introState.animate) {
    containerClasses.push(styles.thinkingBGActive);
  }

  return (
    <div className={styles.container}>
      {/* Secondary background layer */}
      <div className={`${styles.secondaryBackground} ${introState.animate ? styles.thinkingBGActive : ''}`} />
      
      {/* Mobile Header - Only visible on small screens */}
      <header className={styles.mobileHeader}>
        <button className={styles.menuButton} aria-label="Open menu">
          <Image 
            src="/assets/intelligence/navigation.svg"
            alt=""
            width={24}
            height={24}
          />
        </button>
        <div className={styles.mobileLogo}>
          <Image 
            src="/assets/intelligence/logo.svg"
            alt="Intelligence"
            width={24}
            height={24}
          />
          intelligence
        </div>
        <Image
          src="/assets/intelligence/avatar.png"
          alt="Jennifer Reynolds"
          width={32}
          height={32}
          className={styles.mobileAvatar}
        />
      </header>
      
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <Image 
            src="/assets/intelligence/logo.svg"
            alt="Intelligence"
            width={24}
            height={24}
          />
          intelligence
        </div>

        <nav className={styles.nav}>
          <Link href="#" className={styles.navItem}>
            <Image 
              src="/assets/intelligence/chats.svg"
              alt=""
              width={24}
              height={24}
            />
            Home
          </Link>
          <Link href="#" className={styles.navItem}>
            <Image 
              src="/assets/intelligence/robot.svg"
              alt=""
              width={24}
              height={24}
            />
            Agents
          </Link>
          <Link href="#" className={styles.navItem}>
            <Image 
              src="/assets/intelligence/folder.svg"
              alt=""
              width={24}
              height={24}
            />
            Projects
          </Link>
          <Link href="#" className={styles.navItem}>
            <Image 
              src="/assets/intelligence/clock.svg"
              alt=""
              width={24}
              height={24}
            />
            Recent
          </Link>
        </nav>

        <div className={styles.bottomSection}>
          <Link href="#" className={styles.helpLink}>
            <Image 
              src="/assets/intelligence/headset.svg"
              alt=""
              width={24}
              height={24}
            />
            Help & support
          </Link>

          <div className={styles.profile}>
            <Image
              src="/assets/intelligence/avatar.png"
              alt="Jennifer Reynolds"
              width={32}
              height={32}
              className={styles.profileImage}
            />
            <span>Jennifer Reynolds</span>
          </div>
        </div>
      </aside>

      <main className={`${styles.mainContent} ${setupState.animate ? styles.animate : ''} ${chatActive ? styles.chatActive : ''}`}>
        {/* Static Telescope SVG */}
        <div className={`${styles.introAnimation} ${introState.animate ? styles.animate : ''}`}>
          <Image
            src="/assets/intelligence/telescope-light.svg"
            alt="Telescope illustration"
            width={1380}
            height={1141}
            priority
            loading="eager"
            className={`${styles.telescopeImage} ${introState.removeMask ? styles.removeMask : ''}`}
          />
        </div>

        <div className={styles.animatedContent}>
          <h1 className={styles.greeting} style={{opacity: 1, visibility: 'visible'}}>
            <span className={styles.greetingPt1}>Good afternoon,&nbsp;</span> 
            <span className={styles.greetingPt2}>Jennifer.</span>
          </h1>
          <h2 className={styles.subtitle}>What insights are you looking for?</h2>
          
          <div className={styles.inputContainer}>
            <textarea
              className={styles.input}
              placeholder="How may I assist you?"
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              value={inputText}
            ></textarea>
            
            {inputText.length > 0 && (
              <div className={styles.inputControls}>
                {inputFocused && !chatActive && (
                  <div className={styles.inputOptions}>
                    <button className={styles.inputOptionItem}>
                      <span>General Knowledge</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M7 10L12 15L17 10" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    
                    <button className={styles.inputOptionItem}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M12 5V19M5 12H19" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span>Upload Files</span>
                    </button>
                  </div>
                )}
                
                <button className={styles.sendButton} onClick={handleSubmit}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.3466 6.57854L11.3466 21L13.267 21L13.267 6.58127L12.3068 5.61967L11.3466 6.57854Z" fill="currentColor"/>
                    <path d="M11.3466 4.87535L13.267 4.87535L13.267 6.58127L18.2955 11.614L19.6136 10.3072L13.0139 3.70746C12.6234 3.31694 11.9902 3.31694 11.5997 3.70746L5 10.3072L6.30682 11.614L11.3466 6.57854L11.3466 4.87535Z" fill="currentColor"/>
                    <path d="M13.267 4.87535L11.3466 4.87535L11.3466 6.57854L12.3068 5.61967L13.267 6.58127L13.267 4.87535Z" fill="currentColor"/>
                  </svg>
                </button>
              </div>
            )}
            
            {inputText.length === 0 && !chatActive && (
              <button className={styles.micButton}>
                <Image 
                  src="/assets/intelligence/mic.svg"
                  alt="Microphone"
                  width={24}
                  height={24}
                />
              </button>
            )}
            
            {chatActive && (
              <div className={styles.inputControls}>
                <div className={styles.inputOptions}>
                  <button className={styles.inputOptionItem}>
                    <span>General Knowledge</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M7 10L12 15L17 10" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  
                  <button className={styles.inputOptionItem}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M12 5V19M5 12H19" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>Upload Files</span>
                  </button>
                  
                  <button className={styles.inputOptionItem}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2L4 14h16L12 2z" stroke="#666" strokeWidth="1.5"/>
                    </svg>
                    <span>3 Documents</span>
                  </button>
                </div>
                <button className={styles.sendButton} onClick={handleSubmit}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.3466 6.57854L11.3466 21L13.267 21L13.267 6.58127L12.3068 5.61967L11.3466 6.57854Z" fill="currentColor"/>
                    <path d="M11.3466 4.87535L13.267 4.87535L13.267 6.58127L18.2955 11.614L19.6136 10.3072L13.0139 3.70746C12.6234 3.31694 11.9902 3.31694 11.5997 3.70746L5 10.3072L6.30682 11.614L11.3466 6.57854L11.3466 4.87535Z" fill="currentColor"/>
                    <path d="M13.267 4.87535L11.3466 4.87535L11.3466 6.57854L12.3068 5.61967L13.267 6.58127L13.267 4.87535Z" fill="currentColor"/>
                  </svg>
                </button>
              </div>
            )}
          </div>
          
          <div className={styles.suggestedQueries}>
            <button className={styles.queryButton}>
              <Image 
                src="/assets/intelligence/magnifying-glass.svg"
                alt=""
                width={16}
                height={16}
                className={styles.queryIcon}
              />
              Are there any leads I need to follow up with today?
            </button>
            <button className={styles.queryButton}>
              <Image 
                src="/assets/intelligence/magnifying-glass.svg"
                alt=""
                width={16}
                height={16}
                className={styles.queryIcon}
              />
              What use cases have not been updated?
            </button>
            <button className={styles.queryButton}>
              <Image 
                src="/assets/intelligence/magnifying-glass.svg"
                alt=""
                width={16}
                height={16}
                className={styles.queryIcon}
              />
              What&apos;s the email and phone number for the account?
            </button>
            <button className={styles.queryButton}>
              <Image 
                src="/assets/intelligence/magnifying-glass.svg"
                alt=""
                width={16}
                height={16}
                className={styles.queryIcon}
              />
              Has this lead responded to any outreach recently?
            </button>
          </div>
        </div>
        
        {/* Chat Messages */}
        {chatActive && (
          <div className={styles.chatContainer}>
            {/* Display all messages in the conversation */}
            {messages.map((message, index) => (
              <div key={index} className={`${message.type === 'user' ? styles.userMessage : (message.type === 'code' ? styles.codeMessage : '')}`}>
                {message.type === 'user' && (
                  <div className={styles.message}>
                    {message.text}
                  </div>
                )}
                
                {message.type === 'ai' && (
                  <div className={styles.aiResponse}>
                    <div className={styles.responseIcon}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path fillRule="evenodd" clipRule="evenodd" d="M12.5 4.5a8 8 0 100 16 8 8 0 000-16zm0 3a5 5 0 100 10 5 5 0 000-10z" fill="#29B5E8"/>
                      </svg>
                    </div>
                    <div className={styles.responseContent}>
                      <div className={styles.responseHeader}>{message.text.split('\n\n')[0]}</div>
                      <div className={styles.responseText}>{message.text.split('\n\n')[1]}</div>
                    </div>
                  </div>
                )}
                
                {message.type === 'code' && (
                  <div className={styles.codeBlock}>
                    <div className={styles.codeHeader}>
                      <span>sql</span>
                      <div className={styles.codeActions}>
                        <button className={styles.codeAction}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M12 4V20M4 12H20" stroke="#666" strokeWidth="1.5" strokeLinecap="round"/>
                          </svg>
                        </button>
                        <button className={styles.codeAction}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M4 12H20M12 4L20 12L12 20" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                    <pre className={styles.code}>{message.text}</pre>
                  </div>
                )}
              </div>
            ))}
            
            {/* Show actively streaming response */}
            {streamingResponse && (
              <div className={styles.aiResponse}>
                <div className={styles.responseIcon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12.5 4.5a8 8 0 100 16 8 8 0 000-16zm0 3a5 5 0 100 10 5 5 0 000-10z" fill="#29B5E8"/>
                  </svg>
                </div>
                <div className={styles.responseContent}>
                  <div className={styles.responseHeader}>{currentResponse.header}</div>
                  <div className={styles.responseText}>{streamedText}</div>
                </div>
              </div>
            )}
            
            {/* Show actively streaming code */}
            {streamingCode && (
              <div className={styles.codeBlock}>
                <div className={styles.codeHeader}>
                  <span>sql</span>
                  <div className={styles.codeActions}>
                    <button className={styles.codeAction}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M12 4V20M4 12H20" stroke="#666" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </button>
                    <button className={styles.codeAction}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M4 12H20M12 4L20 12L12 20" stroke="#666" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
                <pre className={styles.code}>{streamedCode}</pre>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
} 