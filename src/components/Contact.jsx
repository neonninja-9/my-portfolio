import { useState, useCallback } from 'react';
import { Mail, MapPin } from 'lucide-react';
import { contactInfo } from '../data/socialLinks';
import { useScrollReveal } from '../hooks/useScrollReveal';
import GlowButton from './GlowButton';
import Loader from './Loader';
import ConnectIcons from './ui/ConnectIcons';
import './Contact.css';



export default function Contact() {
  const ref = useScrollReveal();
  const [formData, setFormData] = useState({ fullName: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | success | error

  const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: false }));
  }, []);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      const newErrors = {};

      if (!formData.fullName.trim()) newErrors.fullName = true;
      if (!validateEmail(formData.email)) newErrors.email = true;
      if (!formData.message.trim()) newErrors.message = true;

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        setStatus('error');
        return;
      }

      setStatus('sending');

      const submitData = new FormData();
      // Replace this string with your actual access key, or use a .env file!
      submitData.append("access_key", import.meta.env.VITE_WEB3FORMS_KEY || "YOUR_WEB3FORMS_ACCESS_KEY_HERE");
      submitData.append("name", formData.fullName);
      submitData.append("email", formData.email);
      submitData.append("message", formData.message);

      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: submitData
      })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setStatus('success');
          setFormData({ fullName: '', email: '', message: '' });
        } else {
          setStatus('error');
          console.error("Web3Forms Error:", res);
        }
        setTimeout(() => setStatus('idle'), 4000);
      })
      .catch((err) => {
        console.error("Submission failed:", err);
        setStatus('error');
        setTimeout(() => setStatus('idle'), 4000);
      });
    },
    [formData]
  );

  return (
    <section id="contact" className="contact section-container">
      <div className="contact__card glass-card reveal" ref={ref}>
        <div className="contact__info">
          <h2 className="contact__heading">
            Ready to code <br />
            something <span className="gradient-text-purple">impactful?</span>
          </h2>
          <p className="contact__desc">
            Whether it's discussing algorithms, open source, or a new project idea, I'm always
            open to connect.
          </p>

          <div className="contact__methods">
            <div className="contact__method">
              <div className="contact__method-icon">
                <Mail size={18} />
              </div>
              <div>
                <span className="contact__method-label">EMAIL</span>
                <span className="contact__method-value">{contactInfo.email}</span>
              </div>
            </div>
            <div className="contact__method">
              <div className="contact__method-icon">
                <MapPin size={18} />
              </div>
              <div>
                <span className="contact__method-label">LOCATION</span>
                <span className="contact__method-value">{contactInfo.location}</span>
              </div>
            </div>
          </div>

          <div className="contact__socials" style={{ marginTop: '1.5rem' }}>
            <ConnectIcons />
          </div>

        </div>

        <form className="contact__form" onSubmit={handleSubmit} noValidate>
          <div className="contact__form-row">
            <div className={`contact__form-group ${errors.fullName ? 'contact__form-group--error' : ''}`}>
              <label htmlFor="contact-name">Full Name</label>
              <input
                id="contact-name"
                type="text"
                name="fullName"
                placeholder="Your name"
                autoComplete="name"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>
            <div className={`contact__form-group ${errors.email ? 'contact__form-group--error' : ''}`}>
              <label htmlFor="contact-email">Email Address</label>
              <input
                id="contact-email"
                type="email"
                name="email"
                placeholder="Your email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className={`contact__form-group ${errors.message ? 'contact__form-group--error' : ''}`}>
            <label htmlFor="contact-message">Your Message</label>
            <textarea
              id="contact-message"
              name="message"
              placeholder="Tell me about your vision..."
              value={formData.message}
              onChange={handleChange}
              required
            />
          </div>

          {status === 'sending' ? (
            <Loader />
          ) : (
            <GlowButton status={status} />
          )}

          {status === 'error' && (
            <p className="contact__message contact__message--error" role="alert">
              Please fill in all fields with a valid email.
            </p>
          )}
          {status === 'success' && (
            <p className="contact__message contact__message--success" aria-live="polite">
              Thanks for reaching out! I'll get back to you soon.
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
