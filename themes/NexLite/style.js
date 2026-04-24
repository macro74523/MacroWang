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

    /* Video wrapper styles */
    .video-wrapper {
      position: relative;
      width: 100% !important;
      margin-bottom: 1rem;
    }

    .notion-carousel-wrapper {
      display: flex;
      overflow-x: auto;
      scroll-snap-type: x mandatory;
      scrollbar-width: none;
      width: 100% !important;
    }

    .notion-carousel-wrapper::-webkit-scrollbar {
      display: none;
    }

    .notion-carousel {
      flex: 0 0 100%;
      scroll-snap-align: start;
      display: none;
      width: 100% !important;
    }

    .notion-carousel.active {
      display: block;
      width: 100% !important;
    }

    .notion-carousel-route {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
      margin-top: 1rem;
    }

    .notion-carousel-route > div {
      cursor: pointer;
      padding: 0.25rem 0.75rem;
      background: #f3f4f6;
      border-radius: 0.25rem;
      font-size: 0.875rem;
    }

    .notion-carousel-route > div:hover {
      background: #e5e7eb;
    }

    .dark .notion-carousel-route > div {
      background: #374151;
      color: #f3f4f6;
    }

    .dark .notion-carousel-route > div:hover {
      background: #4b5563;
    }

    /* Video iframe responsive */
    .notion-asset-wrapper-video,
    .notion-asset-wrapper-embed {
      width: 100% !important;
      margin: 0 auto !important;
      max-width: 100% !important;
    }

    .notion-asset-wrapper-video video,
    .notion-asset-wrapper-video iframe,
    .notion-asset-wrapper-embed iframe {
      width: 100% !important;
      height: auto !important;
      aspect-ratio: 16 / 9 !important;
      object-fit: contain !important;
      min-height: 400px !important;
    }

    /* Notion asset wrapper video fix */
    figure.notion-asset-wrapper.notion-asset-wrapper-video {
      width: 100% !important;
      max-width: 100% !important;
    }

    figure.notion-asset-wrapper.notion-asset-wrapper-video > div {
      height: 0 !important;
      width: 100% !important;
      padding-bottom: 56.25% !important;
      position: relative !important;
      min-height: 400px !important;
    }

    figure.notion-asset-wrapper.notion-asset-wrapper-video video,
    figure.notion-asset-wrapper.notion-asset-wrapper-video iframe {
      position: absolute !important;
      top: 0 !important;
      left: 0 !important;
      width: 100% !important;
      height: 100% !important;
      object-fit: contain !important;
      min-height: 400px !important;
    }

    /* Embed wrapper fix */
    .notion-asset-wrapper-embed > div {
      width: 100% !important;
      height: auto !important;
      aspect-ratio: 16 / 9 !important;
      min-height: 400px !important;
    }

    .notion-asset-wrapper-embed iframe {
      width: 100% !important;
      height: 100% !important;
      object-fit: contain !important;
      min-height: 400px !important;
    }

    /* Notion page content fix */
    .notion-page-content {
      width: 100% !important;
    }

    .notion-page-content > div {
      width: 100% !important;
    }

    /* Hide Notion page cover */
    .notion-header {
      display: none !important;
    }

    .notion-cover {
      display: none !important;
    }

    .notion-cover-wrapper {
      display: none !important;
    }

    .notion-page-cover {
      display: none !important;
    }

    .notion-page-cover-wrapper {
      display: none !important;
    }

    .notion-page-header {
      display: none !important;
    }

    .notion-page-icon {
      display: none !important;
    }

    .notion-page-title {
      display: none !important;
    }

    .notion-header-content {
      display: none !important;
    }

    .notion-header-cover {
      display: none !important;
    }

    .notion-header-icon {
      display: none !important;
    }

    .notion-header-title {
      display: none !important;
    }

    .notion-hero {
      display: none !important;
    }

  `}</style>
}

export { Style }