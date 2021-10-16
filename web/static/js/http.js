import { isAuthenticated, getLocalAuth } from './auth.js';
import { parseJSON, stringifyJSON } from './lib/json.js';
import { isPlainObject } from './utils.js';


/////////////////////
/**
 * @param {string} method
 * @param {string} url
 */
 export function request(method, url, { body = undefined, headers = undefined } = {}) {
    if (!(body instanceof FormData) && !(body instanceof File) && typeof body === "object" && body !== null) {
        body = JSON.stringify(body)
    }
    return fetch(url, {
        method,
        headers: Object.assign(detaultHeaders(), headers),
        credentials: "include",
        body,
    }).then(handleResponse)
}

function detaultHeaders() {
    const auth = getLocalAuth()
    if (auth === null) {
        return {}
    }

    return {
        authorization: "Bearer " + auth.token,
    }
}







/**
 * @param {string} url
 * @param {{[key:string]:string}=} headers
 */
export function doGet(url, headers) {
    return fetch(url, {
        headers: Object.assign(defaultHeaders(), headers),
    }).then(parseResponse)
}

/**
 * @param {string} url
 * @param {{[key:string]:string}=} headers
 */
 export function doGetWithBody(url, body, headers) {
    const init = {
        method: 'GET',
        headers: defaultHeaders(),
    }
    if (isPlainObject(body)) {
        init['body'] = stringifyJSON(body)
        init.headers['content-type'] = 'application/json; charset=utf-8'
    }
    Object.assign(init.headers, headers)
    return fetch(url, init).then(parseResponse)
}



/**
 * @param {string} url
 * @param {{[field:string]:any}=} body
 * @param {{[key:string]:string}=} headers
 */
export function doPost(url, body, headers) {
    const init = {
        method: 'POST',
        headers: defaultHeaders(),
    }
    if (isPlainObject(body)) {
        init['body'] = stringifyJSON(body)
        init.headers['content-type'] = 'application/json; charset=utf-8'
    }
    Object.assign(init.headers, headers)
    return fetch(url, init).then(parseResponse)
}

/**
 * @param {string} url
 * @param {function} cb
 */
export function subscribe(url, cb) {
    if (isAuthenticated()) {
        const _url = new URL(url, location.origin)
        _url.searchParams.set('token', localStorage.getItem('token'))
        url = _url.toString()
    }
    const eventSource = new EventSource(url)
    eventSource.onmessage = ev => {
        try {
            cb(parseJSON(ev.data))
        } catch (_) { }
    }
    return () => {
        eventSource.close()
    }
}

function defaultHeaders() {
    return isAuthenticated() ? {
        authorization: 'Bearer ' + localStorage.getItem('token'),
    } : {}
}

/**
 * @param {Response} res
 * @returns {Promise<any>}
 */
async function parseResponse(res) {
    let body = await res.text()
    try { body = parseJSON(body) } catch (_) { }
    if (!res.ok) {
        const msg = String(body).trim()
        const err = new Error(msg)
        err.name = msg
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join('')
            + 'Error'
        err['statusCode'] = res.status
        err['statusText'] = res.statusText
        err['url'] = res.url
        throw err
    }
    return body
}

export default {
    get: doGet,
    post: doPost,
    subscribe,
}

//////////////////
/**
 * @param {Response} resp
 */
 export function handleResponse(resp) {
    return resp.clone().json().catch(() => resp.text()).then(body => {
        if (!resp.ok) {
            const err = new Error()
            if (typeof body === "string" && body.trim() !== "") {
                err.message = body.trim()
            } else if (typeof body === "object" && body !== null && typeof body.error === "string") {
                err.message = body.error
            } else {
                err.message = resp.statusText
            }
            err.name = err.message
                .split(" ")
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join("")
            if (!err.name.endsWith("Error")) {
                err.name = err.name + "Error"
            }
            err["headers"] = resp.headers
            err["statusCode"] = resp.status
            throw err
        }
        return {
            body,
            headers: resp.headers,
            statusCode: resp.status,
        }
    })
}
