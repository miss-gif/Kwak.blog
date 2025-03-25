import { TPosts, TPostStatus, TPostType } from "src/types"

export type FilterPostsOptions = {
  acceptStatus?: TPostStatus[]
  acceptType?: TPostType[]
}

const initialOption: FilterPostsOptions = {
  acceptStatus: ["Public"],
  acceptType: ["Post"],
}
const current = new Date()
const tomorrow = new Date(current)
tomorrow.setDate(tomorrow.getDate() + 1)
tomorrow.setHours(0, 0, 0, 0)

/**
 * 주어진 게시물 목록에서 특정 조건에 따라 게시물을 필터링합니다.
 *
 * @param posts - 필터링할 게시물 목록입니다.
 * @param options - 필터링 옵션입니다. 기본값은 `initialOption`입니다.
 *   - `acceptStatus` (기본값: `["Public"]`): 허용할 게시물 상태 목록입니다.
 *   - `acceptType` (기본값: `["Post"]`): 허용할 게시물 유형 목록입니다.
 * @returns 필터링된 게시물 목록을 반환합니다.
 *
 * 필터링 조건:
 * 1. 게시물의 제목(`title`)과 슬러그(`slug`)가 존재해야 하며,
 *    게시물 생성 날짜(`createdTime`)가 내일 이후가 아니어야 합니다.
 * 2. 게시물 상태(`status`)가 `acceptStatus` 목록에 포함되어야 합니다.
 * 3. 게시물 유형(`type`)이 `acceptType` 목록에 포함되어야 합니다.
 */
export function filterPosts(
  posts: TPosts,
  options: FilterPostsOptions = initialOption
) {
  const { acceptStatus = ["Public"], acceptType = ["Post"] } = options
  const filteredPosts = posts
    // filter data
    .filter((post) => {
      const postDate = new Date( post.createdTime)
      if (!post.title || !post.slug || postDate > tomorrow) return false
      return true
    })
    // filter status
    .filter((post) => {
      const postStatus = post.status[0]
      return acceptStatus.includes(postStatus)
    })
    // filter type
    .filter((post) => {
      const postType = post.type[0]
      return acceptType.includes(postType)
    })
  return filteredPosts
}
