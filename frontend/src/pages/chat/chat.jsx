import React from 'react'
import ChatBox from '../../components/chatBox/chatBox'
import SideDrawer from '../../components/sideDrawer/sideDrawer'
import {Box, withDefaultColorScheme} from "@chakra-ui/react";
import MyChat from "../../components/myChats/myChats.jsx"
import { ChatState } from '../../context/userContext.jsx';
export default function chat() {

    const { user }=ChatState();

  return (
    <>
    <div style={{width:"100%"}}>
        
      {user && <SideDrawer/>}
      <Box display="flex" justifyContent="space-between" width="100%" height='91.5vh' p="10px">
    {user && <MyChat/>}
        { user && <ChatBox/>}

      </Box>
    </div>
        
      </>
  )
}
