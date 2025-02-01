import { CodeEditorState } from './../types/index'
import { LANGUAGE_CONFIG } from '@/app/(root)/_constants'
import { create } from 'zustand'
import * as monaco from 'monaco-editor'

// 초기 상태를 반환하는 함수
const getInitialState = () => {
  // 서버라면 기본 값을 반환
  if (typeof window === 'undefined') {
    return {
      language: 'javascript',
      fontSize: 16,
      theme: 'vs-dark',
    }
  }

  // 클라이언트라면 로컬 스토리지에서 값을 가져옴
  const savedLanguage = localStorage.getItem('editor-language') || 'javascript'
  const savedTheme = localStorage.getItem('editor-theme') || 'vs-dark'
  const savedFontSize = localStorage.getItem('editor-font-size') || 16

  return {
    language: savedLanguage,
    theme: savedTheme,
    fontSize: Number(savedFontSize),
  }
}

// zustand를 사용하여 상태 생성
export const useCodeEditorStore = create<CodeEditorState>((set, get) => {
  const initialState = getInitialState()

  return {
    ...initialState,
    output: '',
    isRunning: false,
    error: null,
    editor: null,
    executionResult: null,

    // 에디터의 코드를 가져오는 함수
    getCode: () => get().editor?.getValue() || '',

    // 에디터를 설정하는 함수
    setEditor: (editor: monaco.editor.IStandaloneCodeEditor) => {
      const savedCode = localStorage.getItem(`editor-code-${get().language}`)
      if (savedCode) editor.setValue(savedCode)

      set({ editor })
    },

    // 테마를 설정하는 함수
    setTheme: (theme: string) => {
      localStorage.setItem('editor-theme', theme)
      set({ theme })
    },

    // 폰트 크기를 설정하는 함수
    setFontSize: (fontSize: number) => {
      localStorage.setItem('editor-font-size', fontSize.toString())
      set({ fontSize })
    },

    // 언어를 설정하는 함수
    setLanguage: (language: string) => {
      // 언어를 변경하기 전에 현재 언어의 코드를 저장
      const currentCode = get().editor?.getValue()
      if (currentCode) {
        localStorage.setItem(`editor-code-${get().language}`, currentCode)
      }

      localStorage.setItem('editor-language', language)

      set({
        language,
        output: '',
        error: null,
      })
    },

    // 코드를 실행하는 함수
    runCode: async () => {
      const { language, getCode } = get()
      const code = getCode()

      if (!code) {
        set({ error: '코드를 입력하세요' })
        return
      }

      set({ isRunning: true, error: null, output: '' })

      try {
        const runtime = LANGUAGE_CONFIG[language].pistonRuntime
        const response = await fetch('https://emkc.org/api/v2/piston/execute', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            language: runtime.language,
            version: runtime.version,
            files: [{ content: code }],
          }),
        })

        const data = await response.json()

        console.log('piston에서 받은 데이터:', data)

        // API 수준의 오류 처리
        if (data.message) {
          set({
            error: data.message,
            executionResult: { code, output: '', error: data.message },
          })
          return
        }

        // 컴파일 오류 처리
        if (data.compile && data.compile.code !== 0) {
          const error = data.compile.stderr || data.compile.output
          set({
            error,
            executionResult: {
              code,
              output: '',
              error,
            },
          })
          return
        }

        // 실행 오류 처리
        if (data.run && data.run.code !== 0) {
          const error = data.run.stderr || data.run.output
          set({
            error,
            executionResult: {
              code,
              output: '',
              error,
            },
          })
          return
        }

        // 실행이 성공적일 경우
        const output = data.run.output

        set({
          output: output.trim(),
          error: null,
          executionResult: {
            code,
            output: output.trim(),
            error: null,
          },
        })
      } catch (error) {
        console.log('코드 실행 중 오류 발생:', error)
        set({
          error: '코드 실행 중 오류 발생',
          executionResult: {
            code,
            output: '',
            error: '코드 실행 중 오류 발생',
          },
        })
      } finally {
        set({ isRunning: false })
      }
    },
  }
})

// 실행 결과를 가져오는 함수
export const getExecutionResult = () =>
  useCodeEditorStore.getState().executionResult
