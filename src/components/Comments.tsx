import { SignInButton, useUser } from '@clerk/nextjs'
import { Id } from '../../convex/_generated/dataModel'
import { useState } from 'react'
import { useMutation, useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import toast from 'react-hot-toast'
import { MessageSquare } from 'lucide-react'
import Comment from '../app/snippets/[id]/_components/Comment'
import CommentForm from '../app/snippets/[id]/_components/CommentForm'

function Comments({ snippetId }: { snippetId: Id<'snippets'> }) {
  const { user } = useUser()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deletinCommentId, setDeletingCommentId] = useState<string | null>(null)

  // 댓글 목록을 가져오는 쿼리
  const comments = useQuery(api.snippets.getComments, { snippetId }) || []
  // 댓글 추가를 위한 mutation
  const addComment = useMutation(api.snippets.addComment)
  // 댓글 삭제를 위한 mutation
  const deleteComment = useMutation(api.snippets.deleteComment)

  // 댓글 제출 핸들러
  const handleSubmitComment = async (content: string) => {
    setIsSubmitting(true)

    try {
      await addComment({ snippetId, content })
    } catch (error) {
      console.log('댓글 추가 중 오류 발생:', error)
      toast.error('문제가 발생했습니다')
    } finally {
      setIsSubmitting(false)
    }
  }

  // 댓글 삭제 핸들러
  const handleDeleteComment = async (commentId: Id<'snippetComments'>) => {
    setDeletingCommentId(commentId)

    try {
      await deleteComment({ commentId })
    } catch (error) {
      console.log('댓글 삭제 중 오류 발생:', error)
      toast.error('문제가 발생했습니다')
    } finally {
      setDeletingCommentId(null)
    }
  }

  return (
    <div className="bg-[#121218] border border-[#ffffff0a] rounded-2xl overflow-hidden">
      <div className="px-6 sm:px-8 py-6 border-b border-[#ffffff0a]">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          토론 ({comments.length})
        </h2>
      </div>

      <div className="p-6 sm:p-8">
        {user ? (
          <CommentForm
            onSubmit={handleSubmitComment}
            isSubmitting={isSubmitting}
          />
        ) : (
          <div className="bg-[#0a0a0f] rounded-xl p-6 text-center mb-8 border border-[#ffffff0a]">
            <p className="text-[#808086] mb-4">
              토론에 참여하려면 로그인하세요
            </p>
            <SignInButton mode="modal">
              <button className="px-6 py-2 bg-[#3b82f6] text-white rounded-lg hover:bg-[#2563eb] transition-colors">
                로그인
              </button>
            </SignInButton>
          </div>
        )}

        <div className="space-y-6">
          {comments.map((comment) => (
            <Comment
              key={comment._id}
              comment={comment}
              onDelete={handleDeleteComment}
              isDeleting={deletinCommentId === comment._id}
              currentUserId={user?.id}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
export default Comments
