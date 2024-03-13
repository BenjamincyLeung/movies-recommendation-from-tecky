window.onload = async () => {
  await chooseCategories();
  await validate();
};

/*SECTION A   -- SING UP  */
document.querySelector("#sign-up-post").addEventListener("submit", async (event) => {
  event.preventDefault();
  console.log("JS連左");
  const form = event.target;
  const formData = {
    username: form["username"].value,
    password: form["password"].value,
    gender: form["gender"].value,
  };

  const res = await fetch("/api/user/signUp", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });
  console.log("resp", res)
  const userId = await res.json();
  console.log("userId", userId)
  /*SECTION A   -- SING UP ENDS  */
  /*SECTION B  -- SING -UP MESSAGE FOR USER   */
  const result = document.querySelector("#message-hide");
  let isChange = false;
  if (res.status === 401) {
    let removal = result.removeAttribute("style");
    result.style.backgroundColor = "#d35230";
    const invalidMessage = (result.innerHTML = "Username already exists");
    isChange = true;
    setTimeout(() => {
      document.location.href = "/signup.html";
    }, 2000);
  } else {
    isChange = true;
  }
  if (res.status == 200 && isChange == true) {
    removal = result.removeAttribute("style");
    const invalidMessage = (result.innerHTML = "Register Successfully");
    isChange = false;
    setTimeout(() => {
      document.location.href = "/";
    }, 2000);
  }
  /*SECTION B  -- SING -UP MESSAGE FOR USER   ENDS*/

  /*SECTION C - FUNC FOR USER TO CHOOSE 3 CATEGORIES */
  const getCategoryId = await fetch("/api/movie/categories");

  const allCateId = await getCategoryId.json();

  const firstChoice = form["first-choice"].value;
  const secondChoice = form["second-choice"].value;
  const thirdChoice = form["third-choice"].value;

  categoriesMap = new Map();

  allCateId.forEach((x) => categoriesMap.set(x.category, x.id));

  let categoryArray = [];
  categoryArray.push(categoriesMap.get(firstChoice));
  categoryArray.push(categoriesMap.get(secondChoice));
  categoryArray.push(categoriesMap.get(thirdChoice));

  const categoryData = [
    {
      id: userId[0]["id"],
      category: categoryArray[0],
    },
    {
      id: userId[0]["id"],
      category: categoryArray[1],
    },
    {
      id: userId[0]["id"],
      category: categoryArray[2],
    },
  ];
  /*SECTION C - FUNC FOR USER TO CHOOSE 3 CATEGORIES  ENDS */
  /*SECTION C 1 INSERT CHOICE INTO CHOOSE3CATEGORIES TABLE */
  const postCategories = await fetch("/api/movie/categories", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(categoryData),
  });
  const getResult = await postCategories.json();
});

async function chooseCategories() {
  const getCategory = await fetch("/api/movie/categories");
  const result = await getCategory.json();

  let htmlstr = "";
  for (const j of result) {
    htmlstr += `
      <option value="${j["category"]}">${j["category"]}</option>
      `;
  }
  document.querySelector("#first-choice-category").innerHTML = htmlstr;
  document.querySelector("#second-choice-category").innerHTML = htmlstr;
  document.querySelector("#third-choice-category").innerHTML = htmlstr;
}

async function validate() {
  var ddl = document.querySelector("#choices-category");
}
