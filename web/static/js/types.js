
/**
 * @typedef FriendRequestResponse
 * @property {bigint=} user_id
 * @property {bigint=} friend_user_id
 * @property {boolean} request_accepted
 */

/**
 * @typedef User
 * @property {bigint=} id
 * @property {string} name
 * @property {string} surname
 * @property {string=} birthdate
 * @property {string} gender
 * @property {string} city
 * @property {string} email
 * @property {string=} avatarURL
 * @property {boolean} has_personal_page
 */

/**
 * @typedef PersonalPage
 * @property {bigint=} id
 * @property {bigint=} user_id
 * @property {string} interests
 * @property {string} about
 */

/**
 * @typedef IdResponse
 * @property {bigint=} id
 */

/**
 * @typedef DevLoginOutput
 * @property {string} token
 * @property {string|Date} expires_at
 * @property {User} auth_user
 */

export default undefined
