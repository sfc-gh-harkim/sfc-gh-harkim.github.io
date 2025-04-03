'use client';

import React, { useState, useEffect, Suspense } from 'react';
import styles from './intelligence.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

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
  const searchParams = useSearchParams();
  const isTestMode = searchParams.get('test') === '1';
  
  const [introState, setIntroState] = useState({
    started: false,
    animate: false
  });
  
  const [setupState, setSetupState] = useState({
    started: false,
    animate: false
  });

  useEffect(() => {
    // Make sure we're in client-side environment
    if (typeof window !== 'undefined') {
      // Start intro animation immediately
      setIntroState({
        started: true,
        animate: true
      });
      
      // Start setup animation after 2000ms (after intro completes)
      const setupTimeout = setTimeout(() => {
        // First fade out the intro background
        setIntroState({
          started: true,
          animate: false
        });
        
        // Then start the setup animation
        setTimeout(() => {
          setSetupState({
            started: true,
            animate: true
          });
        }, 500); // Wait for background to start fading out
      }, 2000);

      return () => {
        clearTimeout(setupTimeout);
      };
    }
  }, []);

  const restartAnimation = () => {
    // Reset animation states
    setIntroState({
      started: false,
      animate: false
    });
    
    setSetupState({
      started: false,
      animate: false
    });
    
    // Force a reflow and restart animations
    setTimeout(() => {
      setIntroState({
        started: true,
        animate: true
      });
      
      setTimeout(() => {
        setIntroState({
          started: true,
          animate: false
        });
        
        setTimeout(() => {
          setSetupState({
            started: true,
            animate: true
          });
        }, 500);
      }, 2000);
    }, 100);
  };

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

      <main className={`${styles.mainContent} ${setupState.animate ? styles.animate : styles.animatedContent}`}>
        <div className={styles.animateMask}>
          <h1 className={styles.greeting}><span className={styles.greetingPt1}>Good afternoon,</span> <span className={styles.greetingPt2}>Jennifer.</span></h1>
        </div>
        <div className={styles.animateMask}>
          <h2 className={styles.subtitle}>What insights are you looking for?</h2>
        </div>

        <div className={styles.inputContainer}>
          <textarea
            className={styles.input}
            placeholder="How may I assist you?"
          ></textarea>
          <button className={styles.micButton}>
            <Image 
              src="/assets/intelligence/mic.svg"
              alt="Microphone"
              width={24}
              height={24}
            />
          </button>
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
      </main>
      
      {isTestMode && (
        <button 
          className={styles.replayButton} 
          onClick={restartAnimation}
          aria-label="Replay animation"
        >
          ▶
        </button>
      )}
    </div>
  );
} 