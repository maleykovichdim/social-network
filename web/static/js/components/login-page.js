import { doPost } from '../http.js';
import { stringifyJSON } from '../lib/json.js';

const template = document.createElement('template')
template.innerHTML = `
    <div class="container" id="container">
        <h1>Test Social Net - Login  </h1>
        <p>Enter login and password for authentication:</p>
        <h2></h2>
        <form id="login-form" class="login-form">
        <ul>
        <li>
            <label for="email">Email:</label>
            <input type="email" id="email" placeholder="Email" autocomplete="email"  value="ivan@gmail.com" required>        
        </li>
        <li>        
            <label for="password">Password:</label>
            <input type="password" id="password" placeholder="Password" autocomplete="password" value="123456" required>       
        </li>
        <li>       
            <button id="login_button">Login</button>   
        </li>
        </ul>
        </form>
        <form id="redirect" class="redirect">
        <p>Click for Registration:</p>
            <button id="registration_button">Registration</button>   
        </form>
        <p>----------------------</p>
    </div>
        
`

export default function renderAccessPage() {
    const page = /** @type {DocumentFragment} */ (template.content.cloneNode(true))
    const loginForm = /** @type {HTMLFormElement} */ (page.getElementById('login-form'))
     const registrationForm = /** @type {HTMLFormElement} */ (page.getElementById('redirect'))
    loginForm.addEventListener('submit', onLoginFormSubmit)
    registrationForm.addEventListener('submit', onRegistrationFormSubmit)
    return page
}

/**
 * @param {Event} ev
 */
 async function onRegistrationFormSubmit(ev) {
    ev.preventDefault()
    location.assign('/add_person')
 }

/**
 * @param {Event} ev
 */
 async function onLoginFormSubmit(ev) {
    ev.preventDefault()
    const form = /** @type {HTMLFormElement} */ (ev.currentTarget)
    const input = form.querySelector('input')
    const input_password = form.getElementsByTagName('input')[1] //document.querySelectorAll('.titanic')[1]
    const button = form.querySelector('button')
    const email = input  .value
    const password = input_password.value

    input.disabled = true
    input_password.disabled = true
    button.disabled = true

    try {
        saveLogin(await login(email, password))//
        location.reload()
    } catch (err) {
        console.error(err)
        if (err.name === 'UserNotFoundError') {
            if (confirm('User not found. Do you want to create an account?')) {
                location.assign('/add_person') 
                //     document.getElementById("login-form").style.visibility = 'hidden';
                //     document.getElementById("registration-form").style.visibility = 'visible';
                // //runRegistrationProgram(email)
            }
            return
        }
        alert(err.message)
        setTimeout(() => {
            input.focus()
        })
    } finally {
        input.disabled = false
        input_password.disabled = false
        button.disabled = false
    }
}

/**
 * @param {import('../types.js').DevLoginOutput} payload
 */
function saveLogin(payload) {
    localStorage.setItem('token', payload.token)
    localStorage.setItem('expires_at', String(payload.expires_at))
    localStorage.setItem('auth_user', stringifyJSON(payload.auth_user))
}

/**
 * @returns {Promise<import('../types.js').DevLoginOutput>}
 * @param {string} email
 * @param {string} [password]
 */
function login(email, password) {
    return doPost('/api/login', { email, password })
}
