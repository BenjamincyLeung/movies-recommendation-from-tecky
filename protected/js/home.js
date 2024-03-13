//Step 1 (movies -> onclick function + fid)

//Step 2 fetch(`/api/movie/categoryWithMovies/`)

window.onload = async () => {
  console.log("This is Home.js");
  await getFiveLatestCategoryMovies();
};

async function getFiveLatestCategoryMovies() {
  const resp = await fetch("/api/movie/categoryWithMovies");

  const moviesWith3Categories = await resp.json();
  console.log(JSON.stringify(moviesWith3Categories, null, 2));
  let htmlStr1 = ``;
  let htmlStr2 = ``;
  let htmlStr3 = ``;

  for (const film of moviesWith3Categories.firstCategoryFilmsResult) {
    htmlStr1 +=
      /*html */
      `<div class = card>
            <img
            src="${film.image}"
            alt="${film.film_name}"
            style="width:190px"
            />
            <p class="film-name-button" onclick="filmDetail(${film.id})" id="film-${film.id}">${film.film_name}</p>
            </div>
            `;
  }
  for (const film of moviesWith3Categories.secondCategoryFilmsResult) {
    htmlStr2 +=
      /*html */
      `<div class = card>
            <img
            src="${film.image}"
            alt="${film.film_name}"
            style="width:190px"
            />
            <div class="film-name-button" onclick="filmDetail(${film.id})" id="film-${film.id}">${film.film_name}</div>
            </div>
            `;
  }
  for (const film of moviesWith3Categories.thirdCategoryFilmsResult) {
    htmlStr3 +=
      /*html */
      `<div class = card>
            <img
            src="${film.image}"
            alt="${film.film_name}"
            style="width:190px"
            />
            <p class="film-name-button" onclick="filmDetail(${film.id})" id="film-${film.id}">${film.film_name}</p>
            </div>
            `;
  }

  document.querySelector("#first-category").innerHTML = htmlStr1;
  document.querySelector("#second-category").innerHTML = htmlStr2;
  document.querySelector("#third-category").innerHTML = htmlStr3;

  document.querySelector("#category-1").innerHTML =
    moviesWith3Categories.firstCategoryFilmsResult[0].category;
  document.querySelector("#category-2").innerHTML =
    moviesWith3Categories.secondCategoryFilmsResult[0].category;
  document.querySelector("#category-3").innerHTML =
    moviesWith3Categories.thirdCategoryFilmsResult[0].category;
}

async function filmDetail(id) {
  url = `/html/moviedetails.html?id=${id}`;
  document.location.href = url;
}

function signOut() {
  var auth2 = api.auth2.getAuthInstance();
  auth2.signOut().then(function () {
    console.log("User signed out.");
  });
}


  function logout(){ 
    document.querySelector(".link-to-logout").addEventListener('click', async ()=>{ 
        const resp= await fetch("/api/user/logout")
        console.log("logout? ",resp.status) 
        switch(resp.status){ 
            case 200 : 
            console.log("You are not being logout") 
            window.location.href='/'
        }
     
        
    })
}
/* <div class="description-container">
    <p class="film-name-button" onclick="filmDetail(${film.id})" id="film-${film.id}">${film.film_name}</p>
</div> */
