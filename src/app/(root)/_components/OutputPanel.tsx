'use client'

import { useCodeEditorStore } from '@/store/useCodeEditorStore'
import { AlertTriangle, CheckCircle, Clock, Copy, Terminal } from 'lucide-react'
import { useState } from 'react'
import RunningCodeSkeleton from './RunningCodeSkeleton'

function OutputPanel() {
  const { output, error, isRunning } = useCodeEditorStore()
  const [isCopied, setIsCopied] = useState(false)

  const hasContent = error || output

  // 출력 내용을 클립보드에 복사하는 함수
  const handleCopy = async () => {
    if (!hasContent) return
    await navigator.clipboard.writeText(error || output)
    setIsCopied(true)

    setTimeout(() => setIsCopied(false), 2000)
  }

  return (
    <div className="relative bg-[#181825] rounded-xl p-4 ring-1 ring-gray-800/50">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-[#1e1e2e] ring-1 ring-gray-800/50">
            <Terminal className="w-4 h-4 text-blue-400" />
          </div>
          <span className="text-sm font-medium text-gray-300">출력</span>
        </div>

        {/* 실행한 결과 있으면 */}
        {hasContent && (
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-gray-400 hover:text-gray-300 bg-[#1e1e2e] 
            rounded-lg ring-1 ring-gray-800/50 hover:ring-gray-700/50 transition-all"
          >
            {isCopied ? (
              <>
                <CheckCircle className="w-3.5 h-3.5" />
                복사됨!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                복사
              </>
            )}
          </button>
        )}
      </div>

      {/* 출력 영역 */}
      <div className="relative">
        <div
          className="relative bg-[#1e1e2e]/50 backdrop-blur-sm border border-[#313244] 
        rounded-xl p-4 h-[600px] overflow-auto font-mono text-sm"
        >
          {/* 실행중 */}
          {isRunning ? (
            <RunningCodeSkeleton />
          ) : error ? (
            <div className="flex items-start gap-3 text-red-400">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-1" />
              <div className="space-y-1">
                <div className="font-medium">실행 오류</div>
                <pre className="whitespace-pre-wrap text-red-400/80">
                  {error}
                </pre>
              </div>
            </div>
          ) : // 출력이 있으면
          output ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 mb-3">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">실행 성공</span>
              </div>
              <pre className="whitespace-pre-wrap text-gray-300">{output}</pre>
            </div>
          ) : (
            // 출력이 없으면
            <div className="h-full flex flex-col items-center justify-center text-gray-500">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gray-800/50 ring-1 ring-gray-700/50 mb-4">
                <Clock className="w-6 h-6" />
              </div>
              <p className="text-center">
                코드를 실행하여 출력을 확인하세요...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default OutputPanel
