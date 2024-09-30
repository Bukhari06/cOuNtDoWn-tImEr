'use client';

import React, { useState, useEffect } from 'react';
import styles from './CountdownTimer.module.css';

const CountdownTimer = () => {
  const [inputValue, setInputValue] = useState("");
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  
  
  const [audio] = useState(new Audio("/tick.mp3"));

  useEffect(() => {
    audio.volume = 1; 
    audio.onerror = () => {
      console.error('Error loading audio file');
    };
  }, [audio]);

  useEffect(() => {
    let countdown;

    if (isActive && !isPaused && seconds > 0) {
      countdown = setInterval(() => {
        audio.play().catch((error) => {
          console.error('Error playing sound:', error);
        });

        setSeconds(prevSeconds => {
          if (prevSeconds <= 1) {
            clearInterval(countdown);
            return 0;
          }
          return prevSeconds - 1;
        });
      }, 1000);
    } else if (seconds === 0 || isPaused) {
      if (countdown) {
        clearInterval(countdown);
      }
    }

    return () => {
      if (countdown) {
        clearInterval(countdown);
      }
    };
  }, [isActive, isPaused, seconds, audio]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const startCountdown = () => {
    const time = parseInt(inputValue, 10);
    if (!isNaN(time) && time > 0) {
      setSeconds(time);
      setIsActive(true);
      setIsPaused(false);
    }
  };

  const pauseCountdown = () => {
    setIsPaused(true);
  };

  const resumeCountdown = () => {
    setIsPaused(false);
  };

  const resetCountdown = () => {
    setIsActive(false);
    setIsPaused(false);
    setSeconds(0);
    setInputValue("");
  };

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.timerBox}>
        <div className={styles.header}>Start Your Time</div>
        <p>
          <input
            type="number"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Enter Duration"
            className={styles.inputField}
          />
        </p>
        <div className={styles.timerDisplay}>
          {formatTime(seconds)}
        </div>
        <div>
          <button onClick={startCountdown} className={styles.button}>Start</button>
          <button onClick={pauseCountdown} disabled={!isActive} className={styles.button}>Pause</button>
          <button onClick={resumeCountdown} disabled={!isPaused} className={styles.button}>Resume</button>
          <button onClick={resetCountdown} className={styles.button}>Reset</button>
          <div className={styles.header}>Created by: rUkHjBr</div>
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;
