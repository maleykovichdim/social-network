import { isAuthenticated } from "../auth.js"
import { doPost } from "../http.js"
import renderAvatarHTML from "./avatar.js"

/**
 * @param {import("../types.js").User} user
 */
 export default function renderUser(user, full = false) {
    //const authenticated = isAuthenticated()
    const article = document.createElement("article")
    article.className = "user-profile card"
    article.innerHTML = ` 
    <a href="/users/${user.id}">${renderAvatarHTML(user)}</a>
    <h1 class="user-username">  ${user.surname} ${user.name}</h1>
    `
    return article
}

