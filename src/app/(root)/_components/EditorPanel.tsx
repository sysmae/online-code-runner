'use client'
import { useCodeEditorStore } from '@/store/useCodeEditorStore'
import { useEffect, useState } from 'react'
import { defineMonacoThemes, LANGUAGE_CONFIG } from '../_constants'
import { Editor } from '@monaco-editor/react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { RotateCcwIcon, ShareIcon, TypeIcon } from 'lucide-react'
import { useClerk } from '@clerk/nextjs'
import { EditorPanelSkeleton } from './EditorPanelSkeleton'
import useMounted from '@/hooks/useMounted'
import ShareSnippetDialog from './ShareSnippetDialog'

function EditorPanel() {
  const clerk = useClerk()
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false)
  const { language, theme, fontSize, editor, setFontSize, setEditor } =
    useCodeEditorStore()

  const mounted = useMounted()

  // 언어가 변경될 때마다 에디터에 저장된 코드를 불러옵니다.
  useEffect(() => {
    const savedCode = localStorage.getItem(`editor-code-${language}`)
    const newCode = savedCode || LANGUAGE_CONFIG[language].defaultCode
    if (editor) editor.setValue(newCode)
  }, [language, editor])

  // 폰트 크기를 로컬 스토리지에서 불러옵니다.
  useEffect(() => {
    const savedFontSize = localStorage.getItem('editor-font-size')
    if (savedFontSize) setFontSize(parseInt(savedFontSize))
  }, [setFontSize])

  // 에디터를 기본 코드로 초기화합니다.
  const handleRefresh = () => {
    const defaultCode = LANGUAGE_CONFIG[language].defaultCode
    if (editor) editor.setValue(defaultCode)
    localStorage.removeItem(`editor-code-${language}`)
  }

  // 에디터 내용이 변경될 때마다 로컬 스토리지에 저장합니다.
  const handleEditorChange = (value: string | undefined) => {
    if (value) localStorage.setItem(`editor-code-${language}`, value)
  }

  // 폰트 크기를 변경하고 로컬 스토리지에 저장합니다.
  const handleFontSizeChange = (newSize: number) => {
    const size = Math.min(Math.max(newSize, 12), 24)
    setFontSize(size)
    localStorage.setItem('editor-font-size', size.toString())
  }

  if (!mounted) return null

  return (
    <div className="relative">
      <div className="relative bg-[#12121a]/90 backdrop-blur rounded-xl border border-white/[0.05] p-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#1e1e2e] ring-1 ring-white/5">
              <Image
                src={'/' + language + '.png'}
                alt="Logo"
                width={24}
                height={24}
              />
            </div>
            <div>
              <h2 className="text-sm font-medium text-white">코드 에디터</h2>
              <p className="text-xs text-gray-500">
                코드를 작성하고 실행하세요
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* 폰트 크기 슬라이더 */}
            <div className="flex items-center gap-3 px-3 py-2 bg-[#1e1e2e] rounded-lg ring-1 ring-white/5">
              <TypeIcon className="size-4 text-gray-400" />
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="12"
                  max="24"
                  value={fontSize}
                  onChange={(e) =>
                    handleFontSizeChange(parseInt(e.target.value))
                  }
                  className="w-20 h-1 bg-gray-600 rounded-lg cursor-pointer"
                />
                <span className="text-sm font-medium text-gray-400 min-w-[2rem] text-center">
                  {fontSize}
                </span>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              className="p-2 bg-[#1e1e2e] hover:bg-[#2a2a3a] rounded-lg ring-1 ring-white/5 transition-colors"
              aria-label="기본 코드로 초기화"
            >
              <RotateCcwIcon className="size-4 text-gray-400" />
            </motion.button>

            {/* 공유 버튼 */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsShareDialogOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg overflow-hidden bg-gradient-to-r
               from-blue-500 to-blue-600 opacity-90 hover:opacity-100 transition-opacity"
            >
              <ShareIcon className="size-4 text-white" />
              <span className="text-sm font-medium text-white ">공유</span>
            </motion.button>
          </div>
        </div>

        {/* 에디터 */}
        <div className="relative group rounded-xl overflow-hidden ring-1 ring-white/[0.05]">
          {clerk.loaded && (
            <Editor
              height="600px"
              language={LANGUAGE_CONFIG[language].monacoLanguage}
              onChange={handleEditorChange}
              theme={theme}
              beforeMount={defineMonacoThemes}
              onMount={(editor) => setEditor(editor)}
              options={{
                minimap: { enabled: false },
                fontSize,
                automaticLayout: true,
                scrollBeyondLastLine: false,
                padding: { top: 16, bottom: 16 },
                renderWhitespace: 'selection',
                fontFamily: '"Fira Code", "Cascadia Code", Consolas, monospace',
                fontLigatures: true,
                cursorBlinking: 'smooth',
                smoothScrolling: true,
                contextmenu: true,
                renderLineHighlight: 'all',
                lineHeight: 1.6,
                letterSpacing: 0.5,
                roundedSelection: true,
                scrollbar: {
                  verticalScrollbarSize: 8,
                  horizontalScrollbarSize: 8,
                },
              }}
            />
          )}

          {!clerk.loaded && <EditorPanelSkeleton />}
        </div>
      </div>
      {isShareDialogOpen && (
        <ShareSnippetDialog onClose={() => setIsShareDialogOpen(false)} />
      )}
    </div>
  )
}
export default EditorPanel
