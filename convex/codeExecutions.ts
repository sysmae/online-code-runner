import { ConvexError, v } from 'convex/values'
import { mutation, query } from './_generated/server'
import { paginationOptsValidator } from 'convex/server'

// 코드 실행 결과를 저장하는 mutation
export const saveExecution = mutation({
  args: {
    language: v.string(), // 언어는 한번에 하나만 사용 가능
    code: v.string(), // 코드
    output: v.optional(v.string()), // 출력 (선택적)
    error: v.optional(v.string()), // 오류 (선택적)
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new ConvexError('인증되지 않음')

    // 프로 상태 확인
    const user = await ctx.db
      .query('users')
      .withIndex('by_user_id')
      .filter((q) => q.eq(q.field('userId'), identity.subject))
      .first()

    if (!user?.isPro && args.language !== 'javascript') {
      throw new ConvexError('이 언어를 사용하려면 프로 구독이 필요합니다')
    }

    await ctx.db.insert('codeExecutions', {
      ...args,
      userId: identity.subject,
    })
  },
})

// 사용자의 코드 실행 기록을 가져오는 query
export const getUserExecutions = query({
  args: {
    userId: v.string(), // 사용자 ID
    paginationOpts: paginationOptsValidator, // 페이지네이션 옵션
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('codeExecutions')
      .withIndex('by_user_id')
      .filter((q) => q.eq(q.field('userId'), args.userId))
      .order('desc')
      .paginate(args.paginationOpts)
  },
})

// 사용자의 통계를 가져오는 query
export const getUserStats = query({
  args: { userId: v.string() }, // 사용자 ID
  handler: async (ctx, args) => {
    const executions = await ctx.db
      .query('codeExecutions')
      .withIndex('by_user_id')
      .filter((q) => q.eq(q.field('userId'), args.userId))
      .collect()

    // 즐겨찾기한 스니펫 가져오기
    const starredSnippets = await ctx.db
      .query('stars')
      .withIndex('by_user_id')
      .filter((q) => q.eq(q.field('userId'), args.userId))
      .collect()

    // 모든 즐겨찾기한 스니펫의 세부 정보를 가져와 언어 분석
    const snippetIds = starredSnippets.map((star) => star.snippetId)
    const snippetDetails = await Promise.all(
      snippetIds.map((id) => ctx.db.get(id))
    )

    // 가장 많이 즐겨찾기한 언어 계산
    const starredLanguages = snippetDetails
      .filter(Boolean)
      .reduce((acc, curr) => {
        if (curr?.language) {
          acc[curr.language] = (acc[curr.language] || 0) + 1
        }
        return acc
      }, {} as Record<string, number>)

    const mostStarredLanguage =
      Object.entries(starredLanguages).sort(([, a], [, b]) => b - a)[0]?.[0] ??
      'N/A'

    // 실행 통계 계산
    const last24Hours = executions.filter(
      (e) => e._creationTime > Date.now() - 24 * 60 * 60 * 1000
    ).length

    const languageStats = executions.reduce((acc, curr) => {
      acc[curr.language] = (acc[curr.language] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const languages = Object.keys(languageStats)
    const favoriteLanguage = languages.length
      ? languages.reduce((a, b) =>
          languageStats[a] > languageStats[b] ? a : b
        )
      : 'N/A'

    return {
      totalExecutions: executions.length, // 총 실행 횟수
      languagesCount: languages.length, // 사용한 언어 수
      languages: languages, // 사용한 언어 목록
      last24Hours, // 지난 24시간 동안의 실행 횟수
      favoriteLanguage, // 가장 많이 사용한 언어
      languageStats, // 언어별 실행 횟수
      mostStarredLanguage, // 가장 많이 즐겨찾기한 언어
    }
  },
})
