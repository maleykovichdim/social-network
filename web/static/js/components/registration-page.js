import http, { doPost, request } from '../http.js';
import { stringifyJSON } from '../lib/json.js';

const template = document.createElement('template')
template.innerHTML = `
    <div class="container" id="container">
        <h1>Test Social Net - Registration</h1>
        <p>Enter your personal data for registration:</p>
        <h2></h2>

        <form id="registration-form" class="registration-form">
        <table>
        <tr>
            <td><label for="name">Name:      </label></td>
            <td><input type="text" id="name_id" placeholder="your name" autocomplete="on" pattern="[A-Za-z]{2,20}" value="Name"  required></td>
        </tr>
        <tr><td> </td></tr>
        <tr>  
            <td><label for="surname">Surname:          </label></td>
            <td><input type="text" id="surname_id" placeholder="your Surname" autocomplete="on" pattern="[A-Za-z]{2,20}" value="Surname"  required></td>    
        </tr>
        <tr><td> </td></tr>
        <tr>   
            <td><label for="birthday">birthday:      </label></td>
            <td><input type="text" id="birthday_id"  placeholder="YYYY-MM-DD" pattern="(?:19|20)(?:(?:[13579][26]|[02468][048])-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-9])|(?:(?!02)(?:0[1-9]|1[0-2])-(?:30))|(?:(?:0[13578]|1[02])-31))|(?:[0-9]{2}-(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-8])|(?:(?!02)(?:0[1-9]|1[0-2])-(?:29|30))|(?:(?:0[13578]|1[02])-31)))"  autofocus autocomplete="nope" value="1977-10-08" required><td>    
        </tr>
        <tr><td> </td></tr>
        <tr>   
            <td><label for="gender">gender:      </label></td>
            <td><select  id="gender_id" >
                <option value="male" selected="selected">male</option>
                <option value="female">female</option>
            </select></td>
        </tr>
        <tr><td> </td></tr>
        <tr>
            <td><label for="city">City:      </label></td>
            <td><input type="text" id="city_id" placeholder="your city" autocomplete="on" pattern="[A-Za-z]{2,20}" value="City"  required></td>  
        </tr>
        <tr><td> </td></tr>
        <tr>
            <td><label for="email">Email:         </label></td>
            <td><input type="email" id="email" placeholder="Email" autocomplete="email"  value="ivanxxx@gmail.com" required></td>        
        </tr>
        <tr><td> </td></tr>
        <tr>        
            <td><label for="password">Password:      </label></td>
            <td><input type="password" id="password" placeholder="Password" autocomplete="password" minlength="6" value="123456" required></td>       
        </tr>
        <tr><td> </td></tr>
        </table>
        <button>Register</button>
        </form>
    </div>
`

export default function renderRegistrationPage() {
    const page = /** @type {DocumentFragment} */ (template.content.cloneNode(true))
    const registrationForm = /** @type {HTMLFormElement} */ (page.getElementById('registration-form'))
    registrationForm.addEventListener('submit', onRegistrationFormSubmit)
    return page
}

/**
 * @param {Event} ev
 */
async function onRegistrationFormSubmit(ev) {
    ev.preventDefault()
    const form = /** @type {HTMLFormElement} */ (ev.currentTarget)
    const inputName = form.getElementsByTagName('input')[0]
    const name = inputName.value
    const inputSurname = form.getElementsByTagName('input')[1]
    const surname = inputSurname.value
    const inputBirthdate = form.getElementsByTagName('input')[2]
    const birthdate = inputBirthdate.value
    var gender = document.getElementById('gender_id').value 
    const inputCity = form.getElementsByTagName('input')[3]
    const city = inputCity.value
    const inputEmail = form.getElementsByTagName('input')[4]
    const email = inputEmail.value
    const inputPassword = form.getElementsByTagName('input')[5]
    const password = inputPassword.value

    const button = form.querySelector('button')
    inputName.disabled = true
    inputSurname.disabled = true
    inputBirthdate.disabled = true
    //inputGender.disabled = true
    inputCity.disabled = true
    inputEmail.disabled = true
    inputPassword.disabled = true  
    button.disabled = true

    try {
        runRegistrationProgram(name, surname, birthdate, gender, city, email, password)
    } catch (err) {
        console.error(err)
        alert(err.message)
        inputName.focus()
    } finally {
        inputName.disabled = false
        inputSurname.disabled = false
        inputBirthdate.disabled = false
        //inputGender.disabled = false
        inputCity.disabled = false
        inputEmail.disabled = false
        inputPassword.disabled = false   
        button.disabled = false
    }
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
        alert(err.message)
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
 * @param {string} name
 * @param {string} surname
 * @param {string} birthdate
 * @param {string} gender
 * @param {string} city
 * @param {string} password
 */
async function runRegistrationProgram(name, surname, birthdate, gender, city, email, password) {

    try {
        await createUser(name, surname, birthdate, gender, city, email, password)
        saveLogin(await login(email, password))
        location.assign('/')
    } catch (err) {
        console.error(err)
        alert(err.message)
        if (err.name === 'UsernameTakenError') {
        }
    }
}

/**
 * @returns {Promise<import('../types.js').DevLoginOutput>}
 * @param {string} email
 * @param {string} [password]
 */
function login(email, password) {
    return doPost('/api/login', { email, password })
}

/**
 * @param {string} name
 * @param {string} surname
 * @param {string} birthdate
 * @param {string} gender
 * @param {string} city
 * @param {string} email
 * @param {string} password
 * @returns {Promise<void>}
 */
function createUser(name, surname, birthdate, gender, city, email, password) {
    return doPost('/api/user', { name, surname, birthdate, gender, city, email, password })
}
