  

class Pet {
    constructor(name, animalType){
        this.name = name;
        this.animalType = animalType;

        this.energy = 50;
        this.fullness = 50;
        this.happiness = 50;

        this.timerID = null; // will be set when timer starts
        this.uiElement = null; // link to this pet's html card
    }
    startTimer(){
        this.timerID = setInterval(() => {
            this.energy -= 15;
            this.fullness -= 15;    
            this.happiness -= 15;

            this.capStats(); // make sure values stay in 0-100 range
            this.checkIfRanAway(); // pet runs away if any stat is 0 or less    
            this.updateDisplay(); // update UI with new values
         }, 10000); // every 10 seconds
        
        }

        capStats(){
            this.energy = Math.min(100, Math.max(0, this.energy));
            this.fullness = Math.min(100, Math.max(0, this.fullness));
            this.happiness = Math.min(100, Math.max(0, this.happiness));
        }

        getImageFor(action) {
            const basePath = `image/${this.animalType.toLowerCase()}`; // base path for images
            return `${basePath}/${action}.gif`; // Construct the image path based on the action and animal type
        }
        
        // Methods for pet actions

        eat() {
            this.fullness += 30;
            this.happiness += 5;
            this.energy -= 15;

            this.capStats(); // make sure values stay in 0-100 range
            this.checkIfRanAway(); // pet runs away if any stat is 0 or less
            this.updateDisplay(); // update UI with new values
            this.logActivity(`${this.name} ate some food!`); // log activity

            // Change to eat GIF
            this.imageEl.src = this.getImageFor('eating'); // change to eating image
            
            stopBackgroundMusic();
            actionSound.currentTime = 0;
            actionSound.play();
        }

        nap() {
            this.energy += 40;
            this.happiness -= 10;
            this.fullness -= 10;

            this.capStats(); // make sure values stay in 0-100 range
            this.checkIfRanAway(); // pet runs away if any stat is 0 or less
            this.updateDisplay(); // update UI with new values
            this.logActivity(`${this.name} took a nap!`); // log activity

             // Change to sleeping GIF
            this.imageEl.src = this.getImageFor('sleeping'); 
            
            stopBackgroundMusic();
            actionSound.currentTime = 0;
            actionSound.play();
        }

        play() {
            this.happiness += 30;
            this.energy -= 10;
            this.fullness -= 10;

            this.capStats(); // make sure values stay in 0-100 range
            this.checkIfRanAway(); // pet runs away if any stat is 0 or less    
            this.updateDisplay(); // update UI with new values
            this.logActivity(`${this.name} played and had fun!`); // log activity

            // Change to play GIF
            this.imageEl.src = this.getImageFor('playing'); // change to playing image
            
            stopBackgroundMusic();
            actionSound.currentTime = 0;
            actionSound.play();
        }

        logActivity(message) {
            const logBox = document.querySelector('#logBox');
            logBox.value += message + '\n'; // append message to log box
        }

        checkIfRanAway() {
            if (this.energy <= 0 || this.fullness <= 0 || this.happiness <= 0){
                clearInterval(this.timerID); // stop the timer
             

                // remove the pet from the UI after displaying a running image
                if (this.uiElement && this.uiElement.parentNode) {
                    // replace the current image with a running dog image
                    this.imageEl.src = this.getImageFor('running'); // change to running image
                                        
                    //remove the running image after 1 second
                    setTimeout(()=> {
                        //  remove the pet card after the running image disappears
                        if (this.uiElement && this.uiElement.parentNode) {
                        this.uiElement.parentNode.removeChild(this.uiElement); // remove the pet card from the UI
                        }
                    }, 1000); 
                    
                }
                
                this.logActivity(`${this.name} has run away due to neglect!`); // log activity
            }
        }

       
        render() {
            const container = document.querySelector('#petContainer');

            // create a new div for the pet -petCard
            const card = document.createElement('div');
            card.classList.add('pet-card');

            // pet name and type
            const title = document.createElement('h3');
            title.innerText = `${this.name} the ${this.animalType}`;

            // stat display
            const stats = document.createElement('p');
            stats.innerText = `Energy: ${this.energy} | Fullness: ${this.fullness} | Happiness: ${this.happiness}`;
            stats.classList.add('pet-stats');

            // buttons
            const eatBtn = document.createElement('button');
            eatBtn.innerText = 'Feed';
            eatBtn.onclick = () => this.eat(); // call eat method on click

            const napBtn = document.createElement('button');
            napBtn.innerText = 'Nap';   
            napBtn.onclick = () => this.nap(); // call nap method on click

            const playBtn = document.createElement('button');
            playBtn.innerText = 'Play'; 
            playBtn.addEventListener('click', () => this.play()); // call play method on click

            this.imageEl = document.createElement('img');
            this.imageEl.src = this.getImageFor('entry'); // default starting image
            this.imageEl.alt = 'Pet Image';
            card.appendChild(this.imageEl);

            // append everything to the card
            card.appendChild(title);
            card.appendChild(stats);    
            card.appendChild(eatBtn);
            card.appendChild(napBtn);
            card.appendChild(playBtn);

            // append the card to the container
            container.appendChild(card);

            // save references to the card and stats for later updates
            this.uiElement = card;
            this.statDisplay = stats;
        }

            updateDisplay() {
                if (this.statDisplay) {
                    let warning = '';

                    if (this.energy <= 20) warning += 'Low Energy! ';
                    if (this.fullness <= 20) warning += 'Hungry! ';
                    if (this.happiness <= 20) warning += 'Sad! ';
                    this.statDisplay.innerText = `Energy: ${this.energy} | Fullness: ${this.fullness} | Happiness: ${this.happiness}\n${warning}`;
                }
            
        }
     
}



// Event listeners for creating a pet
// and handling button clicks

let createPetBtn = document.querySelector('#createPetBtn');
let petNameInput = document.querySelector('#petNameInput');
let animalTypeSelect = document.querySelector('#animalTypeSelect');

let pets = []; // array to hold all pets

createPetBtn.addEventListener('click', () => {
    actionSound.currentTime = 0;
    actionSound.play();

    let name = petNameInput.value.trim();
    let type = animalTypeSelect.value;

    if (!name) {
        alert("Please enter a name for your pet!");
        return;
    }
    if (pets.length >= 4) {
        alert("You can only have 4 pets at a time!");
        return;
    }
    
    let newPet = new Pet(name, type);
    newPet.render(); // render the pet in the UI    
    newPet.startTimer(); // start the pet's timer
    pets.push(newPet); // add the pet to the array
    petNameInput.value = ""; // clear the input field after creating a pet
});

document.getElementById("resetBtn").addEventListener("click", () => {
    resetSound.currentTime = 0;
    resetSound.play();

    pets.forEach(pet => clearInterval(pet.timerID));
    pets.length = 0; // clear the array
    document.getElementById("petContainer").innerHTML = ""; // clear UI
    document.getElementById("logBox").value = "All pets removed.\n";

    restartMusicOnReset(); // restart background music logic
  });


  // Event listener for toggling background music
    const backgroundMusic = document.getElementById("backgroundMusic");
    const actionSound = document.getElementById("actionSound");
    const resetSound = document.getElementById("resetSound");
    const toggleMusicBtn = document.getElementById("toggleMusicBtn");
  
    let musicManuallyToggled = false; 
    let musicStoppedByAction = false; 

    // function to toggle music manually
    toggleMusicBtn.addEventListener("click", () => {
        if (backgroundMusic.paused) {
            backgroundMusic.play();
            musicManuallyToggled = false; 
        } else {
            backgroundMusic.pause();
            musicManuallyToggled = true; 
        }
    });

    // stop the music when player starts playing with pet (whether eat, nap or play  )
    function stopBackgroundMusic() {
        if (!musicManuallyToggled && !musicStoppedByAction) {
            backgroundMusic.pause();
            musicStoppedByAction = true; 
        }
    }

    // restart background music when reset button is clicked
    function restartMusicOnReset() {
        if(!musicManuallyToggled) {
           
            backgroundMusic.currentTime = 0; // reset to start
            backgroundMusic.play(); // play the music again
        }
        musicStoppedByAction = false; 
    }
    