//API doc said API key was needed, not sure where though, keeping just in case
var TCGAPI = "a91c497f-ee1d-402a-b493-ceff6564f7bb"
//Variable holds searched pokemon name
var searchedPokemon;
var pokeButtons = [];
var previousPokemonContainer = document.querySelector("#search-history");
//Conversions for API info to Freedom Units (Amurica!)
const decimeterToInches = 3.94;
const hectogramsToPounds = 0.22;

//Function to grab searched pokemon data
function getPokemonData(newPokemon) {
    $('#current-pokemon').text('')
    //Set input value to the searched poekmon variable. Converts to lowercase
    searchedPokemon = newPokemon

    //Build query URL for Poke API
    var pokeApiUrl = "https://pokeapi.co/api/v2/pokemon/" + searchedPokemon;
    //Build query URL for TCG API. Limits to one card per search, or else we get a list of cards for each pokemon
    var TCGURL = "https://api.pokemontcg.io/v2/cards?q=name:" + searchedPokemon + "&pageSize=1";

    savedPokemon(searchedPokemon)
    

    //API call to Poke API first. Note the poke in front of variable names
    fetch(pokeApiUrl)
        .then(function (pokeresponse) {
            if(pokeresponse.status === 404){
                alert("Pokemon name does not exist, check your spelling");
            } 

            
            return pokeresponse.json();
        })
        .then(function (pokedata) {
            console.log(pokedata);
            //API call to TCG API. Note the tcg in front if variable names 
            fetch(TCGURL)
                .then(function (tcgresponse) {return tcgresponse.json() 
                }).then(function (tcgdata) {
                    console.log(tcgdata);

                    //Div to hold the Trading Card Game image
                    var TCGCardDivEl = document.createElement('div');
                    TCGCardDivEl.setAttribute('style', 'display: inline');

                    //Trading Card Game image
                    var currentImgEl = document.createElement('img');
                    currentImgEl.setAttribute('src',tcgdata.data[0].images.small);
                    TCGCardDivEl.append(currentImgEl);
                    TCGCardDivEl.setAttribute('style', 'display: inline');

                    $("#current-pokemon").append(TCGCardDivEl);


                    //Add div element to current-pokemon HTML element
                    var currentDivEl = document.createElement('div');
                    currentDivEl.setAttribute('style', 'display: inline');

                    //Header to show Pokemon name
                    var headerEl = document.createElement('h2');
                    headerEl.setAttribute('id', 'pokeHeader')
                    var pokeName = pokedata.name
                    pokeName = pokeName.charAt(0).toUpperCase() + pokeName.substring(1);
                    headerEl.textContent = pokeName;
                    currentDivEl.append(headerEl);

                    //Sprite image
                    var spriteImgEl = document.createElement('img');
                    var iconSource = pokedata.sprites.front_default
                    spriteImgEl.setAttribute('src',iconSource);
                    currentDivEl.append(spriteImgEl);
                    
                    //Type
                    var infoListEl = document.createElement('ul');
                    var typeListItemEl = document.createElement('li');
                    var pokeType = pokedata.types[0].type.name.toString();
                    pokeType =  pokeType.charAt(0).toUpperCase() + pokeType.substring(1);
                    typeListItemEl.textContent = "Type: " + pokeType;
                    infoListEl.append(typeListItemEl);

                    //Height Cvonerted Decimeter to inches. Total inches to Ft/In
                    var heightListItemEl = document.createElement('li');
                    var pokeHeight = (pokedata.height * decimeterToInches)
                    heightListItemEl.textContent = "Height: " + pokeHeight + " In or " + Math.floor(pokeHeight/12) + " Ft " + Math.round(pokeHeight % 12) + " In"
                    infoListEl.append(heightListItemEl)

                    //Weight Converted hectograms to pounds
                    var weightListItemEl = document.createElement('li');
                    var pokeWeight = (pokedata.weight * hectogramsToPounds);
                    weightListItemEl.textContent = "Weight: " + pokeWeight + " Lbs";
                    infoListEl.append(weightListItemEl);

                    //Potential Move #1
                    var attackListItemEl1 = document.createElement('li');
                    var randomAttackIndex = Math.floor(Math.random() * pokedata.moves.length);
                    var pokeAttack = pokedata.moves[randomAttackIndex].move.name;
                    pokeAttack = pokeAttack.charAt(0).toUpperCase() + pokeAttack.substring(1);
                    attackListItemEl1.textContent = "Potential Move #1: " + pokeAttack;
                    infoListEl.append(attackListItemEl1);

                    //Potenial Move #2
                    var attackListItemEl2 = document.createElement('li');
                    var randomAttackIndex = Math.floor(Math.random() * pokedata.moves.length);
                    var pokeAttack = pokedata.moves[randomAttackIndex].move.name;
                    pokeAttack = pokeAttack.charAt(0).toUpperCase() + pokeAttack.substring(1);
                    attackListItemEl2.textContent = "Potential Move #2: " + pokeAttack;
                    infoListEl.append(attackListItemEl2);

                    //Add to Team Button
                    var addToTeamBtn = document.createElement('button');
                    addToTeamBtn.textContent = "Add to team";
                    addToTeamBtn.setAttribute('type', 'button');
                    addToTeamBtn.setAttribute('id','add-Btn');
                    infoListEl.append(addToTeamBtn);

                    //Event listener to add to team button
                    addToTeamBtn.addEventListener("click", function(event){
                        event.preventDefault();
                        addToTeam();
                    })

                    //Append the whole list to the Div Element
                    currentDivEl.append(infoListEl);
                    //Append new Div element to the current-pokemon HTML section
                    $("#current-pokemon").append(currentDivEl);

                })
            
        })
    
}


//Add to team button. Creates a card and adds to the team
//Lists 4 moves, appends 2 buttons, shuffle moves and remove from team
function addToTeam(){
    var cardCounter = 0;
    const maxTeamSize = 6;
    console.log("Add Button Click Success");
    searchedPokemon = $('#pokeHeader').text().toLowerCase().trim()
    var pokeApiUrl = "https://pokeapi.co/api/v2/pokemon/" + searchedPokemon;

    fetch(pokeApiUrl).then(function (response){
        return response.json()
    }).then(function(data){
        var cardEl = document.createElement("div")
        cardEl.setAttribute("class", "card")
        var pokeName = document.createElement('h2')
        pokeName.textContent = data.name
        cardEl.append(pokeName)

        var cardImgEl = document.createElement("img")
        var imgSource = data.sprites.front_default
        var imgItemEl = document.createElement("li")
        cardEl.setAttribute("id", "pokeCard")
        cardImgEl.setAttribute('src', imgSource)
        cardEl.append(cardImgEl)
        imgItemEl.append(cardEl)
        $('#pokePick').append(imgItemEl)

        var attackList = document.createElement('ul')

        var attackListItemEl1 = document.createElement('li');
        var randomAttackIndex = Math.floor(Math.random() * data.moves.length);
        var pokeAttack1 = data.moves[randomAttackIndex].move.name;
        pokeAttack1 = pokeAttack1.charAt(0).toUpperCase() + pokeAttack1.substring(1);
        attackListItemEl1.textContent = "#1: " + pokeAttack1;
        attackList.append(attackListItemEl1)

        
        var attackListItemEl2 = document.createElement('li');
        var randomAttackIndex = Math.floor(Math.random() * data.moves.length);
        var pokeAttack2 = data.moves[randomAttackIndex].move.name;
        pokeAttack2 = pokeAttack2.charAt(0).toUpperCase() + pokeAttack2.substring(1);
        attackListItemEl2.textContent = "#2: " + pokeAttack2;
        attackList.append(attackListItemEl2)

        
        var attackListItemEl3 = document.createElement('li');
        var randomAttackIndex = Math.floor(Math.random() * data.moves.length);
        var pokeAttack3 = data.moves[randomAttackIndex].move.name;
        pokeAttack3 = pokeAttack3.charAt(0).toUpperCase() + pokeAttack3.substring(1);
        attackListItemEl3.textContent = "#3: " + pokeAttack3;
        attackList.append(attackListItemEl3)

        
        var attackListItemEl4 = document.createElement('li');
        var randomAttackIndex = Math.floor(Math.random() * data.moves.length);
        var pokeAttack4 = data.moves[randomAttackIndex].move.name;
        pokeAttack4 = pokeAttack4.charAt(0).toUpperCase() + pokeAttack4.substring(1);
        attackListItemEl4.textContent = "#4: " + pokeAttack4;
        attackList.append(attackListItemEl4)

        cardEl.append(attackList)

        var removeBtn = document.createElement('button')
        removeBtn.textContent = "Remove"
        removeBtn.addEventListener('click', function(event){
        console.log('Remove Success')
        event.target.parentElement.remove()
        })
        cardEl.append(removeBtn)

        savedTeamCards(data.name, imgSource, pokeAttack1, pokeAttack2, pokeAttack3, pokeAttack4)
        
    })
}

function savedTeamCards(newName, newSprite, move1, move2, move3, move4) {
    var pokeCards = {
        name: newName,
        sprite: newSprite,
        moveOne: move1,
        moveTwo: move2,
        moveThree: move3,
        moveFour: move4
    }

    searchedPokemon = newName
    
            var pokeExists = false

    for(var i =0; i < localStorage.length; i++){
        if(localStorage["card" + i] === pokeCards.name){
            pokeExists = true;
            break;
        }
    }
    if(pokeExists === false){
        localStorage.setItem('pokeCards' + localStorage.length, JSON.stringify(pokeCards));
        }
}

    



$("#search-button").on("click",function(event){
    console.log("Search Click Success");
    event.preventDefault();
    searchedPokemon = $("#search-pokemon").val().toLowerCase().trim();
    $("#current-pokemon").empty();
    getPokemonData(searchedPokemon);
})

$('#search-history').on('click', function(event){
    console.log(event.target.textContent)
    var btnText = event.target.textContent
    if(btnText === ""){
        console.log('nothing')
    }
    else{
        getPokemonData(btnText) 
    }
    
})
var searchHistory = []

function initialLoad(){
    var pokemonsSearchedBefore = localStorage.getItem("searchHistory")
    if(pokemonsSearchedBefore){
        searchHistory = JSON.parse(pokemonsSearchedBefore)
    }
}

initialLoad()
function makeButtons() {
    $('#search-history').text('')
    for (var i = 0; i < searchHistory.length; i++) {
            var newBtnEl = document.createElement("button");
            // var listItemEl = document.createElement('btn')
            searchedPokemon = searchHistory[i]
            if(searchedPokemon){
                newBtnEl.textContent = searchedPokemon
                newBtnEl.setAttribute('id', 'historyBtn')
            
        
                // listItemEl.append(newBtnEl);
        
                previousPokemonContainer.append(newBtnEl);
                console.log(searchedPokemon);
            }
           
            
        }
        console.log($("#search-history").children())
        for(var i = 0; i < $('#search-history').children().length; i++) {
        if($('#search-history').children()[i].textContent == ''){
            $('#search-history').children()[i].remove()
            // console.log($('#search-history').children()[i])
        }
        }
    }    


function savedPokemon (newPokemon) {
    searchedPokemon = newPokemon;

    var pokeApiUrl = "https://pokeapi.co/api/v2/pokemon/" + searchedPokemon;

    fetch(pokeApiUrl).then(function(response){
        if(response.status === 404) {
            console.log('something')
        } else {
            console.log(searchHistory.includes(searchedPokemon))
            if(!searchHistory.includes(searchedPokemon)){
                searchHistory.push(searchedPokemon)
             makeButtons()
             localStorage.setItem("searchHistory", JSON.stringify(searchHistory))
            console.log('something2')
            var pokeExists = false   
            }
        
        }
    }) 
}



makeButtons()



        