const BASE_URL = "https://lighthouse-user-api.herokuapp.com"
const INDEX_URL = BASE_URL + '/api/v1/users/'
const dataPanel = document.querySelector('#data-panel')
const users = JSON.parse(localStorage.getItem("favoriteUsers")) || []
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')


// function
//渲染頁面出來
function renderUserList(data) {
  let rawHTML = ''
  data.forEach(users => {
    rawHTML += `
      <div class="col-sm-3">
    <div class="mb-2">
      <div class="card" style="width: 18rem;">
        <img src="${users.avatar}" class="card-img-top" alt="poster">
        <div class="card-body">
          <h5 class="card-title">${users.name}</h5>
        </div>
        <div class="card-footer">
   <button class="btn btn-outline-info btn-user-info" data-bs-toggle="modal" data-bs-target="#user-modal" data-id="${users.id}">Info</button>
    <button class="btn btn-outline-danger btn-remove-favorite" data-id="${users.id}">X</button>
  </div>
      </div>
    </div>
  </div>
    `
  })
  dataPanel.innerHTML = rawHTML
}

//渲染userModal的頁面出來
function showUserModal(id) {
  const userTitle = document.querySelector('#user-modal-title')
  const userBirthday = document.querySelector('#user-modal-birthday')
  const userRegion = document.querySelector('#user-modal-region')
  const userEmail = document.querySelector('#user-modal-email')
  const userAvatar = document.querySelector('#user-modal-image')
  axios.get(INDEX_URL + id).then(res => {
    const data = res.data
    userTitle.innerText = data.name + ' ' + data.surname
    userBirthday.innerText = 'Birthday: ' + data.birthday
    userRegion.innerText = 'Region: ' + data.region
    userEmail.innerText = 'Email: ' + data.email
    userAvatar.innerHTML = `
      <img src="${data.avatar}" alt="user-poster" class="img-fluid">
    `
  })
}

//新增移除收藏名單的function
function removeFavorite (id) {
  if (!users) return
  const userIndex = users.findIndex((user) => Number(user.id === id))
  if (userIndex === -1) return
  users.splice(userIndex, 1)
  localStorage.setItem('favoriteUsers', JSON.stringify(users))
  renderUserList(users)
}

//點擊info、+最愛的EventListener
dataPanel.addEventListener('click', function onDataPanelClicked(e) {
  if (e.target.matches('.btn-user-info')) {
    showUserModal(Number(e.target.dataset.id))
  } else if (e.target.matches('.btn-remove-favorite')) {
    removeFavorite(Number(e.target.dataset.id))
  }
})

renderUserList(users)