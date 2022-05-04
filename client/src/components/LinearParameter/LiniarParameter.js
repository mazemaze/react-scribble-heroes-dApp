import React from 'react'

function LiniarParameter(props) {
    const param = props.parameter;
    const max = props.max;
    const width = (param / max) * 100;
  return (
    <div>
        <div style={{ width: `${width}%`, backgroundColor: 'black', marginBottom: "0.2rem"}}>
            ""
        </div>
    </div>
  )
}

export default LiniarParameter