import { doGet, doPost, request, subscribe } from '../http.js';


const template = document.createElement('template')
template.innerHTML = `
<div class="container" id="container">
    <h1>Test Social Net - My Personal Page</h1>
    <p>Main page:</p>
    <h2></h2>
    <table>
    <tr>
    <td>
    <!-- enctype="multipart/form-data"  -->
    <form id="image_avatar" method="post" enctype="image">
        <div>
            <label for="image_uploads">Choose images to upload avatar (PNG, JPG)</label>
            <input type="file"  id="image_uploads" name="image_uploads" accept="image/png,image/jpeg" > 
        </div>
        <div>
            <button id="photo_upload">Save avatar</button>
        </div>
    </form>
    <img id="imageAvatar" src="" width="80" height="80">

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
    <tr>        
        <td><label for="password">Password:      </label></td>
        <td><input type="password" id="password" placeholder="Password" autocomplete="password" minlength="6" value="" required></td>       
    </tr>
    <tr><td> </td></tr>
    </table>
    <button id="others">SEARCH USERS</button>
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
    <div id="output_friend_requests">
        <p> Friend requests - click + to approve: </p>

    </div>
    <div id="friends">
    <p> Friends:  </p>

    </div>
</div>
`



export default async function renderPersonalPage() {
    const page = /** @type {DocumentFragment} */ (template.content.cloneNode(true))
    const userData = localStorage.getItem('auth_user')
    var user = JSON.parse( userData );   
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
    let inputPassword =/** @type {HTMLInputElement} */ form.getElementsByTagName('input')[6]
    inputPassword.value = user['password'] 
    inputPassword.readOnly = true
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
    let img = /** @type {HTMLImageElement} */ (page.getElementById('imageAvatar'))
    if (user['avatarURL'] && user['avatarURL'].length>3){       
        img.src = user['avatarURL']
        img.style.visibility = "visible"
    }
    else{
        img.style.visibility = "hidden"
    }   
    const formAbout = /** @type {HTMLFormElement} */ (page.getElementById('personal-form'))
    formAbout.addEventListener('submit', onAboutFormSubmit)
    const formAvatar = /** @type {HTMLFormElement} */ (page.getElementById('image_avatar'))
    formAvatar.addEventListener('submit', updateAvatarFormSubmit)
    form.addEventListener('submit', otherUserPage)

    //friendship
    var friendRequests = await fetchUsersWithFriendRequests()
    var divFrReq = /** @type {HTMLDivElement} */ (page.getElementById('output_friend_requests'))
    


    for (var i in friendRequests) {
        const id_ = friendRequests[i].id
        var innerHTML = `
        <p><div>
        <span  id='${id_}' class="avatar" data-initial="+" ></span>
        &nbsp &nbsp   ${friendRequests[i].surname}&nbsp &nbsp  ${friendRequests[i].name} 
        </div></p>
        `
        divFrReq.insertAdjacentHTML('beforeend', innerHTML);  
    }

    var els = page.querySelectorAll(".avatar");
    for (var i = 0; i < els.length; i++) {
        els[i].addEventListener("click", function (e) {
            e.preventDefault()
            approveFriendRequests(e.target.id)
           e.target.parentElement.style.visibility = 'hidden';
        });
    };


    //friends
    var friends = await myFriends()
    var divFr = /** @type {HTMLDivElement} */ (page.getElementById('friends'))
    for (var i in friends) {
        const id_ = friends[i].id
        var innerHTML = `
        <p><div>
        <span  id='${id_}' class="avatar" data-initial="V" ></span>
        &nbsp &nbsp   ${friends[i].surname}&nbsp &nbsp  ${friends[i].name} 
        </div></p>
        `
        divFr.insertAdjacentHTML('beforeend', innerHTML);  
    }    

    return page
}

/**
 * @param {Event} ev
 */
 async function updateAvatarFormSubmit(ev) {
    ev.preventDefault()
    var input = document.getElementById('image_uploads')
    const files = input.files
    if (files === null || files.length !== 1) {
        return
    }
    const avatarFile = files.item(0)
    let headers = new Headers();
    headers.append('Authorization', 'Bearer ' + localStorage.getItem('token'));
    var response = await fetch('/api/auth_user/avatar',
     { method: "PUT", headers: headers, credentials: "include",body: avatarFile,});
    let result = await response.text();
    const av = /** @type {HTMLImageElement} */ (document.getElementById('imageAvatar'))
    av.src = result
    av.style.visibility = 'visible'
 }


/**
 * @param {Event} ev
 */
 async function otherUserPage(ev) {
    ev.preventDefault()
    location.assign('/search')
 }


 /**
 * @param {Event} ev
 */
  async function onAboutFormSubmit(ev) {
    ev.preventDefault() 
    var interests = document.getElementById("interests")
    var about = document.getElementById("personal")
    await updatePersonalPage(interests.value, about.value)
 }



/**
 * @param {bigint} userID
 * @returns {Promise<import('../types.js').PersonalPage>}
 */
 async function getPersonalPage(userID) {
    return doGet(`/api/users/${userID}/personal_page`)
}


 /**
 * @returns {Promise<import('../types.js').IdResponse>}
 * @param {any} interests
 * @param {any} about
 */
 function updatePersonalPage(interests, about) {
    return doPost('/api/auth_user/personal_page', { interests, about })
}


/**
 * @returns {Promise<import("../types.js").User[]>}
 * 
 */
 function fetchUsersWithFriendRequests() {
    return doGet(`/api/auth_user/who_request_friendship`)
}



/**
 * @param {bigint} friend_id
 */
 async function approveFriendRequests(friend_id) {
    return doPost('/api/auth_user/friend', { friend_id })
}

/**
 * @returns {Promise<import("../types.js").User[]>}
 */
 function myFriends() {
    return doGet(`/api/auth_user/my_friends_user`)
}





