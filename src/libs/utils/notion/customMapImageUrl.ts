import { Block } from 'notion-types'

// 이미지 URL을 커스텀 매핑하는 함수
export const customMapImageUrl = (url: string, block: Block): string => {
  // URL이 비어있으면 에러를 발생시킴
  if (!url) {
    throw new Error("URL can't be empty")
  }

  // 데이터 URL(data:)은 그대로 반환
  if (url.startsWith('data:')) {
    return url
  }

  // 최신 버전의 Notion은 Unsplash 이미지를 프록시하지 않으므로 그대로 반환
  if (url.startsWith('https://images.unsplash.com')) {
    return url
  }

  try {
    const u = new URL(url)

    // Notion의 secure.notion-static.com 경로와 AWS 호스트를 사용하는 경우 처리
    if (
      u.pathname.startsWith('/secure.notion-static.com') &&
      u.hostname.endsWith('.amazonaws.com')
    ) {
      // URL이 이미 서명된 경우 그대로 사용
      if (
        u.searchParams.has('X-Amz-Credential') &&
        u.searchParams.has('X-Amz-Signature') &&
        u.searchParams.has('X-Amz-Algorithm')
      ) {
        url = u.origin + u.pathname
      }
    }
  } catch {
    // 유효하지 않은 URL은 무시
  }

  // '/images'로 시작하는 경로는 Notion의 기본 도메인을 추가
  if (url.startsWith('/images')) {
    url = `https://www.notion.so${url}`
  }

  // '/image'로 시작하지 않으면 '/image/' 경로를 추가하고 URL을 인코딩
  url = `https://www.notion.so${
    url.startsWith('/image') ? url : `/image/${encodeURIComponent(url)}`
  }`

  // Notion 이미지 URL에 필요한 쿼리 매개변수 추가
  const notionImageUrlV2 = new URL(url)
  let table = block.parent_table === 'space' ? 'block' : block.parent_table
  if (table === 'collection' || table === 'team') {
    table = 'block'
  }
  notionImageUrlV2.searchParams.set('table', table) // 테이블 정보 설정
  notionImageUrlV2.searchParams.set('id', block.id) // 블록 ID 설정
  notionImageUrlV2.searchParams.set('cache', 'v2') // 캐시 버전 설정

  url = notionImageUrlV2.toString()

  return url // 최종 URL 반환
}
