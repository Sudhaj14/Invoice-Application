import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProfileDropdown = ({
  isOpen,
  onToggle,
  avatar,
  companyName,
  email,
  onLogout,
}) => {
  const navigate = useNavigate();

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        onClick={onToggle}
        className="flex items-center space-x-3 p-2 rounded-xl hover:bg-white/5 transition-all duration-300 group"
      >
        {avatar ? (
          <div className="relative">
            <div className="absolute -inset-0.5 bg-gradient-to-tr from-accent-purple to-accent-blue rounded-full blur opacity-30 group-hover:opacity-60 transition-opacity"></div>
            <img
              src={avatar}
              alt="Avatar"
              className="relative h-9 w-9 rounded-full object-cover border border-white/10"
            />
          </div>
        ) : (
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-tr from-accent-purple to-accent-blue rounded-full blur opacity-40 group-hover:opacity-70 transition-opacity"></div>
            <div className="relative h-9 w-9 rounded-full bg-background-elevated flex items-center justify-center border border-white/10">
              <span className="text-white font-black text-xs tracking-tighter">
                {companyName?.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        )}

        <div className="hidden sm:block text-left">
          <p className="text-sm font-bold text-white leading-tight">
            {companyName}
          </p>
          <p className="text-[10px] text-text-muted font-medium uppercase tracking-wider">
            {email}
          </p>
        </div>

        <ChevronDown className={`h-4 w-4 text-text-muted transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-64 glass-card rounded-2xl border border-white/10 py-3 z-50 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-300">
          
          <div className="px-5 py-4 border-b border-white/5 bg-white/2">
            <p className="text-sm font-black text-white truncate">
              {companyName}
            </p>
            <p className="text-[11px] text-text-secondary truncate mt-0.5 italic">
              {email}
            </p>
          </div>

          <div className="py-2">
            <button
              onClick={() => {
                navigate("/profile");
                onToggle();
              }}
              className="w-full text-left px-5 py-2.5 text-sm text-text-secondary hover:text-white hover:bg-white/5 transition-all duration-200 flex items-center gap-3 group"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-accent-blue group-hover:scale-125 transition-transform"></div>
              View Galactic Profile
            </button>
          </div>

          <div className="border-t border-white/5 mt-1 pt-2">
            <button
              onClick={onLogout}
              className="w-full text-left px-5 py-2.5 text-sm text-accent-pink hover:bg-accent-pink/10 transition-all duration-200 flex items-center gap-3 group"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-accent-pink group-hover:scale-125 transition-transform"></div>
              Terminate Session
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;