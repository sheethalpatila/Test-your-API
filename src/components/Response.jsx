
import * as React from 'react';
import Container from '@mui/material/Container';
import '../styles/header.css'
const Response = ({ responseData }) => {

    const [displayHeighthigh, setDisplayHeighthigh] = React.useState(false)

    React.useEffect(() => {
        setDisplayHeighthigh(true)
    }, [displayHeighthigh]);


    return (
        <Container
            maxWidth="xl">
            {responseData && (
                <div className={displayHeighthigh ? "response-display" : null} >
                    <pre>{JSON.stringify(responseData, null, 2)}</pre>
                </div>
            )}
        </Container>
    )
}



export default Response