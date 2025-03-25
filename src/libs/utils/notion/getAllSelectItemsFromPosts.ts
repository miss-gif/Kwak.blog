import { TPosts } from "src/types"

/**
 * 주어진 게시물 목록에서 특정 키("tags" 또는 "category")에 해당하는 모든 선택 항목을 추출하고,
 * 각 항목의 등장 횟수를 계산하여 객체 형태로 반환합니다.
 *
 * @param key - 추출할 키 값 ("tags" 또는 "category").
 * @param posts - 게시물 목록 (TPosts 타입).
 * @returns 각 선택 항목의 이름과 해당 항목의 등장 횟수를 나타내는 객체.
 */
export function getAllSelectItemsFromPosts(
  key: "tags" | "category",
  posts: TPosts
) {
  const selectedPosts = posts.filter((post) => post?.[key])
  const items = [...selectedPosts.map((p) => p[key]).flat()]
  const itemObj: { [itemName: string]: number } = {}
  items.forEach((item) => {
    if (!item) return
    if (item in itemObj) {
      itemObj[item]++
    } else {
      itemObj[item] = 1
    }
  })
  return itemObj
}
