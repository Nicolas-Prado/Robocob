import { useMutation } from "@tanstack/react-query"
import { useLocation, useNavigate } from "react-router-dom"
import Header from "./Header"

export default function PaymentSlipSender(props){
    const navigate = useNavigate()
    const location = useLocation()

    const sendFileMutation = useMutation({
        mutationFn: (newFile) => {
            return fetch("http://localhost:21465/api/robocob/send-file-base64", {
                method: "POST",
                body: JSON.stringify(newFile),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + location.state.token
                }
            }).then(res => res.json())
        }
    })

    const sendMessageMutation = useMutation({
        mutationFn: (newAdditionalMessage) => {
            return fetch("http://localhost:21465/api/robocob/send-message", {
                method: "POST",
                body: JSON.stringify(newAdditionalMessage),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + location.state.token
                }
            }).then(res => res.json())
              .then(resJson => console.log(resJson))
        }
    })

    const messageMutation = useMutation({
        mutationFn: (newMessage) => {
            return fetch("http://localhost:8000/api/boleto", {
                method: "POST",
                body: new URLSearchParams({
                    'mensagem_adicional': 'sus',
                    'numero_destino': 'sus',
                    'data_envio': '2023/06/02',
                    'nome_arquivo': 'sus.pdf'
                }),/*(()=>{
                    let newMessageUrl = new URLSearchParams()
                    for(key in newMessage){
                        newMessageUrl.append(key, newMessage[key])
                    }
                    return new URLSearchParams(newMessageUrl)
                })()*/
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                }
            })
        }
    })

    async function sendPaymentSlip(form){
        const pdfFileToBase64 = (file) => {
            return new Promise((resolve, reject) => {
                const fileReader = new FileReader();
                fileReader.readAsDataURL(file);
        
                fileReader.onload = () => {
                    resolve(fileReader.result);
                };
        
                fileReader.onerror = (error) => {
                    reject(error);
                };
            });
        };

        const formJson = {
            phone: form.querySelector('input[name="numero_destino"]').value,
            base64: await pdfFileToBase64(form.querySelector('input[type="file"]').files[0]),
            isGroup: false
        }

        sendFileMutation.mutate(formJson)
    }

    function sendAdditionalMessage(form){
        const formJson = {
            phone: form.querySelector('input[name="numero_destino"]').value,
            message: form.querySelector('input[name="mensagem_adicional"]').value,
            isGroup: false
        }

        sendMessageMutation.mutate(formJson)
    }

    function persistMessage(form){
        const formData = new FormData(form)
        
        formData.append("nome_arquivo", form.querySelector('input[type="file"]').files[0].name)
        formData.delete("boleto")

        const formJson = Object.fromEntries(formData.entries())

        messageMutation.mutate(formJson)
    }
    
    function handleSubmit(event){
        event.preventDefault()

        const form = event.target

        sendPaymentSlip(form)

        sendAdditionalMessage(form)

        persistMessage(form)
    }

    return (
        <>
        <Header>
        <button onClick={() => navigate(-1)}>Go back</button>
        </Header>
        <form onSubmit={handleSubmit}>
            <label htmlFor="numero_destino">Numero destino</label>
            <input type="text" name="numero_destino"/>

            <label htmlFor="mensagem_adicional">Mensagem adicional</label>
            <input type="text" name="mensagem_adicional"/>

            <label htmlFor="boleto">Boleto</label>
            <input type="file" name="boleto" accept="application/pdf"/>
            <button type="submit">Submit</button>
        </form>
        </>
        
    )
}