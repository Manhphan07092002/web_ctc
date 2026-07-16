using System;
using Cubetech.Website.Models;

namespace Cubetech.Website.Common
{
    /// <summary>
    /// Helper class for security and admin role checking
    /// Created to force recompile and fix IsAdmin issue
    /// </summary>
    public static class SecurityHelper
    {
        /// <summary>
        /// Check if user has admin privileges
        /// </summary>
        /// <param name="user">User object</param>
        /// <returns>True if user is admin</returns>
        public static bool IsUserAdmin(User user)
        {
            if (user == null) return false;
            
            // Check admin role based on actual User model properties
            return user.Role == "Admin" || 
                   user.Role == "Administrator" || 
                   user.UserName.ToLower() == "admin" ||
                   user.UserName.ToLower() == "administrator";
        }
        
        /// <summary>
        /// Get current logged in user
        /// </summary>
        /// <returns>Current user or null</returns>
        public static User GetCurrentUser()
        {
            try
            {
                var currentUserName = Cubetech.Website.Common.Utility.GetLoginUser();
                if (string.IsNullOrEmpty(currentUserName))
                {
                    return null;
                }

                var userDAO = new Cubetech.Website.DAO.UserDAO();
                return userDAO.getbyUserName(currentUserName);
            }
            catch
            {
                return null;
            }
        }
        
        /// <summary>
        /// Check if current session user is admin
        /// </summary>
        /// <returns>True if current user is admin</returns>
        public static bool IsCurrentUserAdmin()
        {
            var user = GetCurrentUser();
            return IsUserAdmin(user);
        }
    }
}
