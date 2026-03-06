import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import './Hero.css';

const Hero = () => {
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const buttonRef = useRef(null);
  const teluguTextRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();

    tl.fromTo(titleRef.current,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.5 }
    )
      .fromTo(subtitleRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }, "-=0.5"
      )
      .fromTo(teluguTextRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.8, ease: 'back.out(1.7)' }, "-=0.4"
      )
      .fromTo(buttonRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }, "-=0.2"
      );

    // Floating animation
    gsap.to('.hero-floating-element', {
      y: -20,
      rotation: 5,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      stagger: {
        each: 0.5,
        from: 'random'
      }
    });
  }, []);

  const scrollToRSVP = () => {
    const rsvpSection = document.getElementById('rsvp-section');
    if (rsvpSection) {
      rsvpSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="hero-section" ref={heroRef}>
      <div className="hero-overlay"></div>

      {/* Background with explicit style because it's in public folder */}
      <div className="hero-bg" style={{ backgroundImage: "url('/holi_background.png')" }}></div>

      <div className="hero-content">
        <h2 className="telugu-greeting text-gradient" ref={teluguTextRef}>హోలీ శుభాకాంక్షలు</h2>
        <h1 ref={titleRef}>You Are Invited to Celebrate Holi!</h1>
        <p className="subtitle" ref={subtitleRef}>Let’s celebrate colors, joy, and togetherness.</p>

        <button
          className="btn-primary join-btn"
          ref={buttonRef}
          onClick={scrollToRSVP}
        >
          Join the Celebration
        </button>
      </div>

      <div className="hero-floating-element color-splash splash-1"></div>
      <div className="hero-floating-element flower flower-1"></div>
      <div className="hero-floating-element flower flower-2"></div>
    </section>
  );
};

export default Hero;
