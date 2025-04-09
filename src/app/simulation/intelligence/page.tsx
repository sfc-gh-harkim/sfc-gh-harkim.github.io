'use client';

import React, { useState, useEffect, Suspense } from 'react';
import styles from './intelligence.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatedAvatar } from '../../components/AnimatedAvatar';

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
  const [messages, setMessages] = useState<Array<{type: string; text: string; id?: number}>>([]);
  
  // Combine all response states into a single state
  const [responseState, setResponseState] = useState('idle'); // idle, searching, streaming, complete
  const [streamedText, setStreamedText] = useState('');
  const [streamedHeader, setStreamedHeader] = useState('');
  const [streamingCode, setStreamingCode] = useState(false);
  const [streamedCode, setStreamedCode] = useState('');
  const [codeComplete, setCodeComplete] = useState(false);
  
  // Unique key for animation resets
  const [bgAnimationKey, setBgAnimationKey] = useState(0);
  
  // Keep track of the last message ID for highlighting
  const [lastMessageId, setLastMessageId] = useState<number | null>(null);
  
  // Track animation completion for Avatar
  const [avatarComplete, setAvatarComplete] = useState(false);
  
  // Track response state changes for avatar animation
  useEffect(() => {
    if (responseState === 'searching') {
      // Reset avatar completion state at the start of searching
      setAvatarComplete(false);
    } else if (responseState === 'complete') {
      // Set avatar as complete when the response is done
      setAvatarComplete(true);
    }
    
    // Debug logging
    console.log('Response state changed:', responseState);
  }, [responseState]);
  
  // Update the messages array with received data once streaming is complete
  useEffect(() => {
    // Add completed responses to the message array
    if (responseState === 'idle' && streamedHeader && streamedText && !streamingCode && avatarComplete) {
      const fullText = `${streamedHeader}\n\n${streamedText}`;
      
      setMessages(prev => [...prev, { type: 'ai', text: fullText }]);
      
      // Reset streaming states
      setStreamedHeader('');
      setStreamedText('');
    }
  }, [responseState, streamedHeader, streamedText, streamingCode, avatarComplete]);
  
  // Define type for factoids
  interface Factoid {
    header: string;
    text: string;
    code: string;
    results?: string;
  }
  
  // Database factoids to display for subsequent submissions
  const databaseFactoids: Factoid[] = [
    {
      header: "Most Popular Arcade Games",
      text: "Tron leads our arcade popularity charts with 42% of total gameplay hours this month. Space Invaders ranks second at 18%, followed by Pac-Man (15%), Galaga (14%), and Donkey Kong (11%). Tron's light cycle mini-game is the most replayed segment across all arcade titles.",
      code: `SELECT 
  game_name, 
  ROUND(play_hours / SUM(play_hours) OVER() * 100, 1) AS percentage
FROM arcade_games
ORDER BY play_hours DESC
LIMIT 5;`,
      results: `+---------------+------------+
| game_name     | percentage |
+---------------+------------+
| Tron          | 42.0       |
| Space Invaders| 18.0       |
| Pac-Man       | 15.0       |
| Galaga        | 14.0       |
| Donkey Kong   | 11.0       |
+---------------+------------+
5 rows in set (0.03 sec)`
    },
    {
      header: "Player Points Leaderboard",
      text: "Our top player 'NeonRider' has accumulated 2.8 million points across all games, with 1.6 million from Tron alone. The average user has 78,450 points, while the median is closer to 34,200, indicating our point distribution is heavily influenced by our power players.",
      code: `-- Top players and their points distribution
SELECT 
  username, 
  total_points,
  tron_points,
  ROUND(tron_points / total_points * 100, 1) AS tron_percentage
FROM player_stats
ORDER BY total_points DESC
LIMIT 10;`,
      results: `+------------+-------------+------------+----------------+
| username   | total_points | tron_points | tron_percentage |
+------------+-------------+------------+----------------+
| NeonRider  | 2800000     | 1600000    | 57.1           |
| LightCycle | 1750000     | 1420000    | 81.1           |
| GridMaster | 1200000     | 980000     | 81.7           |
| QuarrTron  | 980000      | 760000     | 77.6           |
| PacKing    | 850000      | 120000     | 14.1           |
| GalagaGuru | 720000      | 95000      | 13.2           |
| ArcadeLegnd| 680000      | 310000     | 45.6           |
| ByteRunner | 640000      | 520000     | 81.3           |
| JoystickJoe| 560000      | 210000     | 37.5           |
| PixelPro   | 490000      | 280000     | 57.1           |
+------------+-------------+------------+----------------+
10 rows in set (0.05 sec)`
    },
    {
      header: "User Balance Analytics",
      text: "Average player balance is currently $23.45, with premium members maintaining approximately $58.20. Players spend an average of $12.30 per session, with Tron players spending 15% more than average. Weekend spending is 2.3x higher than weekday activity.",
      code: `-- Balance and spending patterns
WITH spending_data AS (
  SELECT 
    user_id,
    membership_type,
    current_balance,
    AVG(transaction_amount) AS avg_spend,
    MAX(CASE WHEN game_id = 'TRON' THEN transaction_amount ELSE 0 END) AS tron_spend
  FROM user_transactions
  GROUP BY user_id, membership_type, current_balance
)
SELECT 
  membership_type,
  AVG(current_balance) AS avg_balance,
  AVG(avg_spend) AS avg_transaction,
  AVG(tron_spend) / AVG(avg_spend) AS tron_spend_ratio
FROM spending_data
GROUP BY membership_type;`,
      results: `+----------------+-------------+----------------+------------------+
| membership_type | avg_balance | avg_transaction | tron_spend_ratio |
+----------------+-------------+----------------+------------------+
| standard        | 23.45       | 12.30          | 1.15             |
| premium         | 58.20       | 19.75          | 1.22             |
| gold            | 97.60       | 28.40          | 1.35             |
+----------------+-------------+----------------+------------------+
3 rows in set (0.08 sec)`
    },
    {
      header: "Engagement Metrics",
      text: "Players who start with Tron have 32% longer total session times and are 2.4x more likely to return within 48 hours. The average arcade session lasts 37 minutes, with power users averaging 1.8 hours per visit. Our most dedicated player has logged 246 hours this month.",
      code: `-- Session duration and retention analysis
SELECT 
  first_game_played,
  COUNT(DISTINCT user_id) AS unique_players,
  AVG(session_minutes) AS avg_session_length,
  SUM(CASE WHEN return_within_48h THEN 1 ELSE 0 END) / COUNT(*) AS return_rate
FROM player_sessions
GROUP BY first_game_played
ORDER BY avg_session_length DESC;`
    },
    {
      header: "Tron Popularity Trend",
      text: "Tron has seen a 27% increase in play time since our recent cabinet upgrade. The game accounts for 38% of all tokens spent in the arcade. Players who choose Tron as their first game spend an average of $6.20 more per visit and are 40% more likely to sign up for a premium membership.",
      code: `-- Tron popularity growth analysis
SELECT 
  month,
  SUM(CASE WHEN game_id = 'TRON' THEN play_hours ELSE 0 END) AS tron_hours,
  SUM(play_hours) AS total_hours,
  SUM(CASE WHEN game_id = 'TRON' THEN play_hours ELSE 0 END) / SUM(play_hours) AS tron_percentage,
  SUM(CASE WHEN game_id = 'TRON' THEN tokens_spent ELSE 0 END) / SUM(tokens_spent) AS token_share
FROM monthly_game_stats
WHERE month >= DATE_SUB(CURRENT_DATE(), INTERVAL 6 MONTH)
GROUP BY month
ORDER BY month;`
    }
  ];
  
  const mockResponse = {
    header: "Most Popular Arcade Games",
    text: "Tron leads our arcade popularity charts with 42% of total gameplay hours this month. Space Invaders ranks second at 18%, followed by Pac-Man (15%), Galaga (14%), and Donkey Kong (11%). Tron's light cycle mini-game is the most replayed segment across all arcade titles.",
    code: `SELECT 
  game_name, 
  ROUND(play_hours / SUM(play_hours) OVER() * 100, 1) AS percentage
FROM arcade_games
ORDER BY play_hours DESC
LIMIT 5;`,
    results: `+---------------+------------+
| game_name     | percentage |
+---------------+------------+
| Tron          | 42.0       |
| Space Invaders| 18.0       |
| Pac-Man       | 15.0       |
| Galaga        | 14.0       |
| Donkey Kong   | 11.0       |
+---------------+------------+
5 rows in set (0.03 sec)`
  };

  // Function to scroll chat container to bottom
  const scrollToBottom = () => {
    const chatContainer = document.querySelector(`.${styles.chatContainer}`);
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  };

  const streamCode = (codeToStream: string, resultsToStream?: string) => {
    let currentCode = '';
    const fullCode = codeToStream;
    const codeInterval = setInterval(() => {
      if (currentCode.length < fullCode.length) {
        currentCode = fullCode.substring(0, currentCode.length + 2);
        setStreamedCode(currentCode);
        scrollToBottom(); // Scroll as code is streamed
      } else {
        clearInterval(codeInterval);
        
        // If there are results, stream them after a brief pause
        if (resultsToStream) {
          setTimeout(() => {
            let currentResults = '';
            const resultsInterval = setInterval(() => {
              if (currentResults.length < resultsToStream.length) {
                currentResults = resultsToStream.substring(0, currentResults.length + 4);
                setStreamedCode(fullCode + '\n\n' + currentResults);
                scrollToBottom(); // Scroll as results are streamed
              } else {
                clearInterval(resultsInterval);
                setStreamingCode(false);
                setCodeComplete(true);
                setAvatarComplete(true); // Mark avatar animation as complete
                
                // Add complete code with results to messages list
                const fullCodeWithResults = fullCode + '\n\n' + resultsToStream;
                setMessages(prev => {
                  const newMessages = [...prev, { type: 'code', text: fullCodeWithResults }];
                  
                  // Schedule scroll to bottom on next render
                  setTimeout(scrollToBottom, 0);
                  
                  return newMessages;
                });
              }
            }, 5); // Faster streaming for results
          }, 300); // Pause before showing results
        } else {
          setStreamingCode(false);
          setCodeComplete(true);
          setAvatarComplete(true); // Mark avatar animation as complete
          
          // Add code to messages list
          setMessages(prev => {
            const newMessages = [...prev, { type: 'code', text: fullCode }];
            
            // Schedule scroll to bottom on next render
            setTimeout(scrollToBottom, 0);
            
            return newMessages;
          });
        }
      }
    }, 20);
  };

  const handleSubmit = () => {
    if (!inputText.trim()) return;
    
    // Add user message
    setMessages(prev => {
      // Use callback to ensure we're working with the latest state
      const newMessageId = Date.now(); // Generate a unique ID based on timestamp
      const newMessages = [...prev, { type: 'user', text: inputText, id: newMessageId }];
      
      // Store the ID of the last message for highlighting
      setLastMessageId(newMessageId);
      
      // Schedule scroll to bottom on next render after state update
      setTimeout(scrollToBottom, 0);
      
      return newMessages;
    });
    setInputText('');
    
    // Apply overflow-y scroll to container if not already active
    if (!chatActive) {
      setChatActive(true);
      document.querySelector(`.${styles.container}`)?.classList.add(styles.chatActiveContainer);
    }
    
    // Reset streaming states and start searching state
    setResponseState('searching');
    setStreamedHeader('');
    setStreamedText('');
    setStreamingCode(false);
    setCodeComplete(false);
    
    // Reset animation key to force re-animation
    setBgAnimationKey(prev => prev + 1);
    
    // Use a factoid if this is a subsequent submission (chat already active)
    const responseToUse = chatActive 
      ? databaseFactoids[Math.floor(Math.random() * databaseFactoids.length)]
      : mockResponse;
    
    // Show "Searching data sources..." for 3 seconds before streaming response
    setTimeout(() => {
      // Start transition to streaming state after searching is complete
      setResponseState('streaming');
      scrollToBottom(); // Scroll when searching message appears
      
      // First stream the header
      let currentHeader = '';
      const fullHeader = responseToUse.header;
      const headerInterval = setInterval(() => {
        if (currentHeader.length < fullHeader.length) {
          currentHeader = fullHeader.substring(0, currentHeader.length + 2);
          setStreamedHeader(currentHeader);
          scrollToBottom(); // Scroll as header is typed
        } else {
          clearInterval(headerInterval);
          
          // Clear the last message highlight when header is complete
          setLastMessageId(null);
          
          // Now stream the text after header is complete
          let currentText = '';
          const fullResponse = responseToUse.text;
          const textInterval = setInterval(() => {
            if (currentText.length < fullResponse.length) {
              currentText = fullResponse.substring(0, currentText.length + 3);
              setStreamedText(currentText);
              scrollToBottom(); // Scroll as response text is typed
            } else {
              clearInterval(textInterval);
              setResponseState('complete');
              setAvatarComplete(true); // Mark avatar animation as complete
              
              // Add AI response to messages
              setMessages(prev => {
                const newMessages = [...prev, { 
                  type: 'ai', 
                  text: `${fullHeader}\n\n${fullResponse}` 
                }];
                
                // Schedule scroll to bottom on next render
                setTimeout(scrollToBottom, 0);
                
                return newMessages;
              });
              
              // Always show the code block for any response
              setStreamingCode(true);
              // If the response has results, show them too
              if ('results' in responseToUse) {
                streamCode(responseToUse.code, responseToUse.results as string);
              } else {
                streamCode(responseToUse.code);
              }
              
              // Final scroll after everything is complete
              scrollToBottom();
            }
          }, 30);
        }
      }, 40); // Slightly faster header typing speed
    }, 3000); // 3 second delay to show searching state
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
    if (codeComplete) {
      console.log('Code completed');
    }
  }, [codeComplete]);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  // Scroll to bottom when response state changes
  useEffect(() => {
    if (responseState !== 'idle') {
      scrollToBottom();
    }
  }, [responseState]);

  // Determine container classes based on animation states
  const containerClasses = [styles.container];
  
  // Add gradient background class if in animation state
  if (introState.animate) {
    containerClasses.push(styles.thinkingBGActive);
  }

  return (
    <div className={styles.container}>
      {/* Secondary background layer */}
      <div 
        key={bgAnimationKey}
        className={`${styles.secondaryBackground} ${
          responseState === 'searching' ? styles.searchingBG : 
          responseState === 'streaming' ? styles.streamingBG : 
          introState.animate ? styles.thinkingBGActive : ''
        }`} 
      />
      
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
        <div className={styles.mobileLogo}
          onClick={(e) => {
            e.preventDefault();
            // Reset to resting state (after intro)
            setChatActive(false);
            setMessages([]);
            setInputText('');
            setResponseState('idle');
            setStreamedHeader('');
            setStreamedText('');
            setStreamingCode(false);
            setStreamedCode('');
            setCodeComplete(false);
            // Make sure intro animation is complete
            setIntroState({
              started: true,
              animate: true,
              removeMask: true
            });
            setSetupState({
              started: true,
              animate: true
            });
          }}
          style={{ cursor: 'pointer' }}
        >
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
        <div className={styles.logo}
          onClick={(e) => {
            e.preventDefault();
            // Reset to resting state (after intro)
            setChatActive(false);
            setMessages([]);
            setInputText('');
            setResponseState('idle');
            setStreamedHeader('');
            setStreamedText('');
            setStreamingCode(false);
            setStreamedCode('');
            setCodeComplete(false);
            // Make sure intro animation is complete
            setIntroState({
              started: true,
              animate: true,
              removeMask: true
            });
            setSetupState({
              started: true,
              animate: true
            });
          }}
          style={{ cursor: 'pointer' }}
        >
          <Image 
            src="/assets/intelligence/logo.svg"
            alt="Intelligence"
            width={24}
            height={24}
          />
          intelligence
        </div>

        <nav className={styles.nav}>
          <a 
            href="#" 
            className={styles.navItem}
            onClick={(e) => {
              e.preventDefault();
              // Reset to resting state (after intro)
              setChatActive(false);
              setMessages([]);
              setInputText('');
              setResponseState('idle');
              setStreamedHeader('');
              setStreamedText('');
              setStreamingCode(false);
              setStreamedCode('');
              setCodeComplete(false);
              // Make sure intro animation is complete
              setIntroState({
                started: true,
                animate: true,
                removeMask: true
              });
              setSetupState({
                started: true,
                animate: true
              });
            }}
          >
            <Image 
              src="/assets/intelligence/chats.svg"
              alt=""
              width={24}
              height={24}
            />
            Home
          </a>
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
              placeholder={chatActive ? "Ask follow-up" : "How may I assist you?"}
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
                  
                  {/* Add back later
                  <button className={styles.inputOptionItem}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2L4 14h16L12 2z" stroke="#666" strokeWidth="1.5"/>
                    </svg>
                    <span>3 Documents</span>
                  </button>
                  */}
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
                src="/assets/intelligence/arrow-hook.svg"
                alt=""
                width={24}
                height={24}
                className={styles.queryIcon}
              />
              Are there any leads I need to follow up with today?
            </button>
            <button className={styles.queryButton}>
              <Image 
                src="/assets/intelligence/arrow-hook.svg"
                alt=""
                width={24}
                height={24}
                className={styles.queryIcon}
              />
              What use cases have not been updated?
            </button>
            <button className={styles.queryButton}>
              <Image 
                src="/assets/intelligence/arrow-hook.svg"
                alt=""
                width={24}
                height={24}
                className={styles.queryIcon}
              />
              What&apos;s the email and phone number for the account?
            </button>
            <button className={styles.queryButton}>
              <Image 
                src="/assets/intelligence/arrow-hook.svg"
                alt=""
                width={24}
                height={24}
                className={styles.queryIcon}
              />
              Has this lead responded to any outreach recently?
            </button>
          </div>
        </div>
        

        
        {/* Chat Messages */}
        {chatActive && (
          <div className={styles.chatContainer}>
            {/* Display all previous messages in the conversation */}
            {messages.map((message, index) => (
              <div key={index} className={`${message.type === 'user' ? styles.userMessage : (message.type === 'code' ? styles.codeMessage : '')}`}>
                {message.type === 'user' && (
                  <div className={`${styles.message} ${
                    message.id === lastMessageId ? 
                    `${styles.userMessageHighlighted} ${responseState === 'searching' ? styles.searching : ''}` : ''
                  }`}>
                    {message.text}
                  </div>
                )}
                
                {message.type === 'ai' && (
                  <div className={styles.aiResponse}>
                    <div className={styles.responseIcon}>
                      <AnimatedAvatar
                        width={24}
                        height={24}
                        className={styles.avatar}
                        isPlaying={false}
                        isOutput={true}
                      />
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
            
            {/* Show active response element (loading, streaming or code) */}
            {/* Only render if any of the active states are true */}
            {(responseState === 'searching' || responseState === 'streaming' || streamingCode) && (
              <>
                {/* Show searching or streaming response - these are mutually exclusive states */}
                {(responseState === 'searching' || responseState === 'streaming') && (
                  <div className={styles.aiResponse}>
                    <div className={styles.responseIcon}>
                      <AnimatedAvatar
                        width={24}
                        height={24}
                        className={styles.avatar}
                        isPlaying={responseState === 'searching'}
                        isStopping={avatarComplete}
                        onComplete={() => {
                          console.log('Avatar animation completed');
                        }}
                      />
                    </div>
                    <div className={styles.responseContent}>
                      <div className={styles.responseHeader}>
                        {responseState === 'searching' && (
                          <span className={styles.shimmerText}>Searching data sources<span className={styles.ellipsis}></span></span>
                        )}
                        {responseState === 'streaming' && streamedHeader}
                      </div>
                      {responseState === 'streaming' && <div className={styles.responseText}>{streamedText}</div>}
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
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
} 