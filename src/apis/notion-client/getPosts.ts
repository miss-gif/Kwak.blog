import { CONFIG } from "site.config"
import { NotionAPI } from "notion-client"
import { idToUuid } from "notion-utils"

import getAllPageIds from "src/libs/utils/notion/getAllPageIds"
import getPageProperties from "src/libs/utils/notion/getPageProperties"
import { TPosts } from "src/types"

/**
 * @param {{ includePages: boolean }} - false: posts only / true: include pages
 */

// TODO: react query를 사용해서 처음 불러온 뒤로는 해당데이터만 사용하도록 수정
export const getPosts = async () => {
  let id = CONFIG.notionConfig.pageId as string
  const api = new NotionAPI()

  const response = await api.getPage(id)
  id = idToUuid(id)
  const collection = Object.values(response.collection)[0]?.value
  const block = response.block
  const schema = collection?.schema

  const rawMetadata = block[id].value

  // 타입 확인
  if (
    rawMetadata?.type !== "collection_view_page" &&
    rawMetadata?.type !== "collection_view"
  ) {
    return []
  } else {
    // 데이터 구성
    const pageIds = getAllPageIds(response)
    const tempBlock = (await api.getBlocks(pageIds)).recordMap.block

    const data = []
    for (let i = 0; i < pageIds.length; i++) {
      const id = pageIds[i]
      const properties =
        (await getPageProperties(id, tempBlock, schema)) || null
      if (!tempBlock[id]) continue

      // Add fullwidth, createdtime to properties
      properties.createdTime = new Date(
        tempBlock[id].value?.created_time
      ).toString()
      properties.fullWidth =
        (tempBlock[id].value?.format as any)?.page_full_width ?? false

      data.push(properties)
    }

    // 날짜로 정렬
    data.sort((a: any, b: any) => {
      const dateA: any = new Date( a.createdTime)
      const dateB: any = new Date( b.createdTime)
      return dateB - dateA
    })

    const posts = data as TPosts
    return posts
  }
}