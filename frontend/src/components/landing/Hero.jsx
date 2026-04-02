import { Link } from "react-router-dom";
import HERO_IMG from "../../assets/image.png";

const Hero = () => {
  const isAuthenticated = false;

  return (
    <section className="relative bg-[#fbfbfb] overflow-hidden">
      
      <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:60px_60px]"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        
        <div className="text-center max-w-4xl mx-auto">
          
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-blue-950">
            AI-Powered Invoicing, Made Effortless
          </h1>

          <p className="text-lg sm:text-xl text-gray-700 mb-8 leading-relaxed max-w-3xl mx-auto">
            Let our AI create invoices from simple text, generate payment reminders,
            and provide intelligent insights to grow your business.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            
            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="bg-gradient-to-r from-blue-950 to-blue-900 text-white px-8 py-4 rounded-md font-medium"
              >
                Go to Dashboard
              </Link>
            ) : (
              <Link
                to="/signup"
                className="bg-gradient-to-r from-blue-950 to-blue-900 text-white px-8 py-4 rounded-md font-medium"
              >
                Get Started for Free
              </Link>
            )}

            <a
              href="#features"
              className="border-2 border-black text-black px-8 py-4 rounded-md font-medium"
            >
              Learn More
            </a>

          </div>
        </div>

        <div className="mt-16 relative max-w-5xl mx-auto">
          <img
            src={HERO_IMG}
            alt="Invoice App Screenshot"
            className="rounded-xl shadow-2xl"
          />
        </div>

      </div>
    </section>
  );
};

export default Hero;
