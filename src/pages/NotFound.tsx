import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <>
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        .float {
          animation: float 6s ease-in-out infinite;
        }
        .leaf {
          background: linear-gradient(to bottom, #10b981, #059669);
          clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
        }
      `}</style>
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900">
        {/* Animated floating leaves for a "lost in the woods" vibe – now with a subtle glow for night mode */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 15 }).map((_, i) => (
            <div
              key={i}
              className={`absolute w-4 h-4 leaf rounded-full opacity-20 float shadow-lg shadow-green-500/20`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 6}s`,
                animationDuration: `${4 + Math.random() * 4}s`,
              }}
            />
          ))}
        </div>
        
        <div className="max-w-md mx-auto text-center px-6 relative z-10">
          {/* Illustration - Tree with a subtle glow */}
          <div className="mb-8">
            <svg
              className="mx-auto h-48 w-48 text-gray-300 drop-shadow-lg"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
              />
            </svg>
          </div>
          
          <h1 className="text-6xl font-black text-white mb-4 bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent drop-shadow-md">
            404
          </h1>
          <p className="text-2xl font-medium text-gray-300 mb-2">
            Oops! Lost in the woods?
          </p>
          <p className="text-lg text-gray-400 mb-8">
            The page you're looking for has wandered off into the unknown.
          </p>
          
          <a
            href="/"
            className="inline-block px-8 py-3 bg-emerald-600 text-white font-semibold rounded-lg shadow-lg shadow-emerald-500/25 hover:bg-emerald-700 transition duration-300 transform hover:scale-105"
          >
            Back to Safety (Home)
          </a>
        </div>
      </div>
    </>
  );
};

export default NotFound;