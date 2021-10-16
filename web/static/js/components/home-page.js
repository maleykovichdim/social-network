

const template = document.createElement('template')
template.innerHTML = `
    <div class="container">
        <h1>Timeline</h1>
        <form id="post-form" class="post-form">
            <textarea placeholder="Write something..." maxlength="480" required></textarea>
            <button class="post-form-button" hidden>Publish</button>
        </form>
        <div id="timeline-outlet" class="posts-wrapper"></div>
    </div>
`

export default async function renderHomePage() {

    const page = /** @type {DocumentFragment} */ (template.content.cloneNode(true))
    const postForm = /** @type {HTMLFormElement} */ (page.getElementById('post-form'))
    const postFormTextArea = postForm.querySelector('textarea')
    const postFormButton = postForm.querySelector('button')

    /**
     * @param {Event} ev
     */
    const onPostFormSubmit = async ev => {
        ev.preventDefault()
        postFormTextArea.disabled = true
        postFormButton.disabled = true
    }
    postForm.addEventListener('submit', onPostFormSubmit)
    return page
}


