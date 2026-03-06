import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CountdownTimer from './CountdownTimer';
import './InvitationCard.css';

gsap.registerPlugin(ScrollTrigger);

const InvitationCard = () => {
  const cardRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(cardRef.current,
      { y: 100, opacity: 0, scale: 0.9 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: cardRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  }, []);

  const scrollToRSVP = () => {
    const rsvpSection = document.getElementById('rsvp-section');
    if (rsvpSection) {
      rsvpSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="invitation-section">
      <div className="marigold-border top"></div>
      
      <div className="invitation-card glass-panel" ref={cardRef}>
        <div className="rangoli-corner top-left"></div>
        <div className="rangoli-corner top-right"></div>
        <div className="rangoli-corner bottom-left"></div>
        <div className="rangoli-corner bottom-right"></div>

        <div className="card-content">
          <h2 className="text-gradient">Join Us For</h2>
          <h1>The Festival of Colors</h1>
          
          <div className="event-details">
            <div className="detail-item">
              <span className="icon">📅</span>
              <p>March 14, 2026</p>
            </div>
            <div className="detail-item">
              <span className="icon">⏰</span>
              <p>10:00 AM Onwards</p>
            </div>
            <div className="detail-item">
              <span className="icon">📍</span>
              <p>Festivity Grounds, Hyderabad</p>
            </div>
          </div>

          <CountdownTimer />

          <button className="btn-primary" onClick={scrollToRSVP}>
            RSVP Now
          </button>
        </div>
      </div>
      
      <div className="marigold-border bottom"></div>
    </section>
  );
};

export default InvitationCard;
