import { Target, Clock, MessageCircle, Shield, Mail, Key } from 'lucide-react';

export const authSlides = {
  login: [
    {
      icon: <Target className="w-12 h-12 text-accent" />,
      headline: "Achieve PMP Certification",
      text: "Join a community of thousands who have successfully passed their exam using our proven methods."
    },
    {
      icon: <Clock className="w-12 h-12 text-accent" />,
      headline: "Simulate the Real Exam",
      text: "Our timed mock exams and diverse question bank mirror the actual PMP test environment perfectly."
    },
    {
      icon: <MessageCircle className="w-12 h-12 text-accent" />,
      headline: "From a Certified Professional...",
      text: "The performance analytics were a game-changer. I knew exactly what to focus on. Passed on my first attempt! - Emily R., PMP"
    }
  ],
  signup: [
    {
      icon: <Target className="w-12 h-12 text-accent" />,
      headline: "Start Your PMP Journey",
      text: "Join thousands of project managers who have successfully passed their PMP exam with our proven methods."
    },
    {
      icon: <Clock className="w-12 h-12 text-accent" />,
      headline: "Free Sample Test",
      text: "Try our realistic exam simulator with 50 questions to experience the quality of our practice tests."
    },
    {
      icon: <MessageCircle className="w-12 h-12 text-accent" />,
      headline: "Expert Guidance",
      text: "Get detailed explanations for every question and personalized study recommendations based on your performance."
    }
  ],
  forgotPassword: [
    {
      icon: <Shield className="w-12 h-12 text-accent" />,
      headline: "Secure Password Reset",
      text: "We'll send you a secure link to reset your password. Your account security is our top priority."
    },
    {
      icon: <Mail className="w-12 h-12 text-accent" />,
      headline: "Quick & Easy Process",
      text: "Enter your email address and we'll send you a password reset link within minutes."
    },
    {
      icon: <Key className="w-12 h-12 text-accent" />,
      headline: "Back to Your Studies",
      text: "Get back to your PMP preparation quickly and securely with our streamlined password reset process."
    }
  ],
  resetPassword: [
    {
      icon: <Shield className="w-12 h-12 text-accent" />,
      headline: "Create New Password",
      text: "Choose a strong, secure password to protect your account and continue your PMP journey."
    },
    {
      icon: <Key className="w-12 h-12 text-accent" />,
      headline: "Security First",
      text: "Your new password will be encrypted and secure. We recommend using a combination of letters, numbers, and symbols."
    },
    {
      icon: <Target className="w-12 h-12 text-accent" />,
      headline: "Ready to Continue",
      text: "Once you've set your new password, you'll be back to your PMP studies in no time."
    }
  ]
};
