
import { doGet,  doPost, request } from '../http.js';
import renderAvatarHTML from './avatar.js';

const template = document.createElement('template')
template.innerHTML = `
<div class="container" id="container">
    <h1>Test Social Net</h1>
    <h1>Personal Page of User</h1>

    <h2></h2>
    <table>
    <tr>
    <td>
    <!-- enctype="multipart/form-data"  -->
    <form id="image_avatar" method="post" enctype="image">

    </form>


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
        <td><input type="text" id="gender_id" placeholder="your gender" autocomplete="on" pattern="[male|female]" value="male"  required></td>   
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

    <tr><td> </td></tr>
    </table>
    <button id="friendship">Offer friendship</button>
    </form>
    </td>
    <td>
        <form id="personal-form" class="personal-form" >
            <p>About me:</p>
            <textarea class="ta" name="textarea" id="personal" placeholder="personal info" rows="22" maxlength="480" value="no personal info"  required></textarea>
            <p>Interests:</p>
            <textarea class="ta" name="textarea_interests" id="interests" placeholder="personal info" rows="22" maxlength="480" value="no interests" required></textarea>
            <button id="changeAbout" >Change</button>
        </form>
    </td>
    </tr>
    </table>
    <div id="friends">
    <p> Friends:  </p>

    </div>
</div>
`

/**
 * @param {{ id: bigint; }} params
 */
export default async function renderUserPersonalPage(params) {

    const user = await fetchUser(params.id)
    const page = /** @type {DocumentFragment} */ (template.content.cloneNode(true))
    const formAvatar_ = /** @type {HTMLFormElement} */ (page.getElementById('image_avatar'))
    formAvatar_.insertAdjacentHTML ('afterend',`${renderAvatarHTML(user)}`)
    const userData = localStorage.getItem('auth_user')
    var me = JSON.parse( userData );   
    const form = /** @type {HTMLFormElement} */ (page.getElementById('registration-form'))

    let inputName =/** @type {HTMLInputElement} */ form.getElementsByTagName('input')[0]
    inputName.value = user['name']
    inputName.readOnly = true
    let inputSurname =/** @type {HTMLInputElement} */ form.getElementsByTagName('input')[1]
    inputSurname.value = user['surname']
    inputSurname.readOnly = true
    let inputBirthday =/** @type {HTMLInputElement} */ form.getElementsByTagName('input')[2]
    inputBirthday.value = user['birthdate']
    inputBirthday.readOnly = true
    let inputGender =/** @type {HTMLInputElement} */ form.getElementsByTagName('input')[3]
    inputGender.value = user['gender']
    inputGender.readOnly = true
    let inputCity =/** @type {HTMLInputElement} */ form.getElementsByTagName('input')[4]
    inputCity.value = user['city']
    inputCity.readOnly = true
    let inputEmail =/** @type {HTMLInputElement} */ form.getElementsByTagName('input')[5]
    inputEmail.value = user['email']
    inputEmail.readOnly = true 
 
    var buttonFr = /** @type {HTMLButtonElement} */ (page.getElementById('friendship'))
    if (me === null || me.id === user.id) {
        inputEmail.style.visibility ='hidden'
        buttonFr.style.visibility = 'hidden'
    }
    else
    {

        var id_user = user.id?.toString()
        var friends =await fetchFriendsRequests(id_user)
        var hasRelation = false
        buttonFr.style.backgroundColor = 'gray'
        if (friends != null){
            for (const fr of friends) { 
                 if (fr.friend_user_id == me.id || fr.user_id == me.id){
                    buttonFr.style.visibility = 'visible'
                    hasRelation = true
                    buttonFr.disabled = true
                    if (fr.request_accepted){
                        buttonFr.textContent = "Friend"
                        buttonFr.style.backgroundColor = 'green'
                    }else{
                        buttonFr.textContent = "friendship offered"
                        buttonFr.style.backgroundColor = 'orange'                   
                    }
                }
            }
        }

        //hack TODO remove
        //const temp = document.createElement('temp')
        var temp = `
        <div id="forHidding">
        <div id="myId_" >${me.id}</div>
        <div id="userId_">${id_user}</div>
        </div>`
        //temp.hidden = true
        form.insertAdjacentHTML('afterend',`${temp}`)
        const divEl = /** @type {HTMLDivElement} */ (page.getElementById('forHidding'))
        divEl.hidden = true

    }
    

    if (user['has_personal_page'] == true){
        try {
            let personal = await getPersonalPage(user['id'])
            // @ts-ignore
            page.getElementById("personal").value = personal['about']
            // @ts-ignore
            page.getElementById("interests").value = personal['interests']           
        } catch (error) {
            // @ts-ignore
            page.getElementById("personal").value = "Error for getting data from server"
            // @ts-ignore
            page.getElementById("interests").value = "Error for getting data from server" 
        }
    }

     form.addEventListener('submit', friendshipRequestFormSubmit)

    //friends
    var friendsList = await userFriends(user['id'].toString())
    var divFr = /** @type {HTMLDivElement} */ (page.getElementById('friends'))
    for (var i in friendsList) {
        const id_ = friendsList[i].id
        var innerHTML = `
        <p><div>
        <span  id='${id_}' class="avatar" data-initial="V" ></span>
        &nbsp &nbsp   ${friendsList[i].surname}&nbsp &nbsp  ${friendsList[i].name} 
        </div></p>
        `
        divFr.insertAdjacentHTML('beforeend', innerHTML);  
    }

    return page
}

/**
 * @param {Event} ev
 */
 async function friendshipRequestFormSubmit(ev) {
    ev.preventDefault()
    const userId = /** @type {HTMLDivElement} */ (document.getElementById('userId_'))
    try {
        await friendsRequests(userId.innerText)
    } catch (error) {
        console.log(error)
    }
    location.reload()
 }


/**
 * @param {bigint} userID
 * @returns {Promise<import('../types.js').PersonalPage>}
 */
 async function getPersonalPage(userID) {
    return doGet(`/api/users/${userID}/personal_page`)
}


/**
 * @param {bigint=} id
 * @returns {Promise<import('../types.js').User>}
 */
 function fetchUser(id) {
    return doGet('/api/users/' + id)
}


/**
 * @returns {Promise<import('../types.js').FriendRequestResponse[]>}
 * @param {string} friend_id
 */
 async function fetchFriendsRequests(friend_id) {
    const resp = await request("POST", '/api/user/friends_requests', { body: { friend_id } });
    return resp.body;
}

/**
 * @returns void
 * @param {string} friend_id
 */
 async function friendsRequests(friend_id) {
    return doPost('/api/auth_user/friend_request', { friend_id })
}

/**
 * @returns {Promise<import("../types.js").User[]>}
 * @param {string} friend_id
 */
 async function userFriends(friend_id) {
    return doPost(`/api/user/user_friends`, { friend_id })
}


