'use client';

import React, { useState, useEffect, Suspense, useRef, useCallback } from 'react';
import styles from './intelligence.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { AnimatedAvatar } from '../../components/AnimatedAvatar';

// Generic Streamer Component for text and code animation
interface GenericStreamerProps {
  content: string;
  speed?: number;
  isComplete?: boolean;
  isStreaming: boolean;
  onComplete?: () => void;
  contentType: 'text' | 'code';
}

const GenericStreamer: React.FC<GenericStreamerProps> = ({ 
  content, 
  speed = 20, 
  isComplete = false,
  isStreaming,
  onComplete,
  contentType
}) => {
  const [renderedItems, setRenderedItems] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [items, setItems] = useState<string[]>([]);
  const [hasCompleted, setHasCompleted] = useState(false);
  const [isInitialRender, setIsInitialRender] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const batchSize = useRef(5); // Number of items to process per batch
  const contentRef = useRef(content);
  
  // Function to scroll chat container to bottom during streaming
  const scrollDuringStream = useCallback(() => {
    requestAnimationFrame(() => {
      const chatContainer = document.querySelector(`.${styles.chatContainer}`);
      if (chatContainer) {
        // Check if user is near the bottom before auto-scrolling
        const isNearBottom = chatContainer.scrollHeight - chatContainer.scrollTop - chatContainer.clientHeight < 100;
        
        if (isNearBottom) {
          chatContainer.scrollTo({
            top: chatContainer.scrollHeight,
            behavior: 'smooth'
          });
        }
      }
    });
  }, []);
  
  // Track if content has changed
  useEffect(() => {
    if (content !== contentRef.current) {
      contentRef.current = content;
      setHasCompleted(false);
      setIsInitialRender(true);
    }
  }, [content]);
  
  // Split content into words or lines when it changes
  useEffect(() => {
    if (!content) return;
    
    // Split content differently based on type
    const itemsList = contentType === 'text' 
      ? content.match(/(\S+|\s+)/g) || [] // Split text by words but preserve spaces
      : content.split('\n'); // Split code by lines
    
    setItems(itemsList);
    
    // Reset streamer state when content changes
    if (isComplete) {
      setRenderedItems(itemsList);
      setCurrentIndex(itemsList.length);
      
      // Apply a delay before setting hasCompleted to allow for smooth transition
      setTimeout(() => {
        setHasCompleted(true);
        onComplete?.();
      }, 100);
    } else if (isInitialRender) {
      // Only reset on initial render of a new content
      setRenderedItems([]);
      setCurrentIndex(0);
      setIsInitialRender(false);
    }
  }, [content, isComplete, onComplete, contentType, isInitialRender]);
  
  // Handle streaming effect with improved chunking
  useEffect(() => {
    // If already completed streaming this exact content, don't restart
    if (hasCompleted) return;
    
    if (!isStreaming || currentIndex >= items.length) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      // Only mark as completed if we've reached the end of the content
      if (currentIndex >= items.length && items.length > 0) {
        setHasCompleted(true);
        onComplete?.();
      }
      return;
    }
    
    // Process words in small batches to ensure smooth streaming
    const processBatch = () => {
      const endIndex = Math.min(currentIndex + batchSize.current, items.length);
      const batch = items.slice(currentIndex, endIndex);
      
      setRenderedItems(prev => [...prev, ...batch]);
      setCurrentIndex(endIndex);
      
      // Scroll down after each batch is rendered
      scrollDuringStream();
      
      // Adjust batch size based on content length for optimal streaming
      if (items.length > 100) {
        const progress = currentIndex / items.length;
        // Start small, gradually increase, then decrease again near the end
        if (progress < 0.2) {
          batchSize.current = Math.max(1, Math.floor(items.length / 200));
        } else if (progress > 0.8) {
          batchSize.current = Math.max(1, Math.floor(items.length / 200));
        } else {
          batchSize.current = Math.max(2, Math.floor(items.length / 100));
        }
      }
    };
    
    timeoutRef.current = setTimeout(processBatch, 
      // Vary the speed slightly to make the animation feel more natural
      speed * (0.8 + Math.random() * 0.4)
    );
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [currentIndex, items, speed, isStreaming, onComplete, hasCompleted, scrollDuringStream]);
  
  // If we've already completed streaming, just render the entire content
  // But with a smooth opacity transition to avoid blinking
  const containerStyle = {
    transition: 'opacity 0.3s ease-in',
    opacity: 1
  };
  
  if (hasCompleted && !isInitialRender) {
    if (contentType === 'text') {
      return <div className={styles.streamedTextContainer} style={containerStyle}>{content}</div>;
    }
    return (
      <div className={styles.streamedCodeContainer} style={containerStyle}>
        {items.map((line, index) => (
          <div key={index}>{line}</div>
        ))}
      </div>
    );
  }
  
  if (contentType === 'text') {
    return (
      <div className={styles.streamedTextContainer} style={containerStyle}>
        {renderedItems.map((word, index) => (
          <span 
            key={index} 
            className={styles.streamedWord}
            style={{
              display: /^\s+$/.test(word) ? 'inline' : 'inline-block',
              color: 'inherit',
              animationDelay: `${Math.min(index * 5, 50)}ms` // Cap the delay for better performance
            }}
          >
            {word}
          </span>
        ))}
      </div>
    );
  }
  
  return (
    <div className={styles.streamedCodeContainer}>
      {renderedItems.map((line, index) => (
        <div 
          key={index} 
          className={styles.streamedLine}
          style={{
            animationDelay: `${Math.min(index * 3, 100)}ms` // Cap the delay for very long code
          }}
        >
          {line}
        </div>
      ))}
    </div>
  );
};

// Message Item Component
interface MessageItemProps {
  message: {
    type: string;
    text: string;
    id?: number;
  };
  lastMessageId: number | null;
  responseState: 'idle' | 'searching' | 'streaming' | 'complete';
}

const MessageItem: React.FC<MessageItemProps> = ({ message, lastMessageId, responseState }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  // Add smooth fade-in effect when message is rendered
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 10);
    return () => clearTimeout(timer);
  }, []);
  
  const messageStyle = {
    opacity: isVisible ? 1 : 0,
    transition: 'opacity 150ms ease-in'
  };
  
  if (message.type === 'user') {
    return (
      <div className={styles.userMessage} style={messageStyle}>
        <div className={`${styles.message} ${
          message.id === lastMessageId ? 
          `${styles.userMessageHighlighted} ${responseState === 'searching' ? styles.searching : ''}` : ''
        }`}>
          {message.text}
        </div>
      </div>
    );
  }

  if (message.type === 'ai') {
    return (
      <div className={styles.aiResponse} style={messageStyle}>
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
          <div className={styles.responseHeader}>
            <GenericStreamer 
              content={message.text.split('\n\n')[0]} 
              isStreaming={false}
              isComplete={true}
              speed={0}
              contentType="text"
            />
          </div>
          <div className={styles.responseText}>
            <GenericStreamer 
              content={message.text.split('\n\n')[1] || ''} 
              isStreaming={false}
              isComplete={true}
              speed={0}
              contentType="text"
            />
          </div>
        </div>
      </div>
    );
  }

  if (message.type === 'code') {
    return (
      <div className={styles.codeMessage} style={messageStyle}>
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
          <pre className={styles.code}>
            <GenericStreamer 
              content={message.text} 
              isStreaming={false}
              isComplete={true}
              speed={0}
              contentType="code"
            />
          </pre>
        </div>
      </div>
    );
  }

  return null;
};

// Active Response Component
interface ActiveResponseProps {
  responseState: 'idle' | 'searching' | 'streaming' | 'complete';
  streamedHeader: string;
  streamedText: string;
  avatarComplete: boolean;
}

const ActiveResponse: React.FC<ActiveResponseProps> = ({ 
  responseState, 
  streamedHeader, 
  streamedText, 
  avatarComplete 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  
  // Fade in the component when it first appears
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 10);
    return () => clearTimeout(timer);
  }, []);
  
  // Style for smooth fade transitions
  const containerStyle = {
    opacity: isVisible ? 1 : 0,
    transition: 'opacity 300ms ease-in-out',
  };
  
  if (responseState !== 'searching' && responseState !== 'streaming') return null;
  
  return (
    <div className={styles.aiResponse} style={containerStyle}>
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
          {responseState === 'streaming' && (
            <GenericStreamer 
              content={streamedHeader} 
              isStreaming={true} 
              isComplete={false}
              speed={40}
              contentType="text"
            />
          )}
        </div>
        {responseState === 'streaming' && (
          <div className={styles.responseText}>
            <GenericStreamer 
              content={streamedText} 
              isStreaming={true}
              isComplete={false}
              speed={20}
              contentType="text"
            />
          </div>
        )}
      </div>
    </div>
  );
};

// Streaming Code Component
interface StreamingCodeProps {
  streamingCode: boolean;
  streamedCode: string;
  codeComplete: boolean;
}

const StreamingCode: React.FC<StreamingCodeProps> = ({ 
  streamingCode, 
  streamedCode, 
  codeComplete 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  
  // Fade in the component when it first appears
  useEffect(() => {
    if (streamingCode) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 10);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [streamingCode]);
  
  // Style for smooth fade transitions
  const containerStyle = {
    opacity: isVisible ? 1 : 0,
    transition: 'opacity 300ms ease-in-out',
  };
  
  if (!streamingCode) return null;
  
  return (
    <div className={styles.codeMessage} style={containerStyle}>
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
        <pre className={styles.code}>
          <GenericStreamer 
            content={streamedCode} 
            isStreaming={streamingCode}
            isComplete={codeComplete}
            speed={10}
            contentType="code"
          />
        </pre>
      </div>
    </div>
  );
};

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
  const [responseState, setResponseState] = useState<'idle' | 'searching' | 'streaming' | 'complete'>('idle');
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

  // Improve the scrollToBottom function to be less aggressive and prevent layout thrashing
  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      const chatContainer = document.querySelector(`.${styles.chatContainer}`);
      if (chatContainer) {
        chatContainer.scrollTo({
          top: chatContainer.scrollHeight,
          behavior: 'smooth'
        });
      }
    });
  }, []);

  // Function to check if user is near bottom and should auto-scroll
  const shouldAutoScroll = useCallback(() => {
    const chatContainer = document.querySelector(`.${styles.chatContainer}`);
    if (chatContainer) {
      return chatContainer.scrollHeight - chatContainer.scrollTop - chatContainer.clientHeight < 150;
    }
    return true;
  }, []);

  const streamCode = (codeToStream: string, resultsToStream?: string) => {
    // Set the code to be streamed
    setStreamedCode(codeToStream);
    
    // Calculate estimated timing for animation
    const lineCount = codeToStream.split('\n').length;
    const codeAnimationTime = lineCount * 10 + 500; // Animation time plus buffer
    
    // Set up an interval to scroll down during code streaming
    const scrollingInterval = setInterval(() => {
      if (shouldAutoScroll()) {
        scrollToBottom();
      }
    }, 100);
    
    setTimeout(() => {
      // If there are results, add them to the code
      if (resultsToStream) {
        setStreamedCode(`${codeToStream}\n\n${resultsToStream}`);
        
        // Wait for results animation to complete
        const resultsLineCount = resultsToStream.split('\n').length;
        const totalAnimationTime = resultsLineCount * 10 + 500;
        
        setTimeout(() => {
          clearInterval(scrollingInterval);
          completeCodeStream(codeToStream, resultsToStream);
        }, totalAnimationTime);
      } else {
        // No results, just complete the code stream
        clearInterval(scrollingInterval);
        completeCodeStream(codeToStream);
      }
    }, codeAnimationTime);
  };
  
  // Helper function to finalize code streaming
  const completeCodeStream = (code: string, results?: string) => {
    const finalText = results ? `${code}\n\n${results}` : code;
    
    // Update all states 
    setStreamingCode(false);
    setCodeComplete(true);
    setAvatarComplete(true);
    setResponseState('idle');
    setStreamedHeader('');
    setStreamedText('');
    
    // Add code to messages list
    setMessages(prev => [...prev, { type: 'code', text: finalText }]);
    
    // Scroll chat to bottom
    scrollToBottom();
  };

  const handleSubmit = () => {
    // Disable submission if we're already processing a response
    if (!inputText.trim() || responseState === 'searching' || responseState === 'streaming' || streamingCode) return;
    
    // Add user message and reset input
    const newMessageId = Date.now();
    setMessages(prev => [...prev, { type: 'user', text: inputText, id: newMessageId }]);
    setLastMessageId(newMessageId);
    setInputText('');
    
    // Activate chat mode if not already active
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
    setAvatarComplete(false);
    
    // Reset animation key to force re-animation
    setBgAnimationKey(prev => prev + 1);
    
    // Select appropriate response
    const responseToUse = chatActive 
      ? databaseFactoids[Math.floor(Math.random() * databaseFactoids.length)]
      : mockResponse;
    
    // Set up auto-scrolling for the streaming response
    const scrollingInterval = setInterval(() => {
      if (shouldAutoScroll()) {
        scrollToBottom();
      }
    }, 100);
    
    // Show "Searching data sources..." for 3 seconds before streaming response
    setTimeout(() => {
      // Start streaming response
      setResponseState('streaming');
      setStreamedHeader(responseToUse.header);
      setLastMessageId(null); // Clear highlighting
      
      // Start body text after a delay
      setTimeout(() => {
        setStreamedText(responseToUse.text);
        const wordCount = responseToUse.text.split(/\s+/).length;
        const estimatedTime = Math.max(2000, wordCount * 15); // Ensure minimum time and increase time per word
        
        // Wait for text completion, then add to message history
        setTimeout(() => {
          // Add AI response to messages BEFORE changing the streaming state
          setMessages(prev => [
            ...prev, 
            { 
              type: 'ai', 
              text: `${responseToUse.header}\n\n${responseToUse.text}` 
            }
          ]);
          
          // Small delay before stopping the streaming animation
          // This prevents the blinking effect by ensuring the permanent message is rendered first
          setTimeout(() => {
            clearInterval(scrollingInterval); // Stop continuous scrolling
            setResponseState('complete');
            setAvatarComplete(true);
            
            // Small delay before starting code streaming to prevent browser layout thrashing
            setTimeout(() => {
              // Start code streaming
              setStreamingCode(true);
              if ('results' in responseToUse) {
                streamCode(responseToUse.code, responseToUse.results as string);
              } else {
                streamCode(responseToUse.code);
              }
              
              // Scroll to bottom after a small delay to ensure proper rendering
              setTimeout(scrollToBottom, 100);
            }, 300);
          }, 100);
        }, estimatedTime);
      }, 1000);
    }, 3000);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Prevent Enter key submission if we're already processing a response
    if (e.key === 'Enter' && !e.shiftKey) {
      if (responseState === 'searching' || responseState === 'streaming' || streamingCode) {
        e.preventDefault(); // Prevent default behavior but allow typing
        return;
      }
      e.preventDefault();
      handleSubmit();
    }
  };

  // Function to reset to home state
  const resetToHome = useCallback((e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    
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
  }, []);
  
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

  // Determine background class based on current state
  const getBackgroundClass = () => {
    if (responseState === 'searching') return styles.searchingBG;
    if (responseState === 'streaming') return styles.streamingBG;
    if (introState.animate) return styles.thinkingBGActive;
    return '';
  };

  return (
    <div className={styles.container}>
      {/* Secondary background layer */}
      <div 
        key={bgAnimationKey}
        className={`${styles.secondaryBackground} ${getBackgroundClass()}`} 
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
          onClick={resetToHome}
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
          onClick={resetToHome}
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
            onClick={resetToHome}
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
                
                <button 
                  className={styles.sendButton} 
                  onClick={handleSubmit}
                  disabled={responseState === 'searching' || responseState === 'streaming' || streamingCode}
                >
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
                <button 
                  className={styles.sendButton} 
                  onClick={handleSubmit}
                  disabled={responseState === 'searching' || responseState === 'streaming' || streamingCode}
                >
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
              <MessageItem key={index} message={message} lastMessageId={lastMessageId} responseState={responseState} />
            ))}
            
            {/* Show active response element (loading, streaming or code) */}
            {/* Only render if any of the active states are true */}
            {(responseState === 'searching' || responseState === 'streaming' || streamingCode) && (
              <>
                {/* Show searching or streaming response - these are mutually exclusive states */}
                {(responseState === 'searching' || responseState === 'streaming') && (
                  <ActiveResponse 
                    responseState={responseState} 
                    streamedHeader={streamedHeader} 
                    streamedText={streamedText} 
                    avatarComplete={avatarComplete}
                  />
                )}
                
                {/* Show actively streaming code */}
                {streamingCode && (
                  <StreamingCode 
                    streamingCode={streamingCode} 
                    streamedCode={streamedCode} 
                    codeComplete={codeComplete}
                  />
                )}
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
} 