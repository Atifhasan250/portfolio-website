import { lazy, Suspense, type FormEvent, useEffect, useRef, useState } from 'react';
import { AlertCircle, CheckCircle2, MapPin } from 'lucide-react';
import FadeUpOnScroll from './FadeUpOnScroll';

const ContactMap = lazy(() => import('./contact-map'));

type FieldName = 'name' | 'email' | 'subject' | 'message';
type FieldErrors = Partial<Record<FieldName, string>>;

function MapPlaceholder() {
  return (
    <div
      className="flex h-[250px] items-center justify-center rounded-2xl border sm:h-[280px]"
      style={{ borderColor: 'var(--color-border-default)', backgroundColor: '#0c0e12' }}
      aria-label="Loading location map"
    >
      <MapPin className="h-5 w-5 opacity-35" aria-hidden="true" />
    </div>
  );
}

function DeferredContactMap() {
  const hostRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || shouldLoad) return;
    if (!('IntersectionObserver' in window)) {
      setShouldLoad(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShouldLoad(true);
        observer.disconnect();
      },
      { rootMargin: '400px 0px' },
    );

    observer.observe(host);
    return () => observer.disconnect();
  }, [shouldLoad]);

  return (
    <div ref={hostRef}>
      {shouldLoad ? (
        <Suspense fallback={<MapPlaceholder />}>
          <ContactMap />
        </Suspense>
      ) : (
        <MapPlaceholder />
      )}
    </div>
  );
}

export default function ContactSection() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  useEffect(() => {
    if (status !== 'success') return;

    const timeout = window.setTimeout(() => setStatus('idle'), 6000);
    return () => window.clearTimeout(timeout);
  }, [status]);

  const clearFieldError = (field: FieldName) => {
    setFieldErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    setStatus('submitting');
    setErrorMessage('');
    setFieldErrors({});

    const controller = new AbortController();
    const requestTimeout = window.setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.get('name'),
          email: formData.get('email'),
          subject: formData.get('subject'),
          message: formData.get('message'),
        }),
        signal: controller.signal,
      });
      const result = await response.json().catch(() => null);

      if (!response.ok) {
        if (response.status === 400 && Array.isArray(result?.errors)) {
          const nextErrors = result.errors.reduce((errors: FieldErrors, issue: { path?: unknown[]; message?: string }) => {
            const field = issue.path?.[0];
            if (typeof field === 'string' && ['name', 'email', 'subject', 'message'].includes(field)) {
              errors[field as FieldName] = issue.message || 'Please check this field.';
            }
            return errors;
          }, {});

          setFieldErrors(nextErrors);
          const firstInvalidField = Object.keys(nextErrors)[0];
          if (firstInvalidField) {
            const invalidControl = form.elements.namedItem(firstInvalidField);
            if (invalidControl instanceof HTMLElement) {
              invalidControl.focus();
              invalidControl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }
          throw new Error('Please check the highlighted fields and try again.');
        }

        throw new Error(result?.message || 'Your message could not be sent. Please try again.');
      }

      form.reset();
      setStatus('success');
    } catch (error) {
      const message = error instanceof DOMException && error.name === 'AbortError'
        ? 'The request took too long. Your message is still here - please try again.'
        : error instanceof TypeError
          ? 'Could not connect right now. Check your connection and try again.'
          : error instanceof Error
            ? error.message
            : 'Your message could not be sent. Please try again.';

      setErrorMessage(message);
      setStatus('error');
    } finally {
      window.clearTimeout(requestTimeout);
    }
  };

  const fieldErrorProps = (field: FieldName) => ({
    'aria-invalid': Boolean(fieldErrors[field]),
    'aria-describedby': fieldErrors[field] ? `${field}-error` : undefined,
    onChange: () => clearFieldError(field),
  });

  return (
    <section id="contact" className="py-20 px-4 md:px-8">
      <FadeUpOnScroll>
        <div className="container mx-auto max-w-6xl section-card-no-hover">
          <div className="flex justify-center w-full">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
              Get In Touch
            </h2>
          </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:items-start">
          {/* Left column with contact details */}
          <div className="flex w-full flex-col justify-center md:col-start-1 md:row-start-1">
            <p className="text-lg mb-4">
              Have a project in mind or just want to say hello? I'd love to hear from you. Fill out the form or reach out directly using the information below.
            </p>
            <ul className="space-y-4 text-sm mt-4">
              <li className="flex items-center break-all sm:break-normal">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:atifhasan000000@gmail.com" className="hover:opacity-80 transition duration-300">atifhasan000000@gmail.com</a>
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                </svg>
                <span>Bogura, Bangladesh</span>
              </li>
            </ul>

            {/* Social Links */}
            <div className="mt-8 flex flex-wrap justify-start gap-5">
              <a
                href="https://www.facebook.com/atifhasan250"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon social-icon-facebook transition-colors duration-300 text-2xl"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>

              <a
                href="https://www.instagram.com/_atif_hasan_/"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon social-icon-instagram transition-colors duration-300 text-2xl"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>

              <a
                href="https://www.linkedin.com/in/atifhasan250/"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon social-icon-linkedin transition-colors duration-300 text-2xl"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>

              <a
                href="https://github.com/atifhasan250"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon social-icon-github transition-colors duration-300 text-2xl"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Right column with the contact form */}
          <div className="w-full md:col-start-2 md:row-span-2 md:row-start-1">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    placeholder="Your Name" 
                    maxLength={100}
                    className="w-full p-3.5 rounded-2xl transition duration-300 aria-[invalid=true]:border-red-500/50"
                    required
                    {...fieldErrorProps('name')}
                  />
                  {fieldErrors.name && <p id="name-error" className="mt-1.5 text-sm text-red-400">{fieldErrors.name}</p>}
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    placeholder="Your Email" 
                    maxLength={254}
                    className="w-full p-3.5 rounded-2xl transition duration-300 aria-[invalid=true]:border-red-500/50"
                    required
                    {...fieldErrorProps('email')}
                  />
                  {fieldErrors.email && <p id="email-error" className="mt-1.5 text-sm text-red-400">{fieldErrors.email}</p>}
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-2">Subject</label>
                  <input 
                    type="text" 
                    id="subject" 
                    name="subject" 
                    placeholder="Subject of your message" 
                    maxLength={150}
                    className="w-full p-3.5 rounded-2xl transition duration-300 aria-[invalid=true]:border-red-500/50"
                    required
                    {...fieldErrorProps('subject')}
                  />
                  {fieldErrors.subject && <p id="subject-error" className="mt-1.5 text-sm text-red-400">{fieldErrors.subject}</p>}
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">Message</label>
                  <textarea 
                    id="message" 
                    name="message" 
                    rows={4} 
                    placeholder="Your Message" 
                    maxLength={5000}
                    className="w-full p-3.5 rounded-2xl transition duration-300 resize-y min-h-[140px] aria-[invalid=true]:border-red-500/50"
                    required
                    {...fieldErrorProps('message')}
                  ></textarea>
                  {fieldErrors.message && <p id="message-error" className="mt-1.5 text-sm text-red-400">{fieldErrors.message}</p>}
                </div>
                <button 
                  type="submit" 
                  disabled={status === 'submitting'}
                  className="w-full cta-button disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === 'submitting' ? 'Sending...' : 'Send Message'}
                </button>

                <div aria-live="polite" aria-atomic="true">
                  {status === 'success' && (
                    <div className="flex items-start gap-3 rounded-2xl border border-emerald-500/25 bg-emerald-500/[0.07] px-4 py-3 text-left">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" aria-hidden="true" />
                      <div>
                        <p className="text-sm font-semibold text-emerald-300">Message sent</p>
                        <p className="mt-0.5 text-sm opacity-70">Thanks for reaching out. I'll get back to you soon.</p>
                      </div>
                    </div>
                  )}
                  {status === 'error' && (
                    <div role="alert" className="flex items-start gap-3 rounded-2xl border border-red-500/25 bg-red-500/[0.06] px-4 py-3 text-left">
                      <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" aria-hidden="true" />
                      <div>
                        <p className="text-sm font-semibold text-red-300">Message not sent</p>
                        <p className="mt-0.5 text-sm opacity-70">{errorMessage}</p>
                      </div>
                    </div>
                  )}
                </div>
              </form>
          </div>
          <div className="w-full md:col-start-1 md:row-start-2" aria-label="Location">
            <DeferredContactMap />
          </div>
        </div>
        </div>
      </FadeUpOnScroll>
    </section>
  );
}
