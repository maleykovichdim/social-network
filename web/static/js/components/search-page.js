import { doGet } from "../http.js"
import renderList from "./list.js";
import renderUser from "./user-profile.js";
import { navigate } from "../lib/router.js";

const PAGE_SIZE = 3
var search_mode = "Surname"
const template = document.createElement("template")
template.innerHTML = `
    <div class="container">
        <h1>Test Social Net - Search Users by ... </h1>
        <h1 id="change_query_text"  >${search_mode}</h1>
        <p><button id="change_query" >Click for changing type of search param</button></p>
        <form id="search-form" class="search-form">
        <p><div>
            <input type="search" name="q" placeholder="Search..." autocomplete="off" autofocus>
        </form>
        </div></p>
        <div id="search-results-outlet" class="search-results-wrapper users-wrapper"></div>
    </div>
`

export default async function renderSearchPage() {
    const url = new URL(location.toString())
    const searchQuery = url.searchParams.has("q") ? decodeURIComponent(url.searchParams.get("q")).trim() : ""
    const page = /** @type {DocumentFragment} */ (template.content.cloneNode(true))
    // @ts-ignore
    page.getElementById("change_query_text").innerText = search_mode

    var users
    var list
    if (search_mode === "Surname"){
        users = await fetchUsers(searchQuery)//
        list = renderList({
            getID: u => u.id,
            items: users,
            loadMoreFunc: after => fetchUsers(searchQuery, after),
            pageSize: PAGE_SIZE,
            renderItem: renderUser,
        })
    }else{
        users = await fetchUsersByInterests(searchQuery)//
        list = renderList({
            getID: u => u.id,
            items: users,
            loadMoreFunc: after => fetchUsersByInterests(searchQuery, after),
            pageSize: PAGE_SIZE,
            renderItem: renderUser,
        })
    }
    const searchForm = /** @type {HTMLFormElement} */ (page.getElementById("search-form"))
    const searchInput = searchForm.querySelector("input")
    const searchResultsOutlet = page.getElementById("search-results-outlet")

    /**
     * @param {Event} ev
     */
    const onSearchFormSubmit = ev => {
        ev.preventDefault()
        const searchQuery = searchInput.value.trim()
        navigate("/search?q=" + encodeURIComponent(searchQuery))
    }

    searchForm.addEventListener("submit", onSearchFormSubmit)
    searchInput.value = searchQuery
    setTimeout(() => {
        searchInput.focus()
    })
    searchResultsOutlet.appendChild(list.el)

     /**
     * @param {Event} ev
     */
     const changeSearchParam = ev => {
            ev.preventDefault()
            const h1 = (document.getElementById("change_query_text"))
            if (h1.innerText == "Surname"){
                h1.innerText = "Interests"
                search_mode = "Interests"
            }
            else{
                h1.innerText = "Surname"
                search_mode = "Surname"
            }
     }
    const button = /** @type {HTMLButtonElement} */ (page.getElementById("change_query"))
    button.addEventListener("click", changeSearchParam)
    return page
}


/**
 * @param {string} search
 * @param {string=} after
 * @returns {Promise<import("../types.js").User[]>}
 */
function fetchUsers(search, after = "") {
    return doGet(`/api/users?search=${search}&after=${after}&first=${PAGE_SIZE}`)
}

/**
 * @param {string} search
 * @param {string=} after
 * @returns {Promise<import("../types.js").User[]>}
 */
 function fetchUsersByInterests(search, after = "") {
    return doGet(`/api/users_by_interests?search=${search}&after=${after}&first=${PAGE_SIZE}`)
}