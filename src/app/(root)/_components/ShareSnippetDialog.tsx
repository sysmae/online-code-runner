import { useCodeEditorStore } from '@/store/useCodeEditorStore'
import { useMutation } from 'convex/react'
import { useState } from 'react'
import { api } from '../../../../convex/_generated/api'
import { X } from 'lucide-react'
import toast from 'react-hot-toast'

function ShareSnippetDialog({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState('')
  const [isSharing, setIsSharing] = useState(false)
  const { language, getCode } = useCodeEditorStore()
  const createSnippet = useMutation(api.snippets.createSnippet)

  const handleShare = async (e: React.FormEvent) => {
    e.preventDefault()

    setIsSharing(true)

    try {
      const code = getCode()
      await createSnippet({ title, language, code })
      onClose()
      setTitle('')
      toast.success('코드 스니펫이 성공적으로 공유되었습니다.')
    } catch (error) {
      console.log('코드 스니펫 생성 중 오류 발생:', error)
      toast.error('코드 스니펫 생성 중 오류가 발생했습니다.')
    } finally {
      setIsSharing(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#1e1e2e] rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">코드 스니펫 공유</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleShare}>
          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-400 mb-2"
            >
              제목
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-[#181825] border border-[#313244] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="코드 스니펫 제목 입력"
              required
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-400 hover:text-gray-300"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isSharing}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
              disabled:opacity-50"
            >
              {isSharing ? '공유 중...' : '공유'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
export default ShareSnippetDialog
