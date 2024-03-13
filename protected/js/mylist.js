window.onload = async () => {
  await getMyMovieList();
};
/*SECTION A -DISPLAY MY MOVIE-LIST (WATCH LIST)*/
async function getMyMovieList() {
  const resp = await fetch(`/api/movie/WatchRecordRoutes`);
  const result = await resp.json();
  let htmlSTR = "";
  for (let myMovie of result) {
    htmlSTR =
      htmlSTR +
      `<div class="card">
    <img 
    src="${myMovie["image"]}" style="width:190px"alt="${myMovie["film_name"]}" />
  
    <p>${myMovie["film_name"]}</p>
    <button type="submit" onclick="deleteMyMovieItem(${myMovie["id"]})">REMOVE</button>
  </div>`;
  }

  document.querySelector("#my-List").innerHTML = htmlSTR;
  /*SECTION A -DISPLAY MY MOVIE-LIST (WATCH LIST)  ENDS*/
}

/*Section A 2 --DELETE MY-MOVIE FROM COLLECTION */
async function deleteMyMovieItem(id) {
  const resp = await fetch(`/api/movie/WatchRecordRoutes/${id}`, {
    method: "DELETE",
  });
  const result = resp.json();
  if (resp.status === 200) {
    await getMyMovieList();
  }
  /*Section A 2 --DELETE MY-MOVIE FROM COLLECTION ENDS */
}


function signOut() {
  var auth2 = api.auth2.getAuthInstance();
  auth2.signOut().then(function () {
      console.log('User signed out.');
  });
}
