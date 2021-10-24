var TCGAPI = "a91c497f-ee1d-402a-b493-ceff6564f7bb"

var searchedPokemon;

const decimeterToInches = 3.94;

function getPokemonData(event) {

    searchedPokemon = $("#search-pokemon").val().toLowerCase();

    

    var pokeApiUrl = "https://pokeapi.co/api/v2/pokemon/" + searchedPokemon;

    var TCGURL = "https://api.pokemontcg.io/v2/cards?q=name:" + searchedPokemon + "&pageSize=1";

    fetch(pokeApiUrl)
        .then(function (pokeresponse) {
            return pokeresponse.json();
        })
        .then(function (pokedata) {
            console.log(pokedata);

            fetch(TCGURL)
                .then(function (tcgresponse) { return tcgresponse.json() 
                }).then(function (tcgdata) {

                    var currentDivEl = document.createElement('div');
                    var currentImgEl = document.createElement('img');
                    currentImgEl.setAttribute('src',tcgdata.data[0].images.small);

                    currentDivEl.append(currentImgEl);
                    var infoListEl = document.createElement('ul');
                    var typeListItemEl = document.createElement('li');
                    typeListItemEl.textContent = "Type: " + pokedata.types[0].type.name;
                    infoListEl.append(typeListItemEl);

                    var heightListItemEl = document.createElement('li');
                    var pokeHeight = (pokedata.height * decimeterToInches)
                    heightListItemEl.textContent = "Height: " + pokeHeight + " In or " + Math.floor(pokeHeight/12) + " Ft " + Math.round(pokeHeight % 12) + " In"
                    infoListEl.append(heightListItemEl)

                    currentDivEl.append(infoListEl);
                    $("#current-pokemon").append(currentDivEl);

                })

        })

}
$("#search-button").on("click",function(event){
    console.log("Search Click Success");
    event.preventDefault();
    searchedPokemon = $("#search-pokemon").val();
    $("#current-pokemon").empty();
    getPokemonData(event);
})



// fetch(queryURL)
//     .then(function(response){
//         return response.json()
//     })
//         .then(function(data){
//             console.log(data)

//             imageEl.setAttribute("src",data.sprites.front_shiny);

//         })
// divEl.append(imageEl);

// $("#current-pokemon").append(divEl);


        