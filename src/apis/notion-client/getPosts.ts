import { CONFIG } from "site.config"
import { NotionAPI } from "notion-client"
import { idToUuid } from "notion-utils"

import getAllPageIds from "src/libs/utils/notion/getAllPageIds"
import getPageProperties from "src/libs/utils/notion/getPageProperties"
import { TPosts } from "src/types"

/**
 * Notion에서 포스트 데이터를 가져오는 함수
 * @returns {Promise<TPosts>} 포스트 데이터 배열
 */
export const getPosts = async (): Promise<TPosts> => {
  // Notion 페이지 ID 가져오기
  let id = CONFIG.notionConfig.pageId as string
  const api = new NotionAPI()

  // Notion API를 통해 페이지 데이터 가져오기
  const response = await api.getPage(id)
  id = idToUuid(id)
  
  // 컬렉션, 블록, 스키마 데이터 추출
  const collection = Object.values(response.collection)[0]?.value
  const block = response.block
  const schema = collection?.schema
  const rawMetadata = block[id].value

  // 컬렉션 타입 확인 (유효한 데이터베이스인지 검증)
  if (
    rawMetadata?.type !== "collection_view_page" &&
    rawMetadata?.type !== "collection_view"
  ) {
    return []
  } 
  
  // 데이터베이스에서 포스트 데이터 추출 및 구성
  const pageIds = getAllPageIds(response)
  const tempBlock = (await api.getBlocks(pageIds)).recordMap.block

  // 각 페이지의 속성 정보 추출
  const data = await extractPageData(pageIds, tempBlock, schema)

  // 생성일 기준으로 내림차순 정렬 (최신순)
  const sortedData = sortByCreatedDate(data)

  return sortedData as TPosts
}

/**
 * 페이지 ID 목록에서 각 페이지의 데이터를 추출하는 함수
 * @param pageIds 페이지 ID 배열
 * @param blocks 블록 데이터
 * @param schema 스키마 정보
 * @returns 페이지 데이터 배열
 */
const extractPageData = async (pageIds: string[], blocks: any, schema: any) => {
  const data = []
  
  for (let i = 0; i < pageIds.length; i++) {
    const id = pageIds[i]
    
    // 페이지 속성 가져오기
    const properties = await getPageProperties(id, blocks, schema) || null
    if (!blocks[id]) continue

    // 생성 시간과 전체 너비 속성 추가
    properties.createdTime = new Date(
      blocks[id].value?.created_time
    ).toString()
    properties.fullWidth =
      (blocks[id].value?.format as any)?.page_full_width ?? false

    data.push(properties)
  }
  
  return data
}

/**
 * 데이터를 생성일 기준으로 정렬하는 함수
 * @param data 정렬할 데이터 배열
 * @returns 정렬된 데이터 배열
 */
const sortByCreatedDate = (data: any[]) => {
  return [...data].sort((a: any, b: any) => {
    const dateA: Date = new Date(a.createdTime)
    const dateB: Date = new Date(b.createdTime)
    return dateB.getTime() - dateA.getTime() // 최신순 정렬
  })
}