import { useState } from "react"

import styled from "@emotion/styled"
import { FeedHeader } from "./FeedHeader"
import Footer from "./Footer"
import PostList from "./PostList"
import PinnedPosts from "./PostList/PinnedPosts"
import SearchInput from "./SearchInput"
import TagList from "./TagList"

const HEADER_HEIGHT = 73

type Props = {}

const Feed: React.FC<Props> = () => {
  const [q, setQ] = useState("")

  return (
    <StyledWrapper>
      <div
        className="lt"
        css={{
          height: `calc(100vh - ${HEADER_HEIGHT}px)`,
        }}
      >
        <TagList />
      </div>
      <div className="mid">
        <PinnedPosts q={q} />
        <SearchInput value={q} onChange={(e) => setQ(e.target.value)} />
        <div className="tags">
          <TagList />
        </div>
        <FeedHeader />
        <PostList q={q} />
        <div className="footer">
          <Footer />
        </div>
      </div>
    </StyledWrapper>
  )
}

export default Feed

const StyledWrapper = styled.div`
  grid-template-columns: repeat(12, minmax(0, 1fr));

  padding: 2rem 0;
  display: grid;
  gap: 1.5rem;

  @media (max-width: 768px) {
    display: block;
    padding: 0.5rem 0;
  }

  > .lt {
    display: none;
    overflow: scroll;
    position: sticky;
    grid-column: span 2 / span 2;
    top: ${HEADER_HEIGHT - 10}px;

    scrollbar-width: none;
    -ms-overflow-style: none;
    &::-webkit-scrollbar {
      display: none;
    }

    @media (min-width: 1024px) {
      display: block;
    }
  }

  > .mid {
    grid-column: span 12 / span 12;

    @media (min-width: 1024px) {
      grid-column: span 10 / span 10;
    }

    > .tags {
      display: block;

      @media (min-width: 1024px) {
        display: none;
      }
    }

    > .footer {
      padding-bottom: 2rem;
    }
  }
`
