import CodeBlock from './CodeBlock'

function CommentContent({ content }: { content: string }) {
  // 정규 표현식을 사용하여 코드 블록과 일반 텍스트를 분리
  const parts = content.split(/(```[\w-]*\n[\s\S]*?\n```)/g)

  return (
    <div className="max-w-none text-white">
      {parts.map((part, index) => {
        if (part.startsWith('```')) {
          // 코드 블록을 감지
          // 예시:
          // ```javascript
          // const name = "John";
          // ```
          const match = part.match(/```([\w-]*)\n([\s\S]*?)\n```/)

          if (match) {
            const [, language, code] = match
            return <CodeBlock language={language} code={code} key={index} />
          }
        }

        // 일반 텍스트를 줄 단위로 분리하여 렌더링
        return part.split('\n').map((line, lineIdx) => (
          <p key={lineIdx} className="mb-4 text-gray-300 last:mb-0">
            {line}
          </p>
        ))
      })}
    </div>
  )
}
export default CommentContent
