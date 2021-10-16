//this file provides the router work and REST API
package handler

import (
	"mime"
	"net/http"
	"social_network/internal/service"

	"github.com/matryer/way"
)

type handler struct {
	*service.Service
}

// New makes use of the service to provide an http.Handler with predefined routing.
func New(s *service.Service, inLocalhost bool) http.Handler {

	h := &handler{s}
	api := way.NewRouter()

	//for unauthenticated users
	api.HandleFunc("POST", "/login", h.login)
	api.HandleFunc("POST", "/user", h.createUser)
	api.HandleFunc("GET", "/users/:user_id", h.getUser)
	api.HandleFunc("GET", "/users", h.getUsers)
	api.HandleFunc("GET", "/users_by_interests", h.getUsersByInterests)
	api.HandleFunc("POST", "/user/user_friends", h.userFriendsList)
	api.HandleFunc("POST", "/user/friends_requests", h.friendsRequestsList)
	api.HandleFunc("GET", "/users/:user_id/personal_page", h.getPersonalPage)

	//for authenticated users
	api.HandleFunc("PUT", "/auth_user/avatar", h.updateAvatar)
	api.HandleFunc("POST", "/auth_user/personal_page", h.updatePersonalPage)
	api.HandleFunc("POST", "/auth_user/friend_request", h.friendRequest)
	api.HandleFunc("GET", "/auth_user/who_request_friendship", h.whoRequestMeForFriendship)
	api.HandleFunc("POST", "/auth_user/friend", h.friendApprove)
	api.HandleFunc("GET", "/auth_user/my_friends_user", h.myUserFriendsList)

	// ----- these functions are realized, but not used
	api.HandleFunc("GET", "/auth_user", h.authUser)
	api.HandleFunc("GET", "/auth_user/friend_requests", h.friendsRequestList)
	api.HandleFunc("POST", "/user/friends", h.friendsList)
	api.HandleFunc("GET", "/auth_user/my_friends", h.myFriendsList)
	// --------

	mime.AddExtensionType(".js", "application/javascript; charset=utf-8")

	fs := http.FileServer(&spaFileSystem{http.Dir("web/static")})
	if inLocalhost {
		fs = withoutCache(fs)
	}
	r := way.NewRouter()
	r.Handle("*", "/api...", http.StripPrefix("/api", h.withAuth(api)))
	r.Handle("GET", "/...", fs)
	return r
}
