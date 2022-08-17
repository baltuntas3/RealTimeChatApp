import { useState, useEffect,useRef } from 'react';

function Inbox(props) {

    const {key,participants}=props
      
      return (
        <div>
            {key}
         {participants}
        </div>
      );
}

export default Inbox