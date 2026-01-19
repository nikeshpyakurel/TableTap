import { Alert } from '@mantine/core'

const AlertComponent = ({ title = "Error Occured", message = "An Unexpected Error Occured" }: { title: string, message: string }) => {
    return (
        <Alert variant="light" color="red" title={title}>
            {message}
        </Alert>
    )
}

export default AlertComponent