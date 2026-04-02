import React from "react";
import { Link } from "react-router-dom";
import { Twitter, Github, Linkedin } from "lucide-react";

const FooterLink = ({ to, children }) => (
  <Link
    to={to}
    className="text-gray-400 hover:text-white transition-colors duration-300"
  >
    {children}
  </Link>
);

const SocialLink = ({ href, children }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="text-gray-400 hover:text-white transition-colors duration-300"
  >
    {children}
  </a>
);

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          
          {/* Brand */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">
              AI Invoice App
            </h2>
            <p className="text-gray-400 leading-relaxed">
              Smart invoice generation powered by AI. Create, manage and track
              invoices effortlessly.
            </p>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-base font-semibold mb-4 text-white">
              Company
            </h3>
            <ul className="space-y-2">
              <li>
                <FooterLink to="/about">About Us</FooterLink>
              </li>
              <li>
                <FooterLink to="/contact">Contact</FooterLink>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-base font-semibold mb-4 text-white">
              Legal
            </h3>
            <ul className="space-y-2">
              <li>
                <FooterLink to="/privacy">Privacy Policy</FooterLink>
              </li>
              <li>
                <FooterLink to="/terms">Terms of Service</FooterLink>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 py-8 mt-16">
          <div className="flex flex-col md:flex-row items-center justify-between">
            
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} AI Invoice App. All rights reserved.
            </p>

            <div className="flex space-x-6 mt-4 md:mt-0">
              <SocialLink href="#">
                <Twitter className="w-5 h-5" />
              </SocialLink>
              <SocialLink href="#">
                <Github className="w-5 h-5" />
              </SocialLink>
              <SocialLink href="#">
                <Linkedin className="w-5 h-5" />
              </SocialLink>
            </div>

          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
