/* eslint-disable @next/next/no-img-element */
import { siteConfig } from '@/lib/config'
import { useGlobal } from '@/lib/global'
import { isBrowser } from '@/lib/utils'
import SmartLink from '@/components/SmartLink'
import LazyImage from '@/components/LazyImage'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import { createContext, useContext, useEffect, useRef, useState } from 'react'
import CONFIG from './config'
import { Style } from './style'
import DarkModeButton from './components/DarkModeButton'

const Comment = dynamic(() => import('@/components/Comment'), { ssr: false })
const NotionPage = dynamic(() => import('@/components/NotionPage'))
const SearchModal = dynamic(() => import('@/components/AlgoliaSearchModal'), { ssr: false })

const ThemeGlobalNexlite = createContext()
export const useNexliteGlobal = () => useContext(ThemeGlobalNexlite)

const LayoutBase = props => {
  const { children, siteInfo } = props
  const searchModal = useRef(null)
  const { updateDarkMode } = useGlobal()

  useEffect(() => {
    const defaultAppearance = siteConfig('APPEARANCE', 'dark', CONFIG)
    const savedDarkMode = isBrowser && localStorage.getItem('darkMode')
    
    if (savedDarkMode === null) {
      updateDarkMode(defaultAppearance === 'dark')
      if (isBrowser) {
        document.getElementsByTagName('html')[0].classList.remove('light')
        document.getElementsByTagName('html')[0].classList.add('dark')
      }
    }
  }, [])

  return (
    <ThemeGlobalNexlite.Provider value={{ searchModal }}>
      <div
        id='theme-nexlite'
        className={`${siteConfig('FONT_STYLE')} min-h-screen flex flex-col dark:bg-zinc-900 bg-zinc-50`}>
        <Style />
        <SearchModal cRef={searchModal} {...props} />

        <Header {...props} />

        <main className='flex-1 w-full'>
          <div className='w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
            {children}
          </div>
        </main>

        <Footer {...props} />

        <BackToTop />
      </div>
    </ThemeGlobalNexlite.Provider>
  )
}

const LayoutIndex = props => {
  const { posts } = props
  const sortedPosts = [...(posts || [])].sort((a, b) => {
    const aDate = a.publishDate || a.createdAt || a.lastEditedAt
    const bDate = b.publishDate || b.createdAt || b.lastEditedAt
    return new Date(bDate) - new Date(aDate)
  })

  return (
    <>
      <Hero {...props} />
      <PostGrid posts={sortedPosts} {...props} />
      <PostGridDesktop posts={sortedPosts} {...props} />
    </>
  )
}

const LayoutPostList = props => {
  const { posts } = props
  const sortedPosts = [...(posts || [])].sort((a, b) => {
    const aDate = a.publishDate || a.createdAt || a.lastEditedAt
    const bDate = b.publishDate || b.createdAt || b.lastEditedAt
    return new Date(bDate) - new Date(aDate)
  })

  return (
    <>
      <PageHeader title='文章列表' />
      <PostGrid posts={sortedPosts} {...props} />
      <PostGridDesktop posts={sortedPosts} {...props} />
    </>
  )
}

const LayoutSlug = props => {
  const { post, siteInfo, lock, validPassword, recommendPosts } = props

  useEffect(() => {
    function combineVideo() {
      const notionArticle = document.querySelector('#article-wrapper #notion-article')
      if (!notionArticle) return

      const assetWrappers = document.querySelectorAll('.notion-asset-wrapper')
      if (!assetWrappers || assetWrappers.length === 0) return

      const exists = document.querySelectorAll('.video-wrapper')
      if (exists && exists.length > 0) return

      const videoWrappers = []
      const figCaptionValues = []

      assetWrappers.forEach((wrapper, index) => {
        const figCaption = wrapper.querySelector('figcaption')

        if (
          !wrapper.classList.contains('notion-asset-wrapper-video') &&
          !wrapper.classList.contains('notion-asset-wrapper-embed')
        )
          return

        if (!figCaption) return

        const figCaptionValue = figCaption?.textContent?.trim() || `P-${index}`
        figCaptionValues.push(figCaptionValue)
        videoWrappers.push(wrapper)
      })

      // 如果没有视频，不创建容器
      if (videoWrappers.length === 0) return

      const videoWrapper = document.createElement('div')
      videoWrapper.className = 'video-wrapper py-1 px-3 bg-gray-100 dark:bg-white dark:text-black mx-auto'

      const carouselWrapper = document.createElement('div')
      carouselWrapper.classList.add('notion-carousel-wrapper')

      videoWrappers.forEach((wrapper, index) => {
        const carouselItem = document.createElement('div')
        carouselItem.classList.add('notion-carousel')
        carouselItem.appendChild(wrapper)

        const iframe = wrapper.querySelector('iframe')
        const isBiliBili = iframe?.getAttribute('src')?.includes('bilibili.com') || 
                           iframe?.getAttribute('src')?.includes('player.bilibili')

        if (iframe) {
          iframe?.setAttribute('data-src', iframe?.getAttribute('src'))
        }

        if (index === 0) {
          carouselItem.classList.add('active')
        } else {
          // 哔哩哔哩视频不清空src，否则会导致播放问题
          if (!isBiliBili) {
            iframe?.setAttribute('src', '')
          }
        }

        carouselWrapper.appendChild(carouselItem)
      })

      const figCaptionWrapper = document.createElement('div')
      figCaptionWrapper.className = 'notion-carousel-route py-2 max-h-36 overflow-y-auto'

      figCaptionValues.forEach(value => {
        const div = document.createElement('div')
        div.textContent = value
        div.addEventListener('click', function () {
          document.querySelectorAll('.notion-carousel').forEach(item => {
            const iframe = item.querySelector('iframe')

            if (item.querySelector('figcaption').textContent.trim() === value) {
              item.classList.add('active')
              if (iframe) {
                iframe.setAttribute('src', iframe.getAttribute('data-src'))
              }
            } else {
              item.classList.remove('active')
              if (iframe) {
                iframe.setAttribute('src', '')
              }
            }
          })
        })
        figCaptionWrapper.appendChild(div)
      })

      videoWrapper.appendChild(carouselWrapper)

      if (figCaptionWrapper.children.length > 1) {
        videoWrapper.appendChild(figCaptionWrapper)
      }

      if (
        notionArticle.firstChild &&
        notionArticle.contains(notionArticle.firstChild)
      ) {
        notionArticle.insertBefore(videoWrapper, notionArticle.firstChild)
      } else {
        notionArticle.appendChild(videoWrapper)
      }
    }

    setTimeout(() => {
      combineVideo()
    }, 1500)

    return () => {
      const videoWrappers = document.querySelectorAll('.video-wrapper')
      videoWrappers.forEach(wrapper => {
        wrapper.parentNode.removeChild(wrapper)
      })
    }
  }, [post])

  if (lock) {
    return (
      <div className='max-w-4xl mx-auto'>
        <div className='bg-white dark:bg-zinc-800 rounded-2xl shadow-lg p-8 text-center'>
          <i className='fas fa-lock text-4xl text-zinc-400 mb-4'></i>
          <p className='text-zinc-600 dark:text-zinc-400'>此文章已加密，请输入密码查看</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {!lock && post && (
        <div id='article-wrapper' className='max-w-4xl mx-auto'>
          {/* 文章主体 */}
          <div className='w-full'>
            {/* 视频区域 */}
            <div className='mb-6'>
              <div id='notion-article' className='notion-page-content'>
                <NotionPage post={post} />
              </div>
            </div>

            {/* 文章信息 */}
            <div className='bg-white dark:bg-zinc-800 rounded-2xl shadow-lg p-6 mb-6'>
              <h1 className='text-2xl sm:text-3xl lg:text-4xl font-bold text-zinc-800 dark:text-white mb-4'>
                {post?.title}
              </h1>
              <PostMeta post={post} />
            </div>

            {/* 推荐文章 */}
            {recommendPosts && recommendPosts.length > 0 && (
              <div className='bg-white dark:bg-zinc-800 rounded-2xl shadow-lg p-6 mb-6'>
                <h2 className='text-xl font-bold text-zinc-800 dark:text-white mb-4'>
                  推荐阅读
                </h2>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                  {recommendPosts.slice(0, 4).map((recommendPost, index) => (
                    <SmartLink
                      key={index}
                      href={recommendPost.href}
                      className='block p-4 border border-zinc-200 dark:border-zinc-700 rounded-lg hover:shadow-md transition-shadow'
                    >
                      <h3 className='font-medium text-zinc-800 dark:text-white mb-2 line-clamp-2'>
                        {recommendPost.title}
                      </h3>
                      <p className='text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2'>
                        {recommendPost.summary || '...'}
                      </p>
                    </SmartLink>
                  ))}
                </div>
              </div>
            )}

            {/* 评论区 */}
            <div className='bg-white dark:bg-zinc-800 rounded-2xl shadow-lg p-6'>
              <h2 className='text-xl font-bold text-zinc-800 dark:text-white mb-4'>
                评论
              </h2>
              <Comment post={post} />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

const LayoutSearch = props => {
  const { posts: allPosts, keyword: propsKeyword } = props
  const router = useRouter()
  const keyword = router.query.keyword || router.query.s || propsKeyword || ''
  const [searchTerm, setSearchTerm] = useState(keyword)

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      router.push(`/search/${encodeURIComponent(searchTerm.trim())}`)
    }
  }

  // 客户端实时过滤
  const filteredPosts = allPosts?.filter(post => {
    if (!searchTerm.trim()) return true
    const tagContent = post?.tags && Array.isArray(post?.tags) ? post?.tags.join(' ') : ''
    const categoryContent = post.category && Array.isArray(post.category) ? post.category.join(' ') : ''
    const searchContent =
      post.title + (post.summary || '') + tagContent + categoryContent
    return searchContent.toLowerCase().includes(searchTerm.toLowerCase())
  }) || []

  return (
    <>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-zinc-800 dark:text-white mb-6'>
          搜索结果
        </h1>
        
        <form onSubmit={handleSearch} className='mb-8'>
          <div className='flex gap-2'>
            <input
              type='text'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder='输入关键词搜索...'
              className='flex-1 px-4 py-3 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent text-zinc-800 dark:text-white'
            />
            <button
              type='submit'
              className='px-6 py-3 bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition-colors font-medium'>
              <i className='fas fa-search mr-2'></i>
              搜索
            </button>
          </div>
        </form>

        {searchTerm && (
          <div className='flex items-center gap-2 text-zinc-500 dark:text-zinc-400'>
            <i className='fas fa-search'></i>
            <span>关键词：{searchTerm}</span>
            {filteredPosts.length > 0 && (
              <span className='ml-auto'>
                找到 {filteredPosts.length} 篇相关文章
              </span>
            )}
          </div>
        )}
      </div>
      
      {filteredPosts.length > 0 ? (
        <>
          <PostGrid posts={filteredPosts} {...props} />
          <PostGridDesktop posts={filteredPosts} {...props} />
        </>
      ) : (
        <div className='text-center py-20'>
          <div className='text-8xl mb-6'>
            <i className='fas fa-search text-zinc-200 dark:text-zinc-700'></i>
          </div>
          <h3 className='text-2xl font-bold text-zinc-700 dark:text-zinc-300 mb-3'>
            {searchTerm ? '没有找到相关内容' : '请输入关键词进行搜索'}
          </h3>
          <p className='text-zinc-500 dark:text-zinc-500 mb-8 max-w-md mx-auto'>
            {searchTerm ? `没有找到与「${searchTerm}」相关的文章，请尝试其他关键词` : '在上方输入框中输入关键词，搜索您感兴趣的内容'}
          </p>
          <div className='flex flex-col sm:flex-row items-center justify-center gap-4'>
            <SmartLink
              href='/'
              className='px-6 py-3 bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition-colors font-medium'>
              <i className='fas fa-home mr-2'></i>
              返回首页
            </SmartLink>
            {searchTerm && (
              <button
                onClick={() => window.history.back()}
                className='px-6 py-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors font-medium'>
                <i className='fas fa-arrow-left mr-2'></i>
                返回上一页
              </button>
            )}
          </div>
        </div>
      )}
    </>
  )
}

const LayoutArchive = props => {
  const { posts } = props
  const sortedPosts = [...(posts || [])].sort((a, b) => {
    const aDate = a.publishDate || a.createdAt || a.lastEditedAt
    const bDate = b.publishDate || b.createdAt || b.lastEditedAt
    return new Date(bDate) - new Date(aDate)
  })

  const postsByYear = {}
  sortedPosts.forEach(post => {
    const year = new Date(post.publishDate || post.createdAt || post.lastEditedAt).getFullYear()
    if (!postsByYear[year]) {
      postsByYear[year] = []
    }
    postsByYear[year].push(post)
  })

  return (
    <>
      <PageHeader title='文章归档' />
      <div className='space-y-8'>
        {Object.entries(postsByYear)
          .sort(([a], [b]) => b - a)
          .map(([year, posts]) => (
            <div key={year}>
              <h2 className='text-2xl font-bold text-zinc-800 dark:text-white mb-4 flex items-center gap-2'>
                <i className='fas fa-calendar-alt text-violet-500'></i>
                {year}
                <span className='text-sm font-normal text-zinc-400 dark:text-zinc-500'>
                  ({posts.length} 篇)
                </span>
              </h2>
              <div className='columns-1 sm:columns-2 lg:columns-3 gap-3 space-y-3'>
                {posts.map(post => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </div>
          ))}
      </div>
    </>
  )
}

const LayoutCategoryIndex = props => {
  const { categoryOptions } = props

  return (
    <>
      <PageHeader title='分类目录' />
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
        {categoryOptions?.map(category => (
          <CategoryCard key={category.name} category={category} />
        ))}
      </div>
    </>
  )
}

const LayoutTagIndex = props => {
  const { tagOptions } = props

  return (
    <>
      <PageHeader title='标签云' />
      <div className='flex flex-wrap gap-3'>
        {tagOptions?.map(tag => (
          <TagCard key={tag.name} tag={tag} />
        ))}
      </div>
    </>
  )
}

const Layout404 = props => {
  return (
    <div className='flex flex-col items-center justify-center min-h-[60vh] text-center'>
      <div className='text-8xl font-bold text-zinc-200 dark:text-zinc-800 mb-4'>
        404
      </div>
      <h1 className='text-3xl font-bold text-zinc-800 dark:text-white mb-4'>
        页面未找到
      </h1>
      <p className='text-lg text-zinc-500 dark:text-zinc-400 mb-8'>
        抱歉，您访问的页面不存在
      </p>
      <SmartLink
        href='/'
        className='px-8 py-3 bg-violet-500 text-white rounded-xl hover:bg-violet-600 transition-colors text-lg font-medium'>
        返回首页
      </SmartLink>
    </div>
  )
}

const Header = props => {
  const { siteInfo } = props
  const { searchModal } = useNexliteGlobal()
  const router = useRouter()

  const handleSearch = () => {
    if (siteConfig('ALGOLIA_APP_ID')) {
      searchModal?.current?.openSearch()
    } else {
      router.push('/search')
    }
  }

  return (
    <header className='sticky top-0 z-50 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-16'>
          <SmartLink
            href='/'
            className='flex items-center gap-3'>
            {siteInfo?.icon ? (
              <img
                src={siteInfo.icon}
                alt='logo'
                className='w-10 h-10 rounded-xl'
              />
            ) : (
              <div className='w-10 h-10 rounded-xl nexlite-gradient flex items-center justify-center'>
                <i className='fas fa-play text-white text-lg'></i>
              </div>
            )}
          </SmartLink>

          <div className='flex items-center gap-4'>
            <nav className='hidden md:flex items-center gap-4'>
              <NavLink href='/' label='首页' icon='fas fa-home' />
              <NavLink href='/category' label='分类' icon='fas fa-folder' />
              <NavLink href='/tag' label='标签' icon='fas fa-tags' />
              <NavLink href='/archive' label='归档' icon='fas fa-archive' />
              <button
                onClick={handleSearch}
                className='p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors'>
                <i className='fas fa-search text-zinc-600 dark:text-zinc-400'></i>
              </button>
              <DarkModeButton />
            </nav>

            <div className='flex items-center gap-2 md:hidden'>
              <button
                onClick={handleSearch}
                className='p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors'>
                <i className='fas fa-search text-zinc-600 dark:text-zinc-400'></i>
              </button>
              <DarkModeButton />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

const NavLink = ({ href, label, icon }) => {
  const router = useRouter()
  const isActive = router.pathname === href || router.asPath.startsWith(href)

  return (
    <SmartLink
      href={href}
      className={`flex items-center justify-center w-10 h-10 rounded-lg transition-colors
        ${isActive 
          ? 'bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400' 
          : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white'
        }`}
      title={label}>
      {icon && <i className={`${icon} text-lg`}></i>}
    </SmartLink>
  )
}

const Hero = ({ siteInfo }) => {
  const videoRef = useRef(null)

  const handleVideoEnd = () => {
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = videoRef.current.duration
    }
  }

  return (
    <section className='mb-12 text-center'>
      <div className='max-w-3xl mx-auto'>
        <div className='flex justify-center mb-6'>
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className='h-32 sm:h-40 w-auto object-contain hero-logo-video'
            onEnded={handleVideoEnd}
            onError={(e) => {
              console.log('Video load error:', e)
            }}>
            <source src='/videos/macro.webm' type='video/webm' />
          </video>
        </div>
        <p className='text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto'>
          {siteInfo?.description}
        </p>
      </div>
    </section>
  )
}

const PageHeader = ({ title }) => {
  return (
    <div className='mb-12 text-center'>
      <h1 className='text-3xl sm:text-4xl font-bold text-zinc-800 dark:text-white mb-4'>
        {title}
      </h1>
    </div>
  )
}

const PostGrid = ({ posts }) => {
  return (
    <div className='columns-2 md:hidden gap-3 space-y-3'>
      {posts?.map(post => (
        <PostCard key={post.id} post={post} className='break-inside-avoid' />
      ))}
    </div>
  )
}

const PostGridDesktop = ({ posts }) => {
  return (
    <div className='hidden md:grid grid-cols-4 gap-4'>
      {posts?.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  )
}

const PostCard = ({ post, className = '' }) => {
  const title = post.title
  const cover = post.pageCoverThumbnail || post.pageCover
  const [isHovered, setIsHovered] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [mobileAspectRatio, setMobileAspectRatio] = useState('aspect-[4/3]')

  useEffect(() => {
    if (cover && !imageError) {
      let mounted = true
      const img = new Image()
      
      img.onload = () => {
        if (!mounted) return
        const ratio = img.width / img.height
        if (ratio > 1) {
          setMobileAspectRatio('aspect-[4/3]')
        } else {
          setMobileAspectRatio('aspect-[3/4]')
        }
      }
      
      img.onerror = () => {
        if (mounted) {
          setMobileAspectRatio('aspect-[4/3]')
        }
      }
      
      img.src = cover
      
      return () => {
        mounted = false
        img.onload = null
        img.onerror = null
      }
    }
  }, [cover, imageError])

  const handleImageError = () => {
    setImageError(true)
    setImageLoaded(true)
  }

  return (
    <article className={`${className} bg-white dark:bg-zinc-900 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 group`}>
      <SmartLink 
        href={post.href} 
        title={title} 
        className='block'
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}>
        
        <div className={`relative sm:aspect-[3/4] ${mobileAspectRatio} overflow-hidden bg-zinc-100 dark:bg-zinc-800`}>
          {cover && !imageError ? (
            <>
              {!imageLoaded && (
                <div className='absolute inset-0 overflow-hidden'>
                  <div className='absolute inset-0 bg-gradient-to-r from-zinc-200 via-zinc-100 to-zinc-200 dark:from-zinc-700 dark:via-zinc-600 dark:to-zinc-700 animate-shimmer' 
                    style={{ backgroundSize: '200% 100%' }} />
                </div>
              )}
              <div className={`absolute inset-0 transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}>
                <LazyImage
                  src={cover}
                  alt={title}
                  className={`w-full h-full object-cover transition-all duration-500 ${isHovered ? 'scale-105' : 'scale-100'}`}
                  fill='full'
                  onLoad={() => setImageLoaded(true)}
                  onError={handleImageError}
                />
              </div>
            </>
          ) : (
            <div className='absolute inset-0 nexlite-gradient-bg flex items-center justify-center'>
              <i className='fas fa-image text-3xl text-white/30'></i>
            </div>
          )}
        </div>

        <div className='p-3'>
          <h3 className='text-sm font-medium text-zinc-800 dark:text-zinc-100 line-clamp-2 group-hover:text-violet-500 dark:group-hover:text-violet-400 transition-colors leading-snug'>
            {title}
          </h3>
        </div>
      </SmartLink>
    </article>
  )
}

const CategoryCard = ({ category }) => {
  return (
    <SmartLink
      href={`/category/${category.name}`}
      className='nexlite-card block bg-white dark:bg-zinc-800 rounded-2xl overflow-hidden shadow-md hover:shadow-xl p-6 text-center'>
      <div className='w-16 h-16 mx-auto mb-4 rounded-2xl nexlite-gradient flex items-center justify-center'>
        <i className='fas fa-folder text-white text-2xl'></i>
      </div>
      <h3 className='text-xl font-bold text-zinc-800 dark:text-white mb-2'>
        {category.name}
      </h3>
      <p className='text-sm text-zinc-500 dark:text-zinc-400'>
        {category.count} 篇文章
      </p>
    </SmartLink>
  )
}

const TagCard = ({ tag }) => {
  return (
    <SmartLink
      href={`/tag/${encodeURIComponent(tag.name)}`}
      className='nexlite-card inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-800 rounded-full shadow-sm hover:shadow-md text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-violet-500 dark:hover:text-violet-400 transition-colors'>
      <i className='fas fa-hashtag text-violet-500'></i>
      {tag.name}
      {tag.count && (
        <span className='text-xs text-zinc-400 dark:text-zinc-500'>
          ·{tag.count}
        </span>
      )}
    </SmartLink>
  )
}

const PostMeta = ({ post }) => {
  return (
    <div className='flex flex-wrap items-center gap-4 text-sm text-zinc-500 dark:text-zinc-400'>
      {post?.publishDay && (
        <div className='flex items-center gap-2'>
          <i className='far fa-calendar'></i>
          <span>{post.publishDay}</span>
        </div>
      )}
      {post?.category && (
        <div className='flex items-center gap-2'>
          <i className='fas fa-folder'></i>
          <SmartLink
            href={`/category/${post.category}`}
            className='hover:text-violet-500 transition-colors'>
            {post.category}
          </SmartLink>
        </div>
      )}
      {post?.tags && post.tags.length > 0 && (
        <div className='flex items-center gap-2 flex-wrap'>
          <i className='fas fa-tags'></i>
          {post.tags.slice(0, 3).map((tag, index) => (
            <SmartLink
              key={index}
              href={`/tag/${encodeURIComponent(tag)}`}
              className='hover:text-violet-500 transition-colors'>
              #{tag}
            </SmartLink>
          ))}
        </div>
      )}
    </div>
  )
}

const Footer = ({ siteInfo }) => {
  return (
    <footer className='bg-white dark:bg-zinc-800 border-t border-zinc-200 dark:border-zinc-700 py-8'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
        <p className='text-zinc-600 dark:text-zinc-400'>
          © {new Date().getFullYear()} {siteInfo?.title}. All rights reserved.
        </p>
        <p className='text-sm text-zinc-400 dark:text-zinc-500 mt-2'>
          Powered by NexLite theme
        </p>
      </div>
    </footer>
  )
}

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-8 right-8 w-10 h-10 rounded-full bg-white/80 dark:bg-zinc-800/80 text-zinc-500 dark:text-zinc-400 shadow-sm hover:bg-white dark:hover:bg-zinc-700 hover:text-zinc-600 dark:hover:text-zinc-300 transition-all duration-300 flex items-center justify-center backdrop-blur-sm ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
      }`}>
      <i className='fas fa-chevron-up text-sm'></i>
    </button>
  )
}

export {
  Layout404,
  LayoutArchive,
  LayoutBase,
  LayoutCategoryIndex,
  LayoutIndex,
  LayoutPostList,
  LayoutSearch,
  LayoutSlug,
  LayoutTagIndex,
  CONFIG as THEME_CONFIG
}