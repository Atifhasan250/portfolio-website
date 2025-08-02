import { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { SiGithub, SiLinkedin, SiX } from "react-icons/si";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertContactSchema, type InsertContact } from "@shared/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

export default function Contact() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertContact>({
    resolver: zodResolver(insertContactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const submitContactMutation = useMutation({
    mutationFn: async (data: InsertContact) => {
      const response = await apiRequest("POST", "/api/contacts", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Message Sent!",
        description: "Thank you for your message. I'll get back to you soon!",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/contacts"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertContact) => {
    submitContactMutation.mutate(data);
  };

  return (
    <section id="contact" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Get In Touch</h2>
          <div className="w-24 h-1 bg-portfolio-blue mx-auto rounded-full"></div>
          <p className="text-lg text-slate-600 mt-4 max-w-2xl mx-auto">
            I'm always open to discussing new opportunities and interesting projects. 
            Let's create something amazing together!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Let's Connect</h3>
              <p className="text-lg text-slate-600 mb-8">
                Whether you have a project in mind, want to collaborate, or just want to say hello, 
                I'd love to hear from you. Feel free to reach out using any of the methods below.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-portfolio-blue rounded-lg flex items-center justify-center">
                  <Mail className="text-white h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">Email</h4>
                  <a href="mailto:alex@example.com" className="text-portfolio-blue hover:text-blue-700">
                    alex@example.com
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-portfolio-blue rounded-lg flex items-center justify-center">
                  <Phone className="text-white h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">Phone</h4>
                  <a href="tel:+1234567890" className="text-portfolio-blue hover:text-blue-700">
                    +1 (234) 567-8900
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-portfolio-blue rounded-lg flex items-center justify-center">
                  <MapPin className="text-white h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900">Location</h4>
                  <span className="text-slate-600">San Francisco, CA</span>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="pt-8">
              <h4 className="font-semibold text-slate-900 mb-4">Follow Me</h4>
              <div className="flex space-x-4">
                <a 
                  href="https://github.com" 
                  className="w-12 h-12 bg-slate-600 hover:bg-slate-700 rounded-lg flex items-center justify-center transition-colors duration-200"
                >
                  <SiGithub className="text-white h-5 w-5" />
                </a>
                <a 
                  href="https://linkedin.com" 
                  className="w-12 h-12 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center justify-center transition-colors duration-200"
                >
                  <SiLinkedin className="text-white h-5 w-5" />
                </a>
                <a 
                  href="https://twitter.com" 
                  className="w-12 h-12 bg-sky-500 hover:bg-sky-600 rounded-lg flex items-center justify-center transition-colors duration-200"
                >
                  <SiX className="text-white h-5 w-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Send a Message</h3>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="your@email.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject</FormLabel>
                      <FormControl>
                        <Input placeholder="Project Inquiry" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea 
                          rows={5} 
                          placeholder="Tell me about your project..." 
                          className="resize-none"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full bg-portfolio-blue hover:bg-blue-700"
                  disabled={submitContactMutation.isPending}
                >
                  {submitContactMutation.isPending ? (
                    "Sending..."
                  ) : (
                    <>
                      Send Message
                      <Send className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
}
