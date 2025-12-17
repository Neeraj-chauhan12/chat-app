import React from 'react'

const ChatArea = ({loading,messageInput,setMessageInput,handleSendMessage, selectedUser, setSidebarOpen, getOnlineUserStatus ,messages,messagesEndRef,currentUser}) => {
  return (
    <>

    <div className="flex-1 flex flex-col bg-white">
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="p-3 sm:p-4 border-b border-gray-200 bg-white flex items-center justify-between flex-shrink-0 sticky top-0 z-20">
              <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-0">
                {/* Mobile menu button */}
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                
                <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-xs sm:text-base">
                    {selectedUser.username?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-base sm:text-xl font-bold text-gray-900 truncate">
                    {selectedUser.username}
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500">

                    {getOnlineUserStatus(selectedUser._id)}
                    {/* {selectedUser.online ? (
                      <span className="text-green-600">● Online</span>
                    ) : (
                      <span className="text-gray-400">● Offline</span>
                    )} */}
                  </p>
                </div>
              </div>

              {/* Action buttons - hide on very small screens */}
              <div className="hidden sm:flex space-x-1 sm:space-x-2 flex-shrink-0">
                <button className="btn btn-circle btn-ghost btn-sm">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </button>
                <button className="btn btn-circle btn-ghost btn-sm">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-3 sm:space-y-4 bg-gray-50">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <h3 className="text-gray-600 font-semibold text-sm sm:text-base">
                      No messages yet
                    </h3>
                    <p className="text-gray-500 text-xs sm:text-sm">
                      Start the conversation!
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex ${
                        msg.senderId === currentUser?._id
                          ? "justify-end"
                          : "justify-start"
                      } animate-fadeIn`}
                    >
                      <div
                        className={`max-w-xs sm:max-w-md px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base transition-all duration-200 ${
                          msg.senderId === currentUser?._id
                            ? "bg-blue-600 text-white rounded-br-none shadow-md hover:shadow-lg"
                            : "bg-white text-gray-900 rounded-bl-none shadow-sm hover:shadow-md border border-gray-200"
                        }`}
                      >
                        <p className="break-words">{msg.message}</p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Message Input */}
            <div className="p-3 sm:p-6 border-t border-gray-200 bg-white flex-shrink-0">
              <form onSubmit={handleSendMessage} className="flex gap-2 sm:gap-3">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="input input-bordered input-sm sm:input-md flex-1 text-xs sm:text-base"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading || !messageInput.trim()}
                  className="btn btn-primary btn-sm sm:btn-md text-white transition-all duration-200"
                >
                  {loading ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  )}
                </button>
              </form>
            </div>
          </>
        ) : (
          // No User Selected
          <div className="flex items-center justify-center h-full">
            <div className="text-center px-4">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <svg className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">
                No Chat Selected
              </h2>
              <p className="text-gray-600 text-xs sm:text-base">Select a user to start messaging</p>
            </div>
          </div>
        )}
      </div>
      
    </>
  )
}

export default ChatArea
