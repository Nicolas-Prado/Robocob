import { useMutation } from "@tanstack/react-query"
import { HeaderStyled, HeaderButtonsWrapper, LogoWrapper } from "./styles/Header.styled"
import { StyledButton } from "./styles/Button.styled"

export default function Header(props){

    const logoutMutation = useMutation({
        mutationFn: () => {
            return fetch("http://localhost:21465/api/robocob/logout-session", {
                method: "POST",
                headers: {
                    'Authorization': 'Bearer ' + props.token
                }
            }).then(res => res.json())
        }
    })

    return (
       <HeaderStyled>
            <HeaderButtonsWrapper>
                {props.children}
            </HeaderButtonsWrapper>

            <LogoWrapper />

            {!props?.login &&
            <div>
            <StyledButton onClick={logoutMutation.mutate} barColor={'#9C0707'}>
                Sair
            </StyledButton>
            </div>
            }
            
        </HeaderStyled>
        
    )
}