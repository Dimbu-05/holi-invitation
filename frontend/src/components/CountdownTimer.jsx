import React, { useState, useEffect } from 'react';
import './CountdownTimer.css';

// Target date: Next Holi (adjust as needed, let's use a sample future date)
// Let's set it to some days from now to ensure it always shows something interesting.
// In reality, Holi is calculated by lunar calendar. Let's use March 14, 2026.
const TARGET_DATE = new Date('March 22, 2027 10:00:00').getTime();

const CountdownTimer = ({ onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [isCompleted, setIsCompleted] = useState(false);

  function calculateTimeLeft() {
    const difference = TARGET_DATE - new Date().getTime();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      const updatedTimeLeft = calculateTimeLeft();
      setTimeLeft(updatedTimeLeft);

      if (Object.keys(updatedTimeLeft).length === 0 && !isCompleted) {
        setIsCompleted(true);
        if (onComplete) onComplete();
      }
    }, 1000);

    return () => clearTimeout(timer);
  });

  const formatNumber = (num) => {
    return num < 10 ? `0${num}` : num;
  };

  if (isCompleted) {
    return (
      <div className="celebration-message text-gradient">
        Happy Holi! The Celebration Begins!
      </div>
    );
  }

  return (
    <div className="countdown-container">
      {Object.entries(timeLeft).map(([interval, num], index) => (
        <div className="countdown-item" key={interval}>
          <div className="countdown-number">{formatNumber(num)}</div>
          <div className="countdown-label">{interval.toUpperCase()}</div>
        </div>
      ))}
    </div>
  );
};

export default CountdownTimer;
