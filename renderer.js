const setButton = document.getElementById('btn')
const titleInput = document.getElementById('title')
setButton.addEventListener('click', () => {
  const title = titleInput.value
  window.electronAPI.setTitle(title)
})


const callAPIBtn = document.getElementById('call-api')

callAPIBtn.addEventListener('click', async () => {
  const response = await window.electronAPI.callAPI()
  document.getElementById("api-response").innerText = response
})