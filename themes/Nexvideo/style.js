const Style = () => {
  return <style jsx global>{`
    
    .nexvideo-gradient-bg {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .nexvideo-card {
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .nexvideo-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    }

    .dark .nexvideo-card:hover {
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2);
    }

    .nexvideo-gradient {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .nexvideo-gradient-text {
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

    .cover-gradient-overlay {
      background: linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.6) 100%);
    }

  `}</style>
}

export { Style }