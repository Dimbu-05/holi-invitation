import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './RSVPForm.css';

gsap.registerPlugin(ScrollTrigger);

const RSVPForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        guests: 1,
        message: ''
    });
    const [status, setStatus] = useState({ type: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const formRef = useRef(null);
    const formContainerRef = useRef(null);

    useEffect(() => {
        gsap.fromTo(formContainerRef.current,
            { y: 50, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 1,
                scrollTrigger: {
                    trigger: formContainerRef.current,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                }
            }
        );
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatus({ type: '', message: '' });

        try {
            // Animation for submit button
            gsap.to(formRef.current.querySelector('button'), {
                scale: 0.9, duration: 0.1, yoyo: true, repeat: 1
            });

            const response = await axios.post('http://localhost:5000/api/rsvp', formData);
            
            setStatus({ type: 'success', message: 'Thank you for your RSVP! A confirmation email has been sent.' });
            setFormData({ name: '', email: '', guests: 1, message: '' });

            // Color splash animation on success
            const splash = document.createElement('div');
            splash.className = 'submit-splash';
            formRef.current.appendChild(splash);
            
            gsap.fromTo(splash, 
                { scale: 0, opacity: 1 }, 
                { scale: 5, opacity: 0, duration: 1.5, ease: 'power2.out', onComplete: () => splash.remove() }
            );

        } catch (error) {
            console.error('RSVP Error:', error);
            setStatus({ 
                type: 'error', 
                message: error.response?.data?.error || 'Failed to submit RSVP. Please try again later.' 
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section id="rsvp-section" className="rsvp-section" ref={formContainerRef}>
            <div className="rsvp-container glass-panel">
                <h2 className="text-gradient">RSVP</h2>
                <p className="rsvp-subtitle">Please let us know if you can make it!</p>

                <form className="rsvp-form" onSubmit={handleSubmit} ref={formRef}>
                    <div className="input-group">
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="Your Name"
                        />
                        <span className="input-highlight"></span>
                    </div>

                    <div className="input-group">
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="Your Email"
                        />
                        <span className="input-highlight"></span>
                    </div>

                    <div className="input-group">
                        <input
                            type="number"
                            name="guests"
                            min="1"
                            max="10"
                            value={formData.guests}
                            onChange={handleChange}
                            required
                            placeholder="Number of Guests"
                        />
                        <span className="input-highlight"></span>
                    </div>

                    <div className="input-group">
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="Any special requests or message for us?"
                            rows="4"
                        ></textarea>
                        <span className="input-highlight"></span>
                    </div>

                    {status.message && (
                        <div className={`status-message ${status.type}`}>
                            {status.message}
                        </div>
                    )}

                    <button type="submit" className="btn-primary submit-btn" disabled={isSubmitting}>
                        {isSubmitting ? 'Sending...' : 'Confirm Presence'}
                    </button>
                </form>
            </div>
        </section>
    );
};

export default RSVPForm;
