import React from 'react'

const UserList = ({ users, filteredUsers, selectedUser, setSelectedUser, setSidebarOpen, getOnlineUserGreen }) => {

  return (
    <>
       <div className="flex-1 overflow-y-auto">
          {users.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <p className="text-sm">No users available</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <p className="font-semibold text-gray-900">No users found</p>
              <p className="text-xs mt-1">Try a different search term</p>
            </div>
          ) : (
            filteredUsers.map((user) => (
              <button
                key={user._id}
                onClick={() => {
                  setSelectedUser(user);
                  if (window.innerWidth < 768) {
                    setSidebarOpen(false);
                  }
                }}
                className={`w-full p-3 sm:p-4 border-b border-gray-100 text-left transition-all duration-200 ${
                  selectedUser?._id === user._id
                    ? "bg-blue-50 border-l-4 border-l-blue-600"
                    : "hover:bg-gray-50 active:bg-gray-100"
                }`}
              >
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className={`w-10  h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0`}>
                    <span className="text-white font-bold text-sm sm:text-base">
                      {user.username?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate text-sm sm:text-base">
                      {user?.username}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500 truncate">
                      {user.email}
                    </p>
                  </div>
                  {/* user.online */}
                
                    <div>{getOnlineUserGreen(user._id)}</div>
                
                </div>
              </button>
            ))
          )}
        </div>
    </>
  )
}

export default UserList
