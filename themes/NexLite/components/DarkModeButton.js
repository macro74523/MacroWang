import { useGlobal } from '@/lib/global'
import { saveDarkModeToLocalStorage } from '@/themes/theme'

const DarkModeButton = () => {
  const { isDarkMode, updateDarkMode } = useGlobal()

  const handleToggle = () => {
    const newStatus = !isDarkMode
    saveDarkModeToLocalStorage(newStatus)
    updateDarkMode(newStatus)
    const htmlElement = document.getElementsByTagName('html')[0]
    htmlElement.classList?.remove(newStatus ? 'light' : 'dark')
    htmlElement.classList?.add(newStatus ? 'dark' : 'light')
  }

  return (
    <button
      onClick={handleToggle}
      className='p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors'
      title={isDarkMode ? '切换到亮色模式' : '切换到暗色模式'}>
      <i className={`fas ${isDarkMode ? 'fa-sun' : 'fa-moon'} text-zinc-600 dark:text-zinc-400`}></i>
    </button>
  )
}

export default DarkModeButton