/* eslint-disable jsx-a11y/alt-text */
import { HeaderContainer } from './styles'
import logo from '../../assets/Logo.svg'

export function Header() {
  return (
    <HeaderContainer>
      <img src={logo} />
    </HeaderContainer>
  )
}
