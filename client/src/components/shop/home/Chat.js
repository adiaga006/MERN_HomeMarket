"use client";
import { FacebookProvider, CustomChat } from 'react-facebook';

const FacebookMsg=()=>{
    return (
      <FacebookProvider appId="1115129526227077" chatSupport>
        <CustomChat pageId="335451149649290" minimized={true}/>
      </FacebookProvider>    
    );
  };
export default FacebookMsg;