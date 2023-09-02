
    

$(document).ready(function () {

    closeSideNav()


    $("#search").click(function () {
        showSearchInputs()
        closeSideNav()
    })

    $("#categories").click(function () {
        getCategories()
        closeSideNav()
    })

    $("#ingredients").click(function () {
        getIngredients()
        closeSideNav()
    })

    $("#area").click(function () {
        getArea()
        closeSideNav()
    })


    $("#contact").click(function () {
        showContacts()
        closeSideNav()
    })

    var loadingScreen = $(".loading-screen");
    let rowData = document.querySelector("#rowData");
    let searchContainer = document.querySelector("#searchContainer");
    let submitBtn;

    searchByName("").then(function () {
        loadingScreen.fadeOut(500, function () {
            $("body").css("overflow", "visible").slideDown(1000, function () {
                $("body").css("background-color", "#000");
            });
        });
    });
});

async function fetchDataAndDisplay(category, displayFunction) {
    rowData.innerHTML = "";
    $(".inner-loading-screen").fadeIn(300);

    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?${category}`);
        const data = await response.json();
        displayFunction(data.meals.slice(0, 20));
        $(".inner-loading-screen").fadeOut(300);
    } catch (error) {
        console.error("An error occurred:", error);
    }
}


function openSideNav() {
    $(".side-nav-menu").animate(
        {
            left: 0
        },
        500
    );

    $(".open-close-icon")
        .removeClass("fa-align-justify")
        .addClass("fa-x");

    $(".links li").each(function (i) {
        $(this).animate(
            {
                top: 0
            },
            (i + 5) * 100
        );
    });
}




function closeSideNav() {
    let boxWidth = $(".side-nav-menu .nav-tab").outerWidth();

    $(".side-nav-menu").animate(
        {
            left: -boxWidth
        },
        {
            duration: 500,
            complete: function () {

                $(".open-close-icon").addClass("fa-align-justify").removeClass("fa-x");

                $(".links li").animate(
                    {
                        top: 300
                    },
                    500
                );
            }
        }
    );
}


$(".side-nav-menu i.open-close-icon").click(() => {
    if ($(".side-nav-menu").css("left") == "0px") {
        closeSideNav()
    } else {
        openSideNav()
    }
})




function displayMeals(arr) {
    let box = "";

    for (let i = 0; i < arr.length; i++) {
        box += `
        <div class="col-md-3">
                <div onclick="getMealDetails('${arr[i].idMeal}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                    <img class="w-100" src="${arr[i].strMealThumb}" alt="" srcset="">
                    <div class="meal-layer position-absolute d-flex align-items-center text-black p-2">
                        <h3>${arr[i].strMeal}</h3>
                    </div>
                </div>
        </div>
        `
    }

    rowData.innerHTML = box
}




async function getCategories() {
    rowData.innerHTML = "";
    searchContainer.innerHTML = "";

    $(".inner-loading-screen").fadeIn(300);

    try {
        const response = await fetch("https://www.themealdb.com/api/json/v1/1/categories.php");
        const data = await response.json();

        displayCategories(data.categories);

        $(".inner-loading-screen").fadeOut(300);
    } catch (error) {
        console.error("An error occurred while fetching categories:", error);
    }
}



function displayCategories(arr) {
    const box = arr.map(category => `
        <div class="col-md-3">
            <div onclick="getCategoryMeals('${category.strCategory}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                <img class="w-100" src="${category.strCategoryThumb}" alt="" srcset="">
                <div class="meal-layer position-absolute text-center text-black p-2">
                    <h3>${category.strCategory}</h3>
                    <p>${category.strCategoryDescription.split(" ").slice(0, 20).join(" ")}</p>
                </div>
            </div>
        </div>
    `).join("");

    rowData.innerHTML = box;
}




async function getArea() {
    rowData.innerHTML = "";
    searchContainer.innerHTML = "";

    $(".inner-loading-screen").fadeIn(300);

    try {
        const response = await fetch("https://www.themealdb.com/api/json/v1/1/list.php?a=list");
        const data = await response.json();


        displayArea(data.meals);

        $(".inner-loading-screen").fadeOut(300);
    } catch (error) {
        console.error("An error occurred while fetching area data:", error);
    }
}



function displayArea(arr) {
    const box = arr.map(area => `
        <div class="col-md-3">
            <div onclick="getAreaMeals('${area.strArea}')" class="rounded-2 text-center cursor-pointer">
                <i class="fa-solid fa-house-laptop fa-4x"></i>
                <h3>${area.strArea}</h3>
            </div>
        </div>
    `).join("");

    rowData.innerHTML = box;
}


async function getIngredients() {
    rowData.innerHTML = ""
    $(".inner-loading-screen").fadeIn(300)

    searchContainer.innerHTML = "";

    let respone = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`)
    respone = await respone.json()

    displayIngredients(respone.meals.slice(0, 20))
    $(".inner-loading-screen").fadeOut(300)

}


function displayIngredients(arr) {
    let box = "";

    for (let i = 0; i < arr.length; i++) {
        box += `
        <div class="col-md-3">
                <div onclick="getIngredientsMeals('${arr[i].strIngredient}')" class="rounded-2 text-center cursor-pointer">
                        <i class="fa-solid fa-drumstick-bite fa-4x"></i>
                        <h3>${arr[i].strIngredient}</h3>
                        <p>${arr[i].strDescription.split(" ").slice(0, 20).join(" ")}</p>
                </div>
        </div>
        `
    }

    rowData.innerHTML = box
}


async function getCategoryMeals(category) {
    rowData.innerHTML = "";
    $(".inner-loading-screen").fadeIn(300);

    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
        const data = await response.json();
        displayMeals(data.meals.slice(0, 20));
        $(".inner-loading-screen").fadeOut(300);
    } catch (error) {
        console.error("An error occurred:", error);
    }
}





async function getAreaMeals(area) {
    fetchDataAndDisplay(`a=${area}`, displayMeals);
}

async function getIngredientsMeals(ingredients) {
    fetchDataAndDisplay(`i=${ingredients}`, displayMeals);
}

async function getMealDetails(mealID) {
    closeSideNav();
    rowData.innerHTML = "";
    $(".inner-loading-screen").fadeIn(300);

    searchContainer.innerHTML = "";
    try {
        let response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`);
        response = await response.json();
        displayMealDetails(response.meals[0]);
        $(".inner-loading-screen").fadeOut(300);
    } catch (error) {
        console.error("An error occurred:", error);
    }
}


function displayMealDetails(meal) {

    searchContainer.innerHTML = "";


    let ingredients = ``

    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredients += `<li class="alert alert-info m-2 p-1">${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}</li>`
        }
    }

    let tags = meal.strTags?.split(",")
    if (!tags) tags = []

    let tagsStr = ''
    for (let i = 0; i < tags.length; i++) {
        tagsStr += `
        <li class="alert alert-danger m-2 p-1">${tags[i]}</li>`
    }



    let box = `
    <div class="col-md-4">
                <img class="w-100 rounded-3" src="${meal.strMealThumb}"
                    alt="">
                    <h2>${meal.strMeal}</h2>
            </div>
            <div class="col-md-8">
                <h2>Instructions</h2>
                <p>${meal.strInstructions}</p>
                <h3><span class="fw-bolder">Area : </span>${meal.strArea}</h3>
                <h3><span class="fw-bolder">Category : </span>${meal.strCategory}</h3>
                <h3>Recipes :</h3>
                <ul class="list-unstyled d-flex g-3 flex-wrap">
                    ${ingredients}
                </ul>

                <h3>Tags :</h3>
                <ul class="list-unstyled d-flex g-3 flex-wrap">
                    ${tagsStr}
                </ul>

                <a target="_blank" href="${meal.strSource}" class="btn btn-success">Source</a>
                <a target="_blank" href="${meal.strYoutube}" class="btn btn-danger">Youtube</a>
            </div>`

    rowData.innerHTML = box
}


function showSearchInputs() {
    searchContainer.innerHTML = `
    <div class="row py-4 ">
        <div class="col-md-6 ">
            <input onkeyup="searchByName(this.value)" class="form-control bg-white text-black" type="text" placeholder="Search By Name">
        </div>
        <div class="col-md-6">
            <input onkeyup="searchByFLetter(this.value)" maxlength="1" class="form-control bg-white text-black" type="text" placeholder="Search By First Letter">
        </div>
    </div>`

    rowData.innerHTML = ""
}

async function searchByName(term) {
    closeSideNav()
    rowData.innerHTML = ""
    $(".inner-loading-screen").fadeIn(300)

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
    response = await response.json()

    response.meals ? displayMeals(response.meals) : displayMeals([])
    $(".inner-loading-screen").fadeOut(300)

}



async function searchByFLetter(term) {
    closeSideNav();
    rowData.innerHTML = '';
    // innerLoadingScreen.style.display = 'block';
  
    try {
      if (term === '') term = 'a';
  
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${term}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }


  
      const data = 
      await response.json();
      const meals =
       data.meals || [];
  
      displayMeals(meals);
    } catch (error) {
      console.error('An error occurred:', error);
    } finally {
    //   innerLoadingScreen.style.display = 'none';
    }
  }

function showContacts() {
    rowData.innerHTML = `<div class="contact min-vh-100 d-flex justify-content-center align-items-center">
    <div class="container w-75 text-center">
        <div class="row g-4">
            <div class="col-md-6">
                <input id="nameInput" onkeyup="inputsValidation()" type="text" class="form-control" placeholder="Enter Your Name">
                <div id="nameAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Special characters and numbers not allowed
                </div>
            </div>
            <div class="col-md-6">
                <input id="emailInput" onkeyup="inputsValidation()" type="email" class="form-control " placeholder="Enter Your Email">
                <div id="emailAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Email not valid *Mohye20@gmail.com
                </div>
            </div>
            <div class="col-md-6">
                <input id="phoneInput" onkeyup="inputsValidation()" type="text" class="form-control " placeholder="Enter Your Phone">
                <div id="phoneAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid Phone Number
                </div>
            </div>
            <div class="col-md-6">
                <input id="ageInput" onkeyup="inputsValidation()" type="number" class="form-control " placeholder="Enter Your Age">
                <div id="ageAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid age
                </div>
            </div>
            <div class="col-md-6">
                <input  id="passwordInput" onkeyup="inputsValidation()" type="password" class="form-control " placeholder="Enter Your Password">
                <div id="passwordAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid password *Minimum eight characters, at least one letter and one number:*
                </div>
            </div>
            <div class="col-md-6">
                <input  id="repasswordInput" onkeyup="inputsValidation()" type="password" class="form-control " placeholder="Repassword">
                <div id="repasswordAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid repassword 
                </div>
            </div>
        </div>
        <button id="submitBtn" disabled class="btn btn-outline-danger px-2 mt-3">Submit</button>
    </div>
</div> `
    submitBtn = document.querySelector("#submitBtn")


    document.querySelector("#nameInput").addEventListener("focus", () => {
        nameInputTouched = true
    })

    document.querySelector("#emailInput").addEventListener("focus", () => {
        emailInputTouched = true
    })

    document.querySelector("#phoneInput").addEventListener("focus", () => {
        phoneInputTouched = true
    })

    document.querySelector("#ageInput").addEventListener("focus", () => {
        ageInputTouched = true
    })

    document.querySelector("#passwordInput").addEventListener("focus", () => {
        passwordInputTouched = true
    })

    document.querySelector("#repasswordInput").addEventListener("focus", () => {
        repasswordInputTouched = true
    })



}

let nameInputTouched = false;
let emailInputTouched = false;
let phoneInputTouched = false;
let ageInputTouched = false;
let passwordInputTouched = false;
let repasswordInputTouched = false;




function inputsValidation() {
    if (nameInputTouched) {
        if (nameValidation()) {
            document.querySelector("#nameAlert").classList.replace("d-block", "d-none")

        } else {
            document.querySelector("#nameAlert").classList.replace("d-none", "d-block")

        }
    }
    if (emailInputTouched) {

        if (emailValidation()) {
            document.querySelector("#emailAlert").classList.replace("d-block", "d-none")
        } else {
            document.querySelector("#emailAlert").classList.replace("d-none", "d-block")

        }
    }

    if (phoneInputTouched) {
        if (phoneValidation()) {
            document.querySelector("#phoneAlert").classList.replace("d-block", "d-none")
        } else {
            document.querySelector("#phoneAlert").classList.replace("d-none", "d-block")

        }
    }

    if (ageInputTouched) {
        if (ageValidation()) {
            document.querySelector("ageAlert").classList.replace("d-block", "d-none")
        } else {
            document.querySelector("ageAlert").classList.replace("d-none", "d-block")

        }
    }

    if (passwordInputTouched) {
        if (passwordValidation()) {
            document.querySelector("#passwordAlert").classList.replace("d-block", "d-none")
        } else {
            document.querySelector("#passwordAlert").classList.replace("d-none", "d-block")

        }
    }
    if (repasswordInputTouched) {
        if (repasswordValidation()) {
            document.querySelector("#repasswordAlert").classList.replace("d-block", "d-none")
        } else {
            document.querySelector("#repasswordAlert").classList.replace("d-none", "d-block")

        }
    }


    if (nameValidation() &&
        emailValidation() &&
        phoneValidation() &&
        ageValidation() &&
        passwordValidation() &&
        repasswordValidation()) {
        submitBtn.removeAttribute("disabled")
    } else {
        submitBtn.setAttribute("disabled", true)
    }
}

function nameValidation() {
    return (/^[a-zA-Z ]+$/.test(document.querySelector("#nameInput").value))
}

function emailValidation() {
    return (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(document.querySelector("#emailInput").value))
}

function phoneValidation() {
    return (/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(document.querySelector("phoneInput").value))
}

function ageValidation() {
    return (/^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/.test(document.querySelector("ageInput").value))
}

function passwordValidation() {
    return (/^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/.test(document.querySelector("passwordInput").value))
}

function repasswordValidation() {
    return document.querySelector("repasswordInput").value == document.querySelector("passwordInput").value
}

