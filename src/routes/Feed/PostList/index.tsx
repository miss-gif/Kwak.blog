import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import PostCard from "src/routes/Feed/PostList/PostCard"
import { DEFAULT_CATEGORY } from "src/constants"
import usePostsQuery from "src/hooks/usePostsQuery"

type Props = {
  q: string // 검색 쿼리
}

/**
 * 게시물 목록을 표시하는 컴포넌트
 * 검색어, 태그, 카테고리, 정렬 순서에 따라 게시물을 필터링하여 보여줌
 */
const PostList: React.FC<Props> = ({ q }) => {
  const router = useRouter()
  const data = usePostsQuery() // 모든 게시물 데이터 가져오기
  const [filteredPosts, setFilteredPosts] = useState(data) // 필터링된 게시물 상태

  // 라우터 쿼리에서 필터링 조건 추출
  const currentTag = `${router.query.tag || ""}` || undefined
  const currentCategory = `${router.query.category || ""}` || DEFAULT_CATEGORY
  const currentOrder = `${router.query.order || ""}` || "desc"

  useEffect(() => {
    // 게시물 필터링 로직
    setFilteredPosts(() => {
      // 원본 데이터 복사
      let newFilteredPosts = [...data]

      // 검색어로 필터링
      if (q) {
        newFilteredPosts = newFilteredPosts.filter((post) => {
          const tagContent = post.tags ? post.tags.join(" ") : ""
          const searchContent = `${post.title} ${post.summary} ${tagContent}`
          return searchContent.toLowerCase().includes(q.toLowerCase())
        })
      }

      // 태그로 필터링
      if (currentTag) {
        newFilteredPosts = newFilteredPosts.filter((post) =>
          post?.tags?.includes(currentTag)
        )
      }

      // 카테고리로 필터링
      if (currentCategory !== DEFAULT_CATEGORY) {
        newFilteredPosts = newFilteredPosts.filter((post) =>
          post?.category?.includes(currentCategory)
        )
      }

      // 정렬 순서 적용
      if (currentOrder !== "desc") {
        newFilteredPosts = [...newFilteredPosts].reverse()
      }

      return newFilteredPosts
    })
  }, [q, currentTag, currentCategory, currentOrder, data])

  return (
    <div className="my-2">
      {!filteredPosts.length && (
        <p className="text-gray-500 dark:text-gray-300">
          검색결과를 찾을 수 없습니다. 🤔
        </p>
      )}
      {filteredPosts.map((post) => (
        <PostCard key={post.id} data={post} />
      ))}
    </div>
  )
}

export default PostList
