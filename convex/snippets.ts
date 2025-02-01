import { v } from 'convex/values'
import { mutation, query } from './_generated/server'

// 코드 스니펫을 생성하는 mutation
export const createSnippet = mutation({
  args: {
    title: v.string(), // 스니펫 제목
    language: v.string(), // 스니펫 언어
    code: v.string(), // 스니펫 코드
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('인증되지 않음')

    const user = await ctx.db
      .query('users')
      .withIndex('by_user_id')
      .filter((q) => q.eq(q.field('userId'), identity.subject))
      .first()

    if (!user) throw new Error('사용자를 찾을 수 없음')

    const snippetId = await ctx.db.insert('snippets', {
      userId: identity.subject,
      userName: user.name,
      title: args.title,
      language: args.language,
      code: args.code,
    })

    return snippetId
  },
})

// 코드 스니펫을 삭제하는 mutation
export const deleteSnippet = mutation({
  args: {
    snippetId: v.id('snippets'), // 스니펫 ID
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('인증되지 않음')

    const snippet = await ctx.db.get(args.snippetId)
    if (!snippet) throw new Error('스니펫을 찾을 수 없음')

    if (snippet.userId !== identity.subject) {
      throw new Error('이 스니펫을 삭제할 권한이 없음')
    }

    // 스니펫에 달린 모든 댓글 삭제
    const comments = await ctx.db
      .query('snippetComments')
      .withIndex('by_snippet_id')
      .filter((q) => q.eq(q.field('snippetId'), args.snippetId))
      .collect()

    for (const comment of comments) {
      await ctx.db.delete(comment._id)
    }

    // 스니펫에 달린 모든 별 삭제
    const stars = await ctx.db
      .query('stars')
      .withIndex('by_snippet_id')
      .filter((q) => q.eq(q.field('snippetId'), args.snippetId))
      .collect()

    for (const star of stars) {
      await ctx.db.delete(star._id)
    }

    await ctx.db.delete(args.snippetId)
  },
})

// 코드 스니펫에 별을 추가하거나 제거하는 mutation
export const starSnippet = mutation({
  args: {
    snippetId: v.id('snippets'), // 스니펫 ID
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('인증되지 않음')

    const existing = await ctx.db
      .query('stars')
      .withIndex('by_user_id_and_snippet_id')
      .filter(
        (q) =>
          q.eq(q.field('userId'), identity.subject) &&
          q.eq(q.field('snippetId'), args.snippetId)
      )
      .first()

    if (existing) {
      await ctx.db.delete(existing._id)
    } else {
      await ctx.db.insert('stars', {
        userId: identity.subject,
        snippetId: args.snippetId,
      })
    }
  },
})

// 코드 스니펫에 댓글을 추가하는 mutation
export const addComment = mutation({
  args: {
    snippetId: v.id('snippets'), // 스니펫 ID
    content: v.string(), // 댓글 내용
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('인증되지 않음')

    const user = await ctx.db
      .query('users')
      .withIndex('by_user_id')
      .filter((q) => q.eq(q.field('userId'), identity.subject))
      .first()

    if (!user) throw new Error('사용자를 찾을 수 없음')

    return await ctx.db.insert('snippetComments', {
      snippetId: args.snippetId,
      userId: identity.subject,
      userName: user.name,
      content: args.content,
    })
  },
})

// 코드 스니펫의 댓글을 삭제하는 mutation
export const deleteComment = mutation({
  args: { commentId: v.id('snippetComments') }, // 댓글 ID
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('인증되지 않음')

    const comment = await ctx.db.get(args.commentId)
    if (!comment) throw new Error('댓글을 찾을 수 없음')

    // 사용자가 댓글 작성자인지 확인
    if (comment.userId !== identity.subject) {
      throw new Error('이 댓글을 삭제할 권한이 없음')
    }

    await ctx.db.delete(args.commentId)
  },
})

// 모든 코드 스니펫을 가져오는 query
export const getSnippets = query({
  handler: async (ctx) => {
    const snippets = await ctx.db.query('snippets').order('desc').collect()
    return snippets
  },
})

// 특정 ID의 코드 스니펫을 가져오는 query
export const getSnippetById = query({
  args: { snippetId: v.id('snippets') }, // 스니펫 ID
  handler: async (ctx, args) => {
    const snippet = await ctx.db.get(args.snippetId)
    if (!snippet) throw new Error('스니펫을 찾을 수 없음')

    return snippet
  },
})

// 특정 스니펫의 모든 댓글을 가져오는 query
export const getComments = query({
  args: { snippetId: v.id('snippets') }, // 스니펫 ID
  handler: async (ctx, args) => {
    const comments = await ctx.db
      .query('snippetComments')
      .withIndex('by_snippet_id')
      .filter((q) => q.eq(q.field('snippetId'), args.snippetId))
      .order('desc')
      .collect()

    return comments
  },
})

// 특정 스니펫이 사용자가 별을 추가했는지 확인하는 query
export const isSnippetStarred = query({
  args: {
    snippetId: v.id('snippets'), // 스니펫 ID
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) return false

    const star = await ctx.db
      .query('stars')
      .withIndex('by_user_id_and_snippet_id')
      .filter(
        (q) =>
          q.eq(q.field('userId'), identity.subject) &&
          q.eq(q.field('snippetId'), args.snippetId)
      )
      .first()

    return !!star
  },
})

// 특정 스니펫의 별 개수를 가져오는 query
export const getSnippetStarCount = query({
  args: { snippetId: v.id('snippets') }, // 스니펫 ID
  handler: async (ctx, args) => {
    const stars = await ctx.db
      .query('stars')
      .withIndex('by_snippet_id')
      .filter((q) => q.eq(q.field('snippetId'), args.snippetId))
      .collect()

    return stars.length
  },
})

// 사용자가 별을 추가한 모든 스니펫을 가져오는 query
export const getStarredSnippets = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) return []

    const stars = await ctx.db
      .query('stars')
      .withIndex('by_user_id')
      .filter((q) => q.eq(q.field('userId'), identity.subject))
      .collect()

    const snippets = await Promise.all(
      stars.map((star) => ctx.db.get(star.snippetId))
    )

    return snippets.filter((snippet) => snippet !== null)
  },
})
