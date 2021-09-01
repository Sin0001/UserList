const BASE_URL = "https://lighthouse-user-api.herokuapp.com"
const INDEX_URL = BASE_URL + '/api/v1/users/'
const dataPanel = document.querySelector('#data-panel')
const USERS_PRE_PAGE = 20
const users = []
let filteredUsers = []
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const paginator = document.querySelector('#paginator')

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
   <button class="btn btn-info btn-user-info" data-bs-toggle="modal" data-bs-target="#user-modal" data-id="${users.id}">Info</button>
    <button class="btn btn-danger btn-add-favorite" data-id="${users.id}">+</button>
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

//加入收藏清單
function addTofavorite(id) {
  const list = JSON.parse(localStorage.getItem("favoriteUsers")) || []
  const user = users.find((user) => Number(user.id) === id)
  console.log(user)
  if (list.some((user) => Number(user.id) === id)) {
    return alert('此人已在我的最愛')
  }
  list.push(user)
  localStorage.setItem("favoriteUsers", JSON.stringify(list))
  alert('成功加入我的最愛')
}

//分頁功能,一次只渲染20筆資料
function getUsersByPage(page) {
  const data = filteredUsers.length ? filteredUsers : users
  const startIndex = (page - 1) * USERS_PRE_PAGE
  return data.slice(startIndex, startIndex + USERS_PRE_PAGE)
}

//分頁功能,渲染paginator
function renderPaginator(amount) {
  const numberOfPage = Math.ceil(amount / USERS_PRE_PAGE)
  let rawHTML = ''
  for (let page = 1; page <= numberOfPage; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`
  }
  paginator.innerHTML = rawHTML
}

//EvnetListener
//搜尋EventListener
searchForm.addEventListener('submit', function onSearchFormSubmitted(e) {
  e.preventDefault()
  const keyWord = searchInput.value.trim().toLocaleLowerCase()
  for (const user of users) {
    if (user.name.toLocaleLowerCase().includes(keyWord)) {
      filteredUsers.push(user)
    }
  }
  if (filteredUsers.length === 0) {
    return alert(`搜尋不到${keyWord}這位朋友!!!`)
  }
  renderPaginator(filteredUsers.length)
  renderUserList(getUsersByPage(1))
})

//點擊info、+最愛的EventListener
dataPanel.addEventListener('click', function onDataPanelClicked(e) {
  if (e.target.matches('.btn-user-info')) {
    showUserModal(Number(e.target.dataset.id))
  } else if (e.target.matches('.btn-add-favorite')) {
    addTofavorite(Number(e.target.dataset.id))
  }
})

//點擊頁數切換渲染畫面的EventListener
paginator.addEventListener('click', function onPaginatorClicked(e) {
  if (e.target.tagName !== 'A') return
  const page = Number(e.target.dataset.page)
  renderUserList(getUsersByPage(page))
})

//拿API
axios.get(INDEX_URL).then(res => {
  // console.log(res.data.results)
  users.push(...res.data.results)
  renderPaginator(users.length)
  renderUserList(getUsersByPage(1))
})
  .catch((err) => console.log(err))