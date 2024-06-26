import React,{useState} from 'react'
import {
  Box, Radio, Stack,RadioGroup, Tooltip,Button,Text,Avatar,Drawer,useDisclosure, DrawerOverlay,DrawerContent,DrawerHeader,DrawerBody, Input, Spinner,Menu,MenuButton,
MenuList,MenuItem,Select
}  from "@chakra-ui/react";
import { ChevronDownIcon } from '@chakra-ui/icons';
import { ToastContainer, toast } from 'react-toastify';
import axios from '../../axios.js';
import ChatLoading from '../chatLoading/chatLoading';
import UserListItem from '../userListItem/userListItem';
import { ChatState } from '../../context/userContext';
// import ChatState from '../../context/userContext';
export default function sideBox() {
  const [search,setSearch] = useState('')
  const [searchResults,setSearchResults] = useState([])
  const [loading,setLoading] = useState(false)
  const [loadingChat,setLoadingChat] = useState(false)
  const { isOpen, onOpen, onClose } = useDisclosure()
  
  // const {
  //   setSelectedChat,
  //   user,
  //   notification,
  //   setNotification,
  //   chats,
  //   setChats,
  // } = ChatState();
  const {user,setSelectedChat,selectedChat,chats,setChats,status,setStatus}=ChatState();
  const handleSearch = async () => {
    setLoading(true);
    if(search.trim().length===0){
      toast.error("Please enter a valid email")
    }
    const data=await axios().get(`http://localhost:2000/searchUser?email=${search}`, {
      validateStatus: function (status) {
        return status >= 200 && status < 500;
      }
    })
    if(data.status==200){
      setSearchResults(data.data.data)
      console.log(data.data.data);
    }
    else{
      toast.error(data.data.message)
    }
    setLoading(false)
  }
  const accessChat = async (userId) => {
    console.log(userId);
    try{
setLoadingChat(true);

const {data}=await axios().post("http://localhost:2000/createChat",{senderId:user,receiverId:userId})
console.log("Data is",data);
      if (!chats.find((c) => c._id === data._id)) 
        setChats([data.data, ...chats]);
          setSelectedChat(data);
setLoadingChat(false);
console.log(data);
onClose();
    }
    catch(err){
      toast.error(err.message);
    }
  }
  const handleSelectChange = async (value) => {
    setStatus(value);
   
        axios().post("http://localhost:2000/changeStatus", { status: value, userId: user }).then((res) => {
      if(res.status==200){
        toast.success(`Status changed to ${value}`);
      }
  });
}
  return (
    <>
    <Box display="flex" justifyContent="space-between" width="100%" alignItems="center" >
      <Tooltip label="Search for users" hasArrow placement="bottom-end" >
<Button variant="ghost" gap="10px" onClick={onOpen}>
          <i className="fas fa-search"></i>
          <p>Search</p>
</Button>
  </Tooltip>
  <Text fontSize="2xl">
 ChatNow
        
  </Text>
  <div style={{display:"flex" ,gap:"10px"}}>
      <Avatar size="sm" cursor="pointer" name="user" src="https://www.freeiconspng.com/thumbs/profile-icon-png/profile-icon-9.png">
  </Avatar>
          <RadioGroup onChange={handleSelectChange} value={status}>
            <Stack direction='row'>
              <Radio value='available' isChecked={status=="available"}>Available</Radio>
              <Radio value='busy' isChecked={status == "busy"}>Busy</Radio>
            </Stack>
          </RadioGroup>
        </div>
    </Box>
    <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
      <DrawerOverlay></DrawerOverlay> 
      <DrawerContent>
        <DrawerHeader borderBottomWidth="1px"> Search Users</DrawerHeader>
          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input placeholder="Search by email" mr={2} value={search} onChange={(e) => {
                setSearch(e.target.value)
              }}></Input>
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (<ChatLoading></ChatLoading>):
            (searchResults.map((users)=>{
              return(
              <UserListItem key={users._id} user={users}  handleFunction={()=>{
                accessChat(users._id);
              }}></UserListItem>)
            }))}
            {loadingChat && <Spinner ml="auto" display="flex"></Spinner>}

          </DrawerBody>
      </DrawerContent>
      <ToastContainer/>
      
      </Drawer>
      
   </>
  )
}
