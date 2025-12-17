import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useSocketContext } from "../../context/SocketContext";
import receiveSound from '../../public/received.mp3';
import sendSound from '../../public/send.mp3';
import Search from "../components/Search";
import UserList from "../components/UserList";
import ChatArea from "../components/ChatArea";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const user=localStorage.getItem('user')
  const {socket,onlineUsers}=useSocketContext();
  const isOnline=onlineUsers.includes(user?JSON.parse(user)._id:null);

  const getOnlineUserStatus=(userId)=>{
    return onlineUsers.includes(userId)?"● Online":"● Offline";
  }

  const getOnlineUserGreen=(userId)=>{
    return onlineUsers.includes(userId) ? <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full flex-shrink-0"></div> : null;
  }

  useEffect(()=>{
    socket?.on('newMessage',(newMessage)=>{
      const notification=new Audio(receiveSound);
      notification.play();
      setMessages((prevMessages)=>[...prevMessages,newMessage]);
    
  });

  return ()=>socket?.off('newMessage');
},[socket,messages,setMessages]);


  useEffect(()=>{

    try {
      const fetchMessages=async()=>{
      const res=await axios.get(`http://localhost:3000/api/message/get/${selectedUser._id}`,{
        headers:{ Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      console.log("res messages",res.data);
      setMessages(res.data.messages);
    }
    if(selectedUser){
      fetchMessages();
    }
      
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Failed to fetch messages");
    }
  }, [selectedUser])
  console.log("messages",messages);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  //  console.log('Auth Token:', token);


  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!user || !token) {
      navigate("/login");
      return;
    }
    setCurrentUser(JSON.parse(user));
    fetchUsers();
    
    // Handle responsive sidebar on desktop
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(true);
      } else if (selectedUser) {
        setSidebarOpen(false);
      }
    };
    
    window.addEventListener("resize", handleResize);
    handleResize();
    
    return () => window.removeEventListener("resize", handleResize);
  }, [navigate, selectedUser]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token")

      const response = await axios.get(
        "http://localhost:3000/api/user/allUsers",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUsers(response.data.users || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

    const handleSendMessage = async (e) => {
      e.preventDefault();
      if (!messageInput.trim() || !selectedUser) return;

      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.post(
          `http://localhost:3000/api/message/send/${selectedUser._id}`,
          {

            message: messageInput,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log('Message sent response:', response.data);

        setMessages([...messages, response.data.messageData]);
        toast.success('Message sent');
        setMessageInput('');
      } catch (error) {
        toast.error('Failed to send message');
      } finally {
        setLoading(false);
      }
    };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  // Filter users based on search term
  const filteredUsers = users.filter((user) =>
    user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Mobile Overlay */}
      {sidebarOpen && selectedUser && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar - Users List */}
      <div
        className={`fixed md:relative z-40 h-screen w-full sm:w-80 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-purple-700 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl font-bold text-white">Messages</h1>
              <p className="text-blue-100 text-xs sm:text-sm truncate">
                {currentUser?.username || "User"}
              </p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-base sm:text-lg font-bold text-blue-600">
                {currentUser?.username?.charAt(0).toUpperCase()}
              </span>
            </div>
            {/* Close button for mobile */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden ml-2 p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <Search users={users} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        

        {/* Users List */}
        <UserList 
          users={users}
          filteredUsers={filteredUsers}
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          setSidebarOpen={setSidebarOpen}
          getOnlineUserGreen={getOnlineUserGreen}
        />
     

        {/* Logout Button */}
        <div className="p-3 sm:p-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          <button
            onClick={handleLogout}
            className="btn btn-outline btn-error btn-sm w-full text-xs sm:text-sm"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <ChatArea 
        loading={loading}
        messageInput={messageInput}
        setMessageInput={setMessageInput}
        handleSendMessage={handleSendMessage}
        selectedUser={selectedUser}
        setSidebarOpen={setSidebarOpen}
        getOnlineUserStatus={getOnlineUserStatus}
        messages={messages}
        messagesEndRef={messagesEndRef}
        currentUser={currentUser}
      />
      
    </div>
  );
};

export default Chat;
