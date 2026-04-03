/* eslint-disable react/no-unknown-property */
const Style = () => {
  return <style jsx global>{`
    
    .nexlite-gradient-bg {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .nexlite-card {
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .nexlite-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    }

    .dark .nexlite-card:hover {
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2);
    }

    .nexlite-gradient {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .nexlite-gradient-text {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    @keyframes shimmer {
      0% {
        background-position: -200% 0;
      }
      100% {
        background-position: 200% 0;
      }
    }

    .animate-shimmer {
      animation: shimmer 2s infinite;
    }

  `}</style>
}

export { Style }