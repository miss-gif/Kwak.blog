import styled from "@emotion/styled"

const NavBar: React.FC = () => {
  // const links = [{ id: 1, name: "About", to: "/about" }]
  return (
    <StyledWrapper className="">
      {/* <ul>
        {links.map((link) => (
          <li key={link.id}>
            <Link href={link.to}>{link.name}</Link>
          </li>
        ))}
      </ul> */}
      <a href="https://kwak-dev.vercel.app/" target="_blank" className="link">
        Kwak.dev
      </a>
    </StyledWrapper>
  )
}

export default NavBar

const StyledWrapper = styled.div`
  flex-shrink: 0;
  ul {
    display: flex;
    flex-direction: row;
    li {
      display: block;
      margin-left: 1rem;
      color: ${({ theme }) => theme.colors.gray11};
    }
  }
  .link {
    color: ${({ theme }) => theme.colors.gray11};
    text-decoration: none;
    &:hover {
      color: ${({ theme }) => theme.colors.gray12};
    }
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    background-color: ${({ theme }) => theme.colors.gray3};
    &:hover {
      background-color: ${({ theme }) => theme.colors.gray4};
    }
  }
`
