import { getTextContent, getDateValue } from "notion-utils"
import { NotionAPI } from "notion-client"
import { BlockMap, CollectionPropertySchemaMap } from "notion-types"
import { customMapImageUrl } from "./customMapImageUrl"

/**
 * Notion 페이지의 속성을 가져오는 비동기 함수입니다.
 *
 * @param id - Notion 페이지의 고유 식별자입니다.
 * @param block - Notion 블록 맵으로, 페이지의 블록 데이터를 포함합니다.
 * @param schema - 컬렉션 속성 스키마 맵으로, 페이지 속성의 메타데이터를 정의합니다.
 * @returns 페이지 속성을 포함하는 객체를 반환합니다.
 *
 * @remarks
 * - `excludeProperties` 배열에 정의된 속성 유형은 처리에서 제외됩니다.
 * - 특정 속성 유형(`file`, `date`, `select`, `multi_select`, `person`)은 별도로 처리됩니다.
 * - `person` 속성 유형의 경우, Notion API를 호출하여 사용자 정보를 가져옵니다.
 *
 * @throws API 호출 중 오류가 발생할 경우, 해당 속성 값은 `undefined`로 설정됩니다.
 *
 * @example
 * ```typescript
 * const pageProperties = await getPageProperties(pageId, blockMap, schemaMap);
 * console.log(pageProperties);
 * ```
 */
async function getPageProperties(
  id: string,
  block: BlockMap,
  schema: CollectionPropertySchemaMap
) {
  const api = new NotionAPI()
  const rawProperties = Object.entries(block?.[id]?.value?.properties || [])
  const excludeProperties = ["date", "select", "multi_select", "person", "file"]
  const properties: any = {}
  for (let i = 0; i < rawProperties.length; i++) {
    const [key, val]: any = rawProperties[i]
    properties.id = id
    if (schema[key]?.type && !excludeProperties.includes(schema[key].type)) {
      properties[schema[key].name] = getTextContent(val)
    } else {
      switch (schema[key]?.type) {
        case "file": {
          try {
            const Block = block?.[id].value
            const url: string = val[0][1][0][1]
            const newurl = customMapImageUrl(url, Block)
            properties[schema[key].name] = newurl
          } catch (error) {
            properties[schema[key].name] = undefined
          }
          break
        }
        case "date": {
          const dateProperty: any = getDateValue(val)
          delete dateProperty.type
          properties[schema[key].name] = dateProperty
          break
        }
        case "select": {
          const selects = getTextContent(val)
          if (selects[0]?.length) {
            properties[schema[key].name] = selects.split(",")
          }
          break
        }
        case "multi_select": {
          const selects = getTextContent(val)
          if (selects[0]?.length) {
            properties[schema[key].name] = selects.split(",")
          }
          break
        }
        case "person": {
          const rawUsers = val.flat()

          const users = []
          for (let i = 0; i < rawUsers.length; i++) {
            if (rawUsers[i][0][1]) {
              const userId = rawUsers[i][0]
              const res: any = await api.getUsers(userId)
              const resValue =
                res?.recordMapWithRoles?.notion_user?.[userId[1]]?.value
              const user = {
                id: resValue?.id,
                name:
                  resValue?.name ||
                  `${resValue?.family_name}${resValue?.given_name}` ||
                  undefined,
                profile_photo: resValue?.profile_photo || null,
              }
              users.push(user)
            }
          }
          properties[schema[key].name] = users
          break
        }
        default:
          break
      }
    }
  }
  return properties
}

export { getPageProperties as default }
