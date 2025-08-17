import { useForm, ValidationError } from '@formspree/react';

export default function ContactSection() {
  const [state, handleSubmit] = useForm("mrblaeww");

  return (
    <section id="contact" className="py-20 px-4 md:px-8">
      <div className="container mx-auto max-w-6xl section-card-no-hover">
        <h2 className="text-3xl font-bold mb-8 text-center">Get In Touch</h2>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left column with contact details */}
          <div className="md:w-1/2 flex flex-col justify-center">
            <p className="text-lg mb-4">
              Have a project in mind or just want to say hello? I'd love to hear from you. Fill out the form or reach out directly using the information below.
            </p>
            <ul className="space-y-4 text-sm mt-4">
              <li className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:atifhasan000000@gmail.com" className="hover:text-white transition duration-300">atifhasan000000@gmail.com</a>
              </li>
              <li className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href="tel:+8801754020488" className="hover:text-white transition duration-300">+8801754020488</a>
              </li>
              <li className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                </svg>
                <span>Khandar, <br />Bogura, Bangladesh</span>
              </li>
            </ul>
          </div>

          {/* Right column with the contact form */}
          <div className="md:w-1/2">
            {state.succeeded ? (
              <div className="bg-green-600/20 border border-green-500 rounded-lg p-6 text-center">
                <h3 className="text-xl font-semibold text-green-400 mb-2">Thank you!</h3>
                <p className="text-gray-300">Your message has been sent successfully. I'll get back to you soon!</p>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-2">Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    placeholder="Your Name" 
                    className="bg-gray-800 w-full p-3 rounded-lg border border-transparent focus:border-white focus:outline-none transition duration-300"
                    required
                  />
                  <ValidationError 
                    prefix="Name" 
                    field="name"
                    errors={state.errors}
                    className="text-red-400 text-sm mt-1"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    placeholder="Your Email" 
                    className="bg-gray-800 w-full p-3 rounded-lg border border-transparent focus:border-white focus:outline-none transition duration-300"
                    required
                  />
                  <ValidationError 
                    prefix="Email" 
                    field="email"
                    errors={state.errors}
                    className="text-red-400 text-sm mt-1"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-400 mb-2">Subject</label>
                  <input 
                    type="text" 
                    id="subject" 
                    name="subject" 
                    placeholder="Subject of your message" 
                    className="bg-gray-800 w-full p-3 rounded-lg border border-transparent focus:border-white focus:outline-none transition duration-300"
                    required
                  />
                  <ValidationError 
                    prefix="Subject" 
                    field="subject"
                    errors={state.errors}
                    className="text-red-400 text-sm mt-1"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-400 mb-2">Message</label>
                  <textarea 
                    id="message" 
                    name="message" 
                    rows={4} 
                    placeholder="Your Message" 
                    className="bg-gray-800 w-full p-3 rounded-lg border border-transparent focus:border-white focus:outline-none transition duration-300"
                    required
                  ></textarea>
                  <ValidationError 
                    prefix="Message" 
                    field="message"
                    errors={state.errors}
                    className="text-red-400 text-sm mt-1"
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={state.submitting}
                  className="w-full cta-button disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {state.submitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
