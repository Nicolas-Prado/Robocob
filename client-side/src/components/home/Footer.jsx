import { useQuery } from "@tanstack/react-query"
import { StyledFooter } from "../styles/Footer.styled"

export default function Footer(props){
    const hostDeviceQuery = useQuery({
        queryKey: ["hostdevice"],
        queryFn: () => {
            return fetch("http://localhost:21465/api/robocob/host-device", {
                headers: {
                    'Authorization': 'Bearer ' + props.token
                }
            }).then(res => res.json())
        },
        onSuccess: (data) => {
            if(!data.response?.pushname)
                hostDeviceQuery.refetch()
        }
    }) 

    if(hostDeviceQuery.isLoading) return <h1>Loading!</h1>
    if(hostDeviceQuery.isError) return <h1>Error :c</h1>
    return (
        <StyledFooter>
            <h2>{hostDeviceQuery.data.response?.phoneNumber}</h2>
            <ul>
                <li><span>Nome:</span> {hostDeviceQuery.data.response?.pushname}</li>
                <li><span>Plataforma:</span> {hostDeviceQuery.data.response?.platform}</li>
            </ul>
        </StyledFooter>
    )
}