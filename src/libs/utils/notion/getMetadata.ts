/**
 * 주어진 원시 메타데이터(rawMetadata)에서 필요한 메타데이터를 추출하여 반환합니다.
 *
 * @param rawMetadata - 원시 메타데이터 객체. Notion API에서 제공하는 메타데이터 형식이어야 합니다.
 * @returns 추출된 메타데이터 객체. 다음 속성을 포함합니다:
 * - `locked`: 블록이 잠겨 있는지 여부 (boolean | undefined)
 * - `page_full_width`: 페이지가 전체 너비로 설정되었는지 여부 (boolean | undefined)
 * - `page_font`: 페이지의 글꼴 설정 (string | undefined)
 * - `page_small_text`: 페이지가 작은 텍스트로 설정되었는지 여부 (boolean | undefined)
 * - `created_time`: 생성 시간 (number)
 * - `last_edited_time`: 마지막 수정 시간 (number)
 */
export default function getMetadata(rawMetadata: any) {
  const metadata = {
    locked: rawMetadata?.format?.block_locked,
    page_full_width: rawMetadata?.format?.page_full_width,
    page_font: rawMetadata?.format?.page_font,
    page_small_text: rawMetadata?.format?.page_small_text,
    created_time: rawMetadata.created_time,
    last_edited_time: rawMetadata.last_edited_time,
  }
  return metadata
}
