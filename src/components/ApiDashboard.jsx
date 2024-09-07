import * as React from 'react';
import Header from './Header';
import Response from './Response';

const ApiDashboard = () => {

  const [responseData, setResponseData] = React.useState(null);

  // Callback function to receive data from the child
  const receiveDataFromHeader = (data) => {
    setResponseData(data);
  };

  return (
    <>
      <Header sendDataToResponse={receiveDataFromHeader} />
      {responseData ? <Response responseData={responseData} /> : null}
    </>
  )
}

export default ApiDashboard