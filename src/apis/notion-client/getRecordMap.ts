/**
 * Notion API로부터 특정 페이지의 RecordMap을 가져옵니다.
 * 
 * @param pageId - 가져올 Notion 페이지의 ID
 * @returns 지정된 페이지의 RecordMap 데이터
 * 
 * @example
 * ```typescript
 * const recordMap = await getRecordMap('1234567890abcdef');
 * ```
 */
import { NotionAPI } from "notion-client"

export const getRecordMap = async (pageId: string) => {
  const api = new NotionAPI()
  const recordMap = await api.getPage(pageId)
  return recordMap
}
