package service

import (
	"context"
	"database/sql"
	"errors"
	"fmt"

	m "social_network/internal/common"
	"strconv"
	"strings"
	"time"
)

//TODO
const (
	//TokenLifespan until tokens are valid
	TokenLifespan = time.Hour * 24 * 14
	// KeyAuthUserID to use in context
	KeyAuthUserID key = "auth_user_id"
)

const (
	verificationCodeLifespan = time.Minute * 15
	tokenLifespan            = time.Hour * 24 * 14
)

var (
	// ErrUnauthenticated used when there is no authenticated user in context
	ErrUnauthenticated = errors.New("unauthenticated")
)

type key string

//LoginOutput response
type LoginOutput struct {
	Token     string        `json:"token,omitempty"`
	ExpiresAt time.Time     `json:"expires_at,omitempty"`
	AuthUser  m.UserProfile `json:"auth_user,omitempty"`
}

//getting Authenticated User ID from token
func (s *Service) AuthUserID(token string) (int64, error) {
	str, err := s.codec.DecodeToString(token)
	if err != nil {
		return 0, fmt.Errorf("could not decode token: %v", err)
	}
	i, err := strconv.ParseInt(str, 10, 64)
	if err != nil {
		return 0, fmt.Errorf("could not parse auth user id from token: %v", err)
	}
	return i, nil
}

//login low level function
func (s *Service) Login(ctx context.Context, in *m.LoginRequest) (LoginOutput, error) {
	var out LoginOutput

	var email = strings.TrimSpace(in.Email)
	if !rxEmail.MatchString(email) {
		return out, ErrInvalidEmail
	}

	var passwordFromTable string
	query := "SELECT id,name,surname,birthdate,gender,city,email,password,avatar,has_personal_page FROM users WHERE email=?"

	var avatar sql.NullString
	err := s.db.QueryRowContext(ctx, query, email).Scan(
		&out.AuthUser.Id,
		&out.AuthUser.Name,
		&out.AuthUser.Surname,
		&out.AuthUser.Birthdate,
		&out.AuthUser.Gender,
		&out.AuthUser.City,
		&out.AuthUser.Email,
		&passwordFromTable,
		&avatar,
		&out.AuthUser.Has_personal_page,
	)
	if err == sql.ErrNoRows {
		return out, ErrUserNotFound
	}
	if avatar.Valid && len(avatar.String) > 4 {
		out.AuthUser.Avatar = s.origin.String() + "/img/avatars/" + avatar.String
	}
	if err != nil {
		return out, fmt.Errorf("could not query select user: %v", err)
	}
	if !CheckPasswordHash(in.Password, passwordFromTable) {
		return out, ErrWrongPassword
	}
	x, err := s.codec.EncodeToString(strconv.FormatInt(out.AuthUser.Id, 10))
	out.Token = x
	if err != nil {
		return out, fmt.Errorf("could not create token: %v", err)
	}
	out.ExpiresAt = time.Now().Add(TokenLifespan)
	return out, nil
}

//NOT used
//AuthUser from context.
func (s *Service) AuthUser(ctx context.Context) (m.UserProfile, error) {
	var u m.UserProfile
	uid, ok := ctx.Value(KeyAuthUserID).(int64)
	if !ok {
		return u, ErrUnauthenticated
	}

	query := "SELECT name FROM users WHERE id=?"
	err := s.db.QueryRowContext(ctx, query, uid).Scan(&u.Name)
	if err == sql.ErrNoRows {
		return u, ErrUserNotFound
	}
	if err != nil {
		return u, fmt.Errorf("could not query select auth user: %v", err)
	}

	u.Id = uid
	return u, nil
}
