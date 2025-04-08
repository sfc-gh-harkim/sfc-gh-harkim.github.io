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
    animate: false,
    removeMask: false
  });
  
  const [setupState, setSetupState] = useState({
    started: false,
    animate: false
  });

  useEffect(() => {
    // Make sure we're in client-side environment
    if (typeof window !== 'undefined') {
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
      
      // Apply removeMask animation after mainContent animation finishes
      // mainContent animation has 0.75s delay and 1.2s duration = 1.95s total
      setTimeout(() => {
        setIntroState(prev => ({
          ...prev,
          removeMask: true
        }));
      }, 1200); // Slightly longer than 1.95s to ensure smooth transition
    }
  }, []);

  const restartAnimation = () => {
    // Reset all states first
    setIntroState({
      started: false,
      animate: false,
      removeMask: false
    });
    
    setSetupState({
      started: false,
      animate: false
    });
    
    // Force a reflow before starting new animation
    requestAnimationFrame(() => {
      // Start both animations immediately without delay
      setIntroState({
        started: true,
        animate: true,
        removeMask: false
      });
      
      setSetupState({
        started: true,
        animate: true
      });
      
      // Apply removeMask animation after mainContent animation finishes
      setTimeout(() => {
        setIntroState(prev => ({
          ...prev,
          removeMask: true
        }));
      }, 1200); // Slightly longer than 1.95s
    });
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

      <main className={`${styles.mainContent} ${setupState.animate ? styles.animate : ''}`}>
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

        <div className={`${styles.searchContainer} ${introState.animate ? styles.animate : styles.animatedContent}`}>
          <div className={styles.animateMask}>
            <h1 className={styles.greeting}>
              <span className={styles.greetingPt1}>Good afternoon,&nbsp;</span> 
              <span className={styles.greetingPt2}>Jennifer.</span>
            </h1>
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