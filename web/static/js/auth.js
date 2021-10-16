
//TODO exprired 
import { parseJSON } from './lib/json.js';

export function getLocalAuth() {
    const authItem = localStorage.getItem("auth")
    if (authItem === null) {
        return null
    }

    let auth
    try {
        auth = JSON.parse(authItem)
    } catch (_) {
        return null
    }

    if (typeof auth !== "object"
        || auth === null
        || typeof auth.token !== "string"
        || typeof auth.expiresAt !== "string"
        || typeof auth.user !== "object"
        || typeof auth.user === null
        || typeof auth.user.id !== "string"
        || typeof auth.user.name !== "string"
        || !(typeof auth.user.avatarURL === "string" || auth.user.avatarURL === null)) {
        return null
    }

    let expiresAt
    try {
        expiresAt = new Date(auth.expiresAt)
    } catch (_) {
        return null
    }

    if (isNaN(expiresAt.valueOf()) || expiresAt < new Date()) {
        return null
    }

    return {
        token: auth.token,
        expiresAt,
        user: {
            id: auth.user.id,
            name: auth.user.name,
            avatarURL: auth.user.avatarURL,
        }
    }
}



/**
 * @returns {import('./types.js').User}
 */
export function getAuthUser() {
    const authUserRaw = localStorage.getItem('auth_user')
    if (authUserRaw === null) {
        return null
    }
    if (localStorage.getItem('token') === null) {
        return null
    }
    const expiresAtRaw = localStorage.getItem('expires_at')
    if (expiresAtRaw === null) {
        return null
    }
    const expiresAt = new Date(expiresAtRaw)
    if (isNaN(expiresAt.valueOf()) || expiresAt <= new Date()) {
        return null
    }
    try {
        return parseJSON(authUserRaw)
    } catch (_) { }
    return null
}

export function isAuthenticated() {
    return getAuthUser() !== null
}

/**
 * @param {function} fn1
 * @param {function} fn2
 */
export function guard(fn1, fn2) {
    return (...args) => isAuthenticated() ? fn1(...args) : fn2(...args)
}
