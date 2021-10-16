package handler

import (
	"context"
	"encoding/json"
	"net/http"
	m "social_network/internal/common"
	"social_network/internal/service"
	"strings"
)

//login
func (h *handler) login(w http.ResponseWriter, r *http.Request) {
	var in m.LoginRequest
	defer r.Body.Close()
	if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	out, err := h.Login(r.Context(), &in)
	if err == service.ErrInvalidEmail || err == service.ErrWrongPassword {
		http.Error(w, err.Error(), http.StatusUnprocessableEntity)
		return
	}
	if err == service.ErrUserNotFound {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}
	if err != nil {
		respondErr(w, err)
		return
	}
	respond(w, out, http.StatusOK)
}

//authentication function for router
func (h *handler) withAuth(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		a := r.Header.Get("Authorization")
		if !strings.HasPrefix(a, "Bearer ") {
			next.ServeHTTP(w, r)
			return
		}
		token := a[7:]
		uid, err := h.AuthUserID(token)
		if err != nil {
			http.Error(w, err.Error(), http.StatusUnauthorized)
			return
		}
		ctx := r.Context()
		ctx = context.WithValue(ctx, service.KeyAuthUserID, uid)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

// ------- not used
//authentication function for router
func (h *handler) authUser(
	w http.ResponseWriter, r *http.Request) {
	u, err := h.AuthUser(r.Context())
	if err == service.ErrUnauthenticated {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}
	if err == service.ErrUserNotFound {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}
	if err != nil {
		respondErr(w, err)
		return
	}
	respond(w, u, http.StatusOK)
}
