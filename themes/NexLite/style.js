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

    /* Logo 视频滤镜适配亮色模式 */
    :root:not(.dark) .hero-logo-video {
      filter: invert(0.9) contrast(1.5) saturate(1.3);
    }

    :root.dark .hero-logo-video {
      filter: contrast(1.2) saturate(1.2);
    }

  `}</style>
}

export { Style }