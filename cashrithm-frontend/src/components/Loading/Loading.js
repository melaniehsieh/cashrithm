import React from 'react';
import ReactLoading from "react-loading";

/*const style = {
  display: "grid",
  gridTemplateColumns: "30% 80%",
  alignContent: "center",
  justifyContent: "center"
};*/

const Loading = ({type, height, className, width}) => {
  return (
    <div>
      <ReactLoading className={className} type={type} color="#00a55a" height={height} width={width} />
    </div>
  );
};

export default Loading;
