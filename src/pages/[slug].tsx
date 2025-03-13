import Detail from "src/routes/Detail"
import { filterPosts } from "src/libs/utils/notion"
import { CONFIG } from "site.config"
import { NextPageWithLayout } from "../types"
import CustomError from "src/routes/Error"
import { getRecordMap, getPosts } from "src/apis"
import MetaConfig from "src/components/MetaConfig"
import { GetStaticProps } from "next"
import { queryClient } from "src/libs/react-query"
import { queryKey } from "src/constants/queryKey"
import { dehydrate } from "@tanstack/react-query"
import usePostQuery from "src/hooks/usePostQuery"
import { FilterPostsOptions } from "src/libs/utils/notion/filterPosts"

// 게시물 필터링 옵션 설정
// Public 또는 PublicOnDetail 상태이면서 Paper, Post, Page 타입인 게시물만 허용
const filter: FilterPostsOptions = {
  acceptStatus: ["Public", "PublicOnDetail"],
  acceptType: ["Paper", "Post", "Page"],
}

/**
 * 정적 경로 생성 함수
 * 모든 게시물의 경로를 미리 생성합니다.
 */
export const getStaticPaths = async () => {
  // 모든 게시물 가져오기
  const posts = await getPosts()
  // 필터 조건에 맞는 게시물만 필터링
  const filteredPost = filterPosts(posts, filter)

  return {
    // 각 게시물의 slug를 경로로 변환
    paths: filteredPost.map((post) => `/${post.slug}`),
    // true로 설정하여 빌드 시점에 생성되지 않은 페이지에 대한 요청이 들어올 경우 동적으로 생성
    fallback: true,
  }
}

/**
 * 정적 페이지 속성 생성 함수
 * 페이지에 필요한 데이터를 미리 가져옵니다.
 */
export const getStaticProps: GetStaticProps = async (context) => {
  // URL에서 slug 파라미터 추출
  const slug = context.params?.slug as string

  // 모든 게시물 가져오기
  const posts = await getPosts()

  // 피드용 게시물 필터링 및 캐싱
  const feedPosts = filterPosts(posts)
  await queryClient.prefetchQuery(queryKey.posts(), () => feedPosts)

  // 상세 페이지용 게시물 필터링
  const detailPosts = filterPosts(posts, filter)
  // 현재 slug와 일치하는 게시물 찾기
  const postDetail = detailPosts.find((post) => post.slug === slug)

  // 게시물에 대한 Notion 레코드맵 가져오기
  const recordMap = await getRecordMap(postDetail?.id!)

  // 상세 게시물 정보 캐싱
  await queryClient.prefetchQuery(queryKey.post(slug), () => ({
    ...postDetail,
    recordMap,
  }))

  return {
    props: {
      // React Query 상태 직렬화하여 클라이언트에 전달
      dehydratedState: dehydrate(queryClient),
    },
    // 페이지 재생성 시간 설정
    revalidate: CONFIG.revalidateTime,
  }
}

/**
 * 상세 페이지 컴포넌트
 * 게시물의 상세 내용을 표시합니다.
 */
const DetailPage: NextPageWithLayout = () => {
  // 캐시된 게시물 데이터 가져오기
  const post = usePostQuery()

  // 게시물이 없는 경우 에러 페이지 표시
  if (!post) return <CustomError />

  // 메타데이터용 이미지 설정
  const image =
    post.thumbnail ??
    CONFIG.ogImageGenerateURL ??
    `${CONFIG.ogImageGenerateURL}/${encodeURIComponent(post.title)}.png`

  // 게시물 작성일 추출
  const date = post.createdTime || ""

  // 메타데이터 설정
  const meta = {
    title: post.title,
    date: new Date(date).toISOString(),
    image: image,
    description: post.summary || "",
    type: post.type[0],
    url: `${CONFIG.link}/${post.slug}`,
  }

  return (
    <>
      {/* SEO 메타데이터 설정 */}
      <MetaConfig {...meta} />
      {/* 상세 페이지 컴포넌트 렌더링 */}
      <Detail />
    </>
  )
}

/**
 * 페이지 레이아웃 설정
 * 이 페이지는 특별한 레이아웃을 사용하지 않음
 */
DetailPage.getLayout = (page) => {
  return <>{page}</>
}

export default DetailPage
