'use client'

import { useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { useState } from 'react'
import NavigationHeader from '@/components/NavigationHeader'
import SnippetsPageSkeleton from './_components/SnippetsPageSkeleton'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, Search, Tag, X, Grid, Layers, Code } from 'lucide-react'
import SnippetCard from './_components/SnippetCard'

const SnippetsPage = () => {
  const snippets = useQuery(api.snippets.getSnippets) // 모든 코드 스니펫을 가져오는 쿼리
  const [searchQuery, setSearchQuery] = useState('') // 검색 쿼리
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null) // 선택된 언어
  const [view, setView] = useState<'grid' | 'list'>('grid') // 스니펫 보기 방식

  // 로딩 상태
  if (snippets === undefined) {
    return (
      <div className="min-h-screen">
        <NavigationHeader />
        <SnippetsPageSkeleton />
      </div>
    )
  }

  const languages = [...new Set(snippets.map((s) => s.language))] // 모든 언어 목록
  const popularLanguages = languages.slice(0, 5) // 인기 있는 언어 목록

  // 스니펫 필터링 공격적으로 검색 쿼리와 선택된 언어에 따라 스니펫을 필터링합니다.
  const filteredSnippets = snippets.filter((snippet) => {
    const matchesSearch =
      snippet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snippet.language.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snippet.userName.toLowerCase().includes(searchQuery.toLowerCase())

    // 선택된 언어가 없거나 선택된 언어와 일치하는 경우
    const matchesLanguage =
      !selectedLanguage || snippet.language === selectedLanguage

    // 검색 쿼리와 언어가 모두 일치하는 경우에만 스니펫을 반환합니다.
    return matchesSearch && matchesLanguage
  })

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <NavigationHeader />
      <div className="relative max-w-7xl mx-auto px-4 py-12">
        {/* 히어로 섹션 */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r
             from-blue-500/10 to-purple-500/10 text-sm text-gray-400 mb-6"
          >
            <BookOpen className="w-4 h-4" />
            커뮤니티 코드 라이브러리
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-100 to-gray-300 text-transparent bg-clip-text mb-6"
          >
            코드 스니펫 발견 및 공유
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-400 mb-8"
          >
            커뮤니티에서 큐레이션된 코드 스니펫 모음을 탐색하세요
          </motion.p>
        </div>

        {/* 필터 섹션 */}
        <div className="relative max-w-5xl mx-auto mb-12 space-y-6">
          {/* 검색 */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
            <div className="relative flex items-center">
              <Search className="absolute left-4 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="제목, 언어 또는 작성자로 스니펫 검색..."
                className="w-full pl-12 pr-4 py-4 bg-[#1e1e2e]/80 hover:bg-[#1e1e2e] text-white
                  rounded-xl border border-[#313244] hover:border-[#414155] transition-all duration-200
                  placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
          </div>

          {/* 필터 바 */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-[#1e1e2e] rounded-lg ring-1 ring-gray-800">
              <Tag className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-400">언어:</span>
            </div>

            {popularLanguages.map((lang) => (
              <button
                key={lang}
                onClick={() =>
                  setSelectedLanguage(lang === selectedLanguage ? null : lang)
                }
                className={`
                    group relative px-3 py-1.5 rounded-lg transition-all duration-200
                    ${
                      selectedLanguage === lang
                        ? 'text-blue-400 bg-blue-500/10 ring-2 ring-blue-500/50'
                        : 'text-gray-400 hover:text-gray-300 bg-[#1e1e2e] hover:bg-[#262637] ring-1 ring-gray-800'
                    }
                  `}
              >
                <div className="flex items-center gap-2">
                  <img
                    src={`/${lang}.png`}
                    alt={lang}
                    className="w-4 h-4 object-contain"
                  />
                  <span className="text-sm">{lang}</span>
                </div>
              </button>
            ))}

            {selectedLanguage && (
              <button
                onClick={() => setSelectedLanguage(null)}
                className="flex items-center gap-1 px-2 py-1 text-xs text-gray-400 hover:text-gray-300 transition-colors"
              >
                <X className="w-3 h-3" />
                지우기
              </button>
            )}

            <div className="ml-auto flex items-center gap-3">
              <span className="text-sm text-gray-500">
                {filteredSnippets.length}개의 스니펫 발견됨
              </span>

              {/* 보기 방식 토글 */}
              <div className="flex items-center gap-1 p-1 bg-[#1e1e2e] rounded-lg ring-1 ring-gray-800">
                <button
                  onClick={() => setView('grid')}
                  className={`p-2 rounded-md transition-all ${
                    view === 'grid'
                      ? 'bg-blue-500/20 text-blue-400'
                      : 'text-gray-400 hover:text-gray-300 hover:bg-[#262637]'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setView('list')}
                  className={`p-2 rounded-md transition-all ${
                    view === 'list'
                      ? 'bg-blue-500/20 text-blue-400'
                      : 'text-gray-400 hover:text-gray-300 hover:bg-[#262637]'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 스니펫 그리드 */}
        <motion.div
          className={`grid gap-6 ${
            view === 'grid'
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
              : 'grid-cols-1 max-w-3xl mx-auto'
          }`}
          layout
        >
          <AnimatePresence mode="popLayout">
            {filteredSnippets.map((snippet) => (
              <SnippetCard key={snippet._id} snippet={snippet} />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* 예외 케이스: 빈 상태 */}
        {filteredSnippets.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative max-w-md mx-auto mt-20 p-8 rounded-2xl overflow-hidden"
          >
            <div className="text-center">
              <div
                className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br 
                from-blue-500/10 to-purple-500/10 ring-1 ring-white/10 mb-6"
              >
                <Code className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-medium text-white mb-3">
                스니펫을 찾을 수 없음
              </h3>
              <p className="text-gray-400 mb-6">
                {searchQuery || selectedLanguage
                  ? '검색 쿼리나 필터를 조정해보세요'
                  : '커뮤니티와 첫 번째 코드 스니펫을 공유하세요'}
              </p>

              {(searchQuery || selectedLanguage) && (
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedLanguage(null)
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#262637] text-gray-300 hover:text-white rounded-lg 
                    transition-colors"
                >
                  <X className="w-4 h-4" />
                  모든 필터 지우기
                </button>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
export default SnippetsPage
