import { idToUuid } from "notion-utils"
import { ExtendedRecordMap, ID } from "notion-types"

/**
 * 모든 페이지 ID를 가져오는 함수입니다.
 *
 * @param response - Notion의 `ExtendedRecordMap` 객체로, 컬렉션 쿼리 데이터를 포함합니다.
 * @param viewId - 선택적으로 제공되는 뷰 ID입니다. 특정 뷰의 페이지 ID를 가져오려면 이 값을 전달합니다.
 * @returns 페이지 ID 배열을 반환합니다.
 *
 * @remarks
 * - `viewId`가 제공되면 해당 뷰에 대한 페이지 ID만 반환합니다.
 * - `viewId`가 제공되지 않으면 모든 뷰의 페이지 ID를 중복 없이 반환합니다.
 * - `collection_group_results`에서 `blockIds`를 추출하여 페이지 ID를 수집합니다.
 *
 * @example
 * ```typescript
 * const response = getNotionResponse(); // ExtendedRecordMap 객체
 * const allPageIds = getAllPageIds(response);
 * const specificPageIds = getAllPageIds(response, "some-view-id");
 * ```
 */
export default function getAllPageIds(
  response: ExtendedRecordMap,
  viewId?: string
) {
  const collectionQuery = response.collection_query
  const views = Object.values(collectionQuery)[0]

  let pageIds: ID[] = []
  if (viewId) {
    const vId = idToUuid(viewId)
    pageIds = views[vId]?.blockIds
  } else {
    const pageSet = new Set<ID>()
    // * type not exist
    Object.values(views).forEach((view: any) => {
      view?.collection_group_results?.blockIds?.forEach((id: ID) =>
        pageSet.add(id)
      )
    })
    pageIds = [...pageSet]
  }
  return pageIds
}
