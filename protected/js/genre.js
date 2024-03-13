
window.onload = async function () {

  const searchParams = new URLSearchParams(location.search);
  const cid = searchParams.get("cid");

  loadCategory(cid);
  //getogenre();
};

async function loadCategory(cid) {
  const resp = await fetch(`/api/movie/categoryWithMovies/${cid}`);
  const categoryList = await resp.json();

  let title = `<h1>${categoryList[0].category}</h1>`;

  let htmlStr = ``;
  for (const categories of categoryList) {
    htmlStr +=
      /*html */
      `<div class="card">
    <img class= "card-img"
    src="${categories.image}" style="width:190px"alt="${categories.film_name}" />
    <div class="description-container">
      <!-- <p>${categories.film_name}</p> -->
    </div>
    <p class="film-name-button" onclick="filmDetail(${categories.film_id})" id="film-${categories.id}">${categories.film_name}</p>
  </div>`;
  }

  //document.querySelector(".categoryName").innerHTML = title;
  document.querySelector(".categoryList").innerHTML = htmlStr;
}

async function filmDetail(fid) {
  window.location.href = `/html/moviedetails.html?id=${fid}`;
}


function signOut() {
  var auth2 = api.auth2.getAuthInstance();
  auth2.signOut().then(function () {

  });
}
