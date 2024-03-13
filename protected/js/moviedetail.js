window.onload = async () => {
  await loadMovie();
  await rating();
  await addToCollection();
  await loadRecommendationMovies();
};
const searchParams = new URLSearchParams(location.search);
const fid = searchParams.get("id");

/*SECTION A  -- LOAD MOVIE DEATIL*/
async function loadMovie() {
  const result = await fetch(`/api/movie/detail/${fid}`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const movieItems = await result.json();
  let htmlSTR = "";
  htmlSTR += `
  <div class="video-container">
                <iframe class ="video-screen-size" width="720" height="480"
                src="https://www.youtube.com/embed/tgbNymZ7vqY?controls=0">
            </iframe>
        </div>

        <div class="film-overview">
            <div class= "film-image">
                <img
                    src="  ${movieItems[0]["image"]}"
                    width="220px"
                    alt="  ${movieItems[0]["film_name"]}"
                />
            </div>
            <div class= "description-box">
                <div class="film-name">${movieItems[0]["film_name"]}</div>
                <div class= "description common-wording-style"><span class="title-film">Description:</span> ${movieItems[0]["overview"]}</div>
                <hr>
                <div class="released-date common-wording-style"><span class="title-film">Released Date:</span> ${movieItems[0]["release_date"]}</div>
                <hr>
                <div class="star-rating-system">
                    <div class="rating-wrap">
                        <h2>You like it?</h2>
                        <div class="center">
                            <form id="star-system">
                                <fieldset class="rating">
                                    <input
                                        type="radio"
                                        id="star5"
                                        name="rating"
                                        value="5"
                                    /><label
                                        for="star5"
                                        class="full"
                                        title="Awesome"
                                    ></label>
                                    <input
                                        type="radio"
                                        id="star4"
                                        name="rating"
                                        value="4"
                                    /><label
                                        for="star4"
                                        class="full"
                                        title="Great"
                                    ></label>
                                    <input
                                        type="radio"
                                        id="star3"
                                        name="rating"
                                        value="3"
                                    /><label
                                        for="star3"
                                        class="full"
                                        title="Excellent"
                                    ></label>
                                    <input
                                        type="radio"
                                        id="star2"
                                        name="rating"
                                        value="2"
                                    /><label
                                        for="star2"
                                        class="full"
                                        title="Good"
                                    ></label>
                                    <input
                                        type="radio"
                                        id="star1"
                                        name="rating"
                                        value="1"
                                    /><label
                                        for="star1"
                                        class="full"
                                        title="SOSO"
                                    ></label>
                                </fieldset>
                            </form>
                        </div>
                        <!-- <h4 id="rating-value"></h4> -->
                    </div>
                   
                </div>
                <div class="add-to-watchList-button"><button type="submit"id="add-to-watchList">加入片單</button></div>
            </div>
           
        </div>
   `;
  document.querySelector(".outer-movie-container").innerHTML = htmlSTR;
}

/*SECTION A  -- LOAD MOVIE DEATIL   ENDS */

/*Section B  --RATING SYSTEM */
async function rating() {
  let star = document.querySelectorAll(".rating input");
  let showValue = document.querySelector("#rating-value");
  for (i = 0; i < star.length; i++) {
    star[i].addEventListener("click", async function (event) {
      event.preventDefault;
      const rating = event.target.value;
      const formData = {
        film_id: fid,
        rating: rating,
      };
      const result = await fetch(`/api/movie/rating`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const resp = await result.json();
      if (result.status == 200) {
        alert(resp["message"]);
        return;
      } else if (result.status == 401) {
        alert(`入過分喇 你之前個分數係${resp / 2}`);
      }
    });
  }
  /*Section B  --RATING SYSTEM ENDS*/
}

/*Section C  --ADD TO COLLECTION TABLE*/
async function addToCollection() {
  document.querySelector("#add-to-watchList").addEventListener("click", async (event) => {
    event.preventDefault;

    const formData = {
      film_id: fid,
    };
    const result = await fetch(`/api/movie/WatchRecordRoutes`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    const resp = await result.json();

    if (result.status === 200) {
      addButton = document.querySelector(".add-to-watchList-button");
      addButton.style.color = "#d35230";
      alert("加入左片單了");
      return;
    } else if (result.status === 400) {
      alert("你之前加左喇");
      return;
    }
  });
  /*Section C  --ADD TO COLLECTION TABLE  ENDS*/
}

// SECTION F: movie recommendation by flask; fetch with python
async function loadRecommendationMovies() {
  const resp = await fetch(`/api/movie/recommendation/${fid}`);
  const json = await resp.json();
  const result = JSON.stringify(json);
  const films = eval(result);

  let htmlStr = ``;

  if (resp.status === 200) {
    document.querySelector("#you-may-also-like").innerHTML = "You may Also Like";
    for (const film of films) {
      htmlStr +=
        /*html */
        `<div class = card>
          <img
          src="${film.image}"
          alt="${film.Title}"
          style="width:190px"
          />
          <p class="film-name-button" onclick="filmDetail(${film.film_id})" id="film-${film.film_id}">${film.Title}</p>
          </div>
          `;
    }
  }

  document.querySelector("#recommend-movie").innerHTML = htmlStr;
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
