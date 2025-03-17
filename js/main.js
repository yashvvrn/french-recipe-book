document.addEventListener('DOMContentLoaded', function() {
    // Initialize any global functionality
    initializeNavigation();
    initializeCategoryLinks();
    
    // Make sure to randomize featured recipes last to avoid other functions overriding it
    randomizeFeaturedRecipes();
    
    // Function to handle smooth scrolling for navigation links
    function initializeNavigation() {
        const navLinks = document.querySelectorAll('nav a');
        
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                // Only apply to hash links pointing to the same page
                if (this.getAttribute('href').startsWith('#')) {
                    e.preventDefault();
                    const targetId = this.getAttribute('href');
                    const targetElement = document.querySelector(targetId);
                    
                    if (targetElement) {
                        window.scrollTo({
                            top: targetElement.offsetTop - 80, // Offset for header
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    }
    
    // Function to handle category filtering
    function initializeCategoryLinks() {
        const categoryLinks = document.querySelectorAll('.category-link');
        
        categoryLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Get the category name from the parent card's h3 element
                const categoryName = this.closest('.category-card').querySelector('h3').textContent;
                
                // Scroll to the featured recipes section
                const featuredSection = document.getElementById('featured-recipes');
                if (featuredSection) {
                    window.scrollTo({
                        top: featuredSection.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
                
                // Filter recipes by category
                filterRecipesByCategory(categoryName);
            });
        });
    }
    
    // Function to filter and display recipes by category
    function filterRecipesByCategory(category) {
        const recipeCards = document.querySelectorAll('.recipe-card');
        const sectionTitle = document.querySelector('#featured-recipes .section-title');
        
        // Update section title to show we're filtering
        if (sectionTitle) {
            sectionTitle.textContent = category + ' Recipes';
        }
        
        // First hide all recipe cards
        recipeCards.forEach(card => {
            card.style.display = 'none';
        });
        
        // Show recipes based on category
        let visibleCards = [];
        recipeCards.forEach(card => {
            const recipeCategory = card.querySelector('.recipe-meta span:first-child').textContent.trim();
            
            if (category === 'Appetizers' && recipeCategory.includes('Appetizer')) {
                visibleCards.push(card);
            } else if (category === 'Main Courses' && recipeCategory.includes('Main Course')) {
                visibleCards.push(card);
            } else if (category === 'Desserts' && recipeCategory.includes('Dessert')) {
                visibleCards.push(card);
            } else if (category === 'Pastries' && recipeCategory.includes('Pastry')) {
                visibleCards.push(card);
            } else if (category === 'Vegetarian' && recipeCategory.includes('Vegetarian')) {
                visibleCards.push(card);
            }
        });
        
        // Display the filtered cards
        visibleCards.forEach(card => {
            card.style.display = 'block';
        });
    }
    
    // Function to randomly select and display only 3 recipes
    function randomizeFeaturedRecipes() {
        const recipeCards = document.querySelectorAll('.recipe-card');
        const recipeArray = Array.from(recipeCards);
        
        // Hide all recipe cards initially
        recipeArray.forEach(card => {
            card.style.display = 'none';
        });
        
        // Shuffle the array of recipe cards
        for (let i = recipeArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [recipeArray[i], recipeArray[j]] = [recipeArray[j], recipeArray[i]];
        }
        
        // Select the first 3 cards from the shuffled array and display them
        for (let i = 0; i < Math.min(3, recipeArray.length); i++) {
            recipeArray[i].style.display = 'block';
        }
    }
});

// Recipe Step-by-Step Cooking Mode
class RecipeStepGuide {
    constructor(stepsContainer, stepsData) {
        this.stepsContainer = stepsContainer;
        this.stepsData = stepsData;
        this.currentStep = 0;
        this.totalSteps = stepsData.length;
        this.initializeUI();
    }
    
    initializeUI() {
        // Create the step guide container
        this.guideContainer = document.createElement('div');
        this.guideContainer.className = 'step-guide-container';
        
        // Create header with progress
        this.header = document.createElement('div');
        this.header.className = 'step-guide-header';
        
        // Progress indicator
        this.progressContainer = document.createElement('div');
        this.progressContainer.className = 'step-progress';
        
        this.progressBar = document.createElement('div');
        this.progressBar.className = 'progress-bar';
        this.progressBar.style.width = '0%';
        
        this.progressText = document.createElement('div');
        this.progressText.className = 'progress-text';
        this.progressText.textContent = `Step 0 of ${this.totalSteps}`;
        
        this.progressContainer.appendChild(this.progressBar);
        this.progressContainer.appendChild(this.progressText);
        
        // Close button
        this.closeButton = document.createElement('button');
        this.closeButton.className = 'close-guide-btn';
        this.closeButton.innerHTML = '<i class="fas fa-times"></i>';
        this.closeButton.addEventListener('click', this.closeGuide.bind(this));
        
        this.header.appendChild(this.progressContainer);
        this.header.appendChild(this.closeButton);
        
        // Step content area
        this.stepContent = document.createElement('div');
        this.stepContent.className = 'step-content';
        
        // Navigation buttons
        this.navButtons = document.createElement('div');
        this.navButtons.className = 'step-navigation';
        
        this.prevButton = document.createElement('button');
        this.prevButton.className = 'prev-step-btn';
        this.prevButton.textContent = 'Previous Step';
        this.prevButton.disabled = true;
        this.prevButton.addEventListener('click', this.goToPreviousStep.bind(this));
        
        this.nextButton = document.createElement('button');
        this.nextButton.className = 'next-step-btn btn';
        this.nextButton.textContent = 'Start Cooking';
        this.nextButton.addEventListener('click', this.goToNextStep.bind(this));
        
        this.navButtons.appendChild(this.prevButton);
        this.navButtons.appendChild(this.nextButton);
        
        // Assemble the guide container
        this.guideContainer.appendChild(this.header);
        this.guideContainer.appendChild(this.stepContent);
        this.guideContainer.appendChild(this.navButtons);
        
        // Add to the page
        this.stepsContainer.appendChild(this.guideContainer);
        
        // Show introduction
        this.showIntroduction();
    }
    
    showIntroduction() {
        this.stepContent.innerHTML = `
            <div class="step-intro">
                <h3>Ready to start cooking?</h3>
                <p>This interactive guide will walk you through each step of the recipe.</p>
                <p>Click "Start Cooking" when you're ready to begin.</p>
            </div>
        `;
    }
    
    goToNextStep() {
        if (this.currentStep === 0) {
            // First time clicking - change button text
            this.nextButton.textContent = 'Next Step';
        }
        
        if (this.currentStep < this.totalSteps) {
            this.currentStep++;
            this.updateStepDisplay();
            
            // Enable previous button after first step
            if (this.currentStep > 0) {
                this.prevButton.disabled = false;
            }
            
            // Change next button on last step
            if (this.currentStep === this.totalSteps) {
                this.nextButton.textContent = 'Finish';
            }
        } else {
            // Finished all steps
            this.finishGuide();
        }
    }
    
    goToPreviousStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.updateStepDisplay();
            
            // Reset next button text if moving back from last step
            if (this.currentStep < this.totalSteps) {
                this.nextButton.textContent = 'Next Step';
            }
        } else if (this.currentStep === 1) {
            // Going back to introduction
            this.currentStep = 0;
            this.showIntroduction();
            this.prevButton.disabled = true;
            this.nextButton.textContent = 'Start Cooking';
            this.updateProgress();
        }
    }
    
    updateStepDisplay() {
        if (this.currentStep > 0 && this.currentStep <= this.totalSteps) {
            const stepData = this.stepsData[this.currentStep - 1];
            
            this.stepContent.innerHTML = `
                <div class="step-details">
                    <h3>Step ${this.currentStep}</h3>
                    <p>${stepData.instruction}</p>
                    ${stepData.image ? `<img src="${stepData.image}" alt="Step ${this.currentStep}">` : ''}
                    ${stepData.tip ? `<div class="step-tip"><i class="fas fa-lightbulb"></i> <span>${stepData.tip}</span></div>` : ''}
                </div>
            `;
            
            this.updateProgress();
        }
    }
    
    updateProgress() {
        const progressPercentage = (this.currentStep / this.totalSteps) * 100;
        this.progressBar.style.width = `${progressPercentage}%`;
        this.progressText.textContent = `Step ${this.currentStep} of ${this.totalSteps}`;
    }
    
    closeGuide() {
        if (confirm('Are you sure you want to exit the cooking guide? Your progress will be lost.')) {
            this.guideContainer.remove();
            document.querySelector('.recipe-details-container').style.display = 'block';
        }
    }
    
    finishGuide() {
        this.stepContent.innerHTML = `
            <div class="step-completion">
                <h3>Congratulations!</h3>
                <p>You've completed all the steps for this recipe.</p>
                <p>We hope your dish turned out delicious!</p>
                <div class="rating-prompt">
                    <p>How did your dish turn out?</p>
                    <div class="star-rating">
                        <i class="far fa-star" data-rating="1"></i>
                        <i class="far fa-star" data-rating="2"></i>
                        <i class="far fa-star" data-rating="3"></i>
                        <i class="far fa-star" data-rating="4"></i>
                        <i class="far fa-star" data-rating="5"></i>
                    </div>
                </div>
            </div>
        `;
        
        // Set up star rating functionality
        const stars = this.stepContent.querySelectorAll('.star-rating i');
        stars.forEach(star => {
            star.addEventListener('click', function() {
                const rating = this.getAttribute('data-rating');
                stars.forEach(s => {
                    if (s.getAttribute('data-rating') <= rating) {
                        s.className = 'fas fa-star';
                    } else {
                        s.className = 'far fa-star';
                    }
                });
            });
        });
        
        this.nextButton.textContent = 'Close';
        this.nextButton.removeEventListener('click', this.goToNextStep.bind(this));
        this.nextButton.addEventListener('click', this.closeGuide.bind(this));
    }
}

// Function to initialize the step-by-step guide when "Start Preparing" is clicked
function initializeRecipeGuide(recipeSteps) {
    const recipeDetailsContainer = document.querySelector('.recipe-details-container');
    const stepsContainer = document.querySelector('.recipe-steps-container');
    
    if (recipeDetailsContainer && stepsContainer) {
        recipeDetailsContainer.style.display = 'none';
        stepsContainer.style.display = 'block';
        new RecipeStepGuide(stepsContainer, recipeSteps);
    }
}

// This function will be called from individual recipe pages
function loadRecipeSteps(recipeId) {
    // In a real application, this might fetch from an API or database
    // For now, we'll use a simple switch statement with hardcoded steps
    let steps = [];
    
    switch(recipeId) {
        case 'coq-au-vin':
            steps = [
                {
                    instruction: 'Pat the chicken pieces dry and season generously with salt and pepper.',
                    tip: 'Dry chicken will brown better.'
                },
                {
                    instruction: 'In a large Dutch oven, cook the bacon over medium heat until crisp. Remove with a slotted spoon and set aside.',
                    tip: 'Keep the bacon fat in the pot for extra flavor.'
                },
                {
                    instruction: 'Increase heat to medium-high. Working in batches, brown the chicken on all sides, about 5 minutes per batch. Transfer to a plate.',
                    tip: 'Don\'t overcrowd the pot or the chicken will steam instead of brown.'
                },
                {
                    instruction: 'Add onions and carrots to the pot and cook until softened, about 5 minutes.',
                    tip: 'Scrape up any browned bits from the bottom of the pot.'
                },
                {
                    instruction: 'Add garlic and tomato paste, cook for 1 minute until fragrant.',
                    tip: 'Be careful not to burn the garlic.'
                },
                {
                    instruction: 'Add the wine, chicken broth, thyme, bay leaf, and return the bacon to the pot. Bring to a simmer.',
                    tip: 'Use a wooden spoon to scrape up any browned bits from the bottom of the pot.'
                },
                {
                    instruction: 'Return the chicken to the pot, cover, and simmer gently for 25-30 minutes, until chicken is cooked through.',
                    tip: 'Keep the heat low for a gentle simmer.'
                },
                {
                    instruction: 'While the chicken cooks, sauté the mushrooms in butter in a separate pan until golden brown.',
                    tip: 'Don\'t stir the mushrooms too often to allow them to brown properly.'
                },
                {
                    instruction: 'Add the mushrooms to the pot and simmer for an additional 10 minutes.',
                    tip: 'This allows the mushrooms to absorb the flavors of the sauce.'
                },
                {
                    instruction: 'In a small bowl, mix butter and flour to form a paste. Stir into the pot and simmer until sauce thickens, about 5 minutes.',
                    tip: 'This is called a beurre manié and helps thicken the sauce.'
                },
                {
                    instruction: 'Adjust seasoning with salt and pepper. Remove bay leaf and thyme sprigs before serving.',
                    tip: 'Serve with crusty bread or over mashed potatoes.'
                }
            ];
            break;

        case 'french-onion-soup':
            steps = [
                {
                    instruction: 'Slice the onions thinly and evenly.',
                    tip: 'Uniform slices will cook more evenly.'
                },
                {
                    instruction: 'In a large, heavy-bottomed pot, melt the butter with olive oil over medium-low heat.',
                    tip: 'The combination of butter and oil prevents burning.'
                },
                {
                    instruction: 'Add the sliced onions and stir to coat with the butter and oil.',
                    tip: 'Make sure all onions are coated for even caramelization.'
                },
                {
                    instruction: 'Sprinkle with sugar and a pinch of salt, then cook on medium-low heat for 45-60 minutes, stirring occasionally.',
                    tip: 'Be patient - proper caramelization takes time and can\'t be rushed.'
                },
                {
                    instruction: 'When onions are deeply golden brown, add the minced garlic and cook for 1 minute.',
                    tip: 'The garlic adds depth to the flavor but can burn quickly.'
                },
                {
                    instruction: 'Sprinkle flour over the onions and stir for 1-2 minutes.',
                    tip: 'This helps thicken the soup slightly.'
                },
                {
                    instruction: 'Add the white wine and scrape up any browned bits from the bottom of the pot.',
                    tip: 'This deglazing step adds tremendous flavor to the broth.'
                },
                {
                    instruction: 'Pour in the beef stock, add bay leaves and thyme, and bring to a simmer.',
                    tip: 'Use homemade stock if possible for the richest flavor.'
                },
                {
                    instruction: 'Simmer gently for 30 minutes, then season with salt and pepper to taste.',
                    tip: 'Taste and adjust seasoning as needed.'
                },
                {
                    instruction: 'While the soup simmers, slice the baguette into rounds and toast until crisp.',
                    tip: 'You can brush with olive oil before toasting for extra flavor.'
                },
                {
                    instruction: 'Preheat the broiler. Ladle the soup into oven-safe bowls placed on a baking sheet.',
                    tip: 'Make sure your bowls can withstand the heat of the broiler.'
                },
                {
                    instruction: 'Float toasted bread on top of each bowl of soup, then sprinkle generously with grated Gruyère cheese.',
                    tip: 'Cover the entire surface with cheese to prevent the bread from burning.'
                },
                {
                    instruction: 'Broil until cheese is melted, bubbly, and golden brown (2-3 minutes).',
                    tip: 'Watch carefully as broilers can burn the cheese quickly.'
                },
                {
                    instruction: 'Carefully remove from broiler and let cool slightly before serving.',
                    tip: 'The bowls will be extremely hot - warn your guests!'
                }
            ];
            break;
            
        case 'quiche-lorraine':
            steps = [
                {
                    instruction: 'Preheat oven to 375°F (190°C).',
                    tip: 'A properly preheated oven ensures even cooking.'
                },
                {
                    instruction: 'If using store-bought pie crust, let it come to room temperature according to package instructions.',
                    tip: 'Room temperature dough is easier to work with and less likely to crack.'
                },
                {
                    instruction: 'Place the pie crust in a 9-inch pie dish, pressing gently into the bottom and sides.',
                    tip: 'Don\'t stretch the dough or it will shrink during baking.'
                },
                {
                    instruction: 'Prick the bottom of the crust with a fork several times.',
                    tip: 'This prevents the crust from bubbling up during baking.'
                },
                {
                    instruction: 'Line the crust with parchment paper and fill with pie weights or dried beans.',
                    tip: 'This blind baking step ensures a crisp bottom crust.'
                },
                {
                    instruction: 'Bake for 15 minutes, then remove the weights and parchment and bake for another 5 minutes until just starting to color.',
                    tip: 'The crust should be partially baked but not fully browned.'
                },
                {
                    instruction: 'While the crust is baking, cook the diced bacon in a skillet over medium heat until crisp.',
                    tip: 'Drain on paper towels to remove excess fat.'
                },
                {
                    instruction: 'In the same skillet, sauté the chopped onion until translucent.',
                    tip: 'The bacon fat adds flavor to the onions.'
                },
                {
                    instruction: 'In a large bowl, whisk together eggs, heavy cream, salt, pepper, and nutmeg.',
                    tip: 'Make sure the eggs and cream are well combined for a smooth custard.'
                },
                {
                    instruction: 'Sprinkle the bacon, onion, and grated cheese evenly over the bottom of the par-baked crust.',
                    tip: 'This ensures even distribution of fillings.'
                },
                {
                    instruction: 'Pour the egg mixture over the fillings.',
                    tip: 'Pour slowly to avoid disturbing the arrangement of fillings.'
                },
                {
                    instruction: 'Bake for 35-40 minutes, until the center is just set but still slightly jiggly.',
                    tip: 'The quiche will continue to set as it cools.'
                },
                {
                    instruction: 'Let cool for 10-15 minutes before slicing.',
                    tip: 'This resting period allows for cleaner slices.'
                },
                {
                    instruction: 'Garnish with chopped fresh chives before serving.',
                    tip: 'Serve warm or at room temperature for the best flavor.'
                }
            ];
            break;
            
        case 'escargot':
            steps = [
                {
                    instruction: 'Preheat oven to 400°F (200°C).',
                    tip: 'A hot oven ensures the butter will bubble nicely.'
                },
                {
                    instruction: 'Drain and rinse the canned snails thoroughly.',
                    tip: 'Rinsing removes any tinny flavor from the can.'
                },
                {
                    instruction: 'In a bowl, combine softened butter, minced garlic, chopped parsley, minced shallot, lemon juice, salt, pepper, and nutmeg.',
                    tip: 'Make sure the butter is soft but not melted for the best texture.'
                },
                {
                    instruction: 'Mix all ingredients until well combined to create the garlic-herb butter.',
                    tip: 'You can use a food processor for a smoother consistency.'
                },
                {
                    instruction: 'If using escargot dishes, place a small amount of the garlic-herb butter in each cavity.',
                    tip: 'This creates a flavorful base for the snails.'
                },
                {
                    instruction: 'Place one snail in each cavity.',
                    tip: 'If you don\'t have escargot dishes, you can use a small baking dish.'
                },
                {
                    instruction: 'Top each snail with a generous amount of the remaining garlic-herb butter.',
                    tip: 'Be generous - the butter is the star of this dish!'
                },
                {
                    instruction: 'Place the escargot dishes on a baking sheet to catch any overflow.',
                    tip: 'The butter will bubble and may spill over during baking.'
                },
                {
                    instruction: 'Bake for 10-12 minutes until the butter is bubbling and slightly browned.',
                    tip: 'Watch carefully to prevent burning the garlic.'
                },
                {
                    instruction: 'While the escargots are baking, slice the baguette and toast lightly.',
                    tip: 'The bread is essential for soaking up the delicious butter.'
                },
                {
                    instruction: 'Serve immediately while hot, with sliced baguette on the side.',
                    tip: 'Provide small forks or picks for removing the snails from their shells.'
                }
            ];
            break;
            
        case 'ratatouille':
            steps = [
                {
                    instruction: 'Preheat the oven to 375°F (190°C).',
                    tip: 'Make sure your oven is fully preheated before adding the dish.'
                },
                {
                    instruction: 'Cut all vegetables into approximately 1/4-inch thick slices.',
                    tip: 'Try to cut all vegetables to a similar thickness for even cooking.'
                },
                {
                    instruction: 'Heat 2 tablespoons of olive oil in a large skillet over medium heat. Add onions and bell peppers, cook until softened, about 5 minutes.',
                    tip: 'Don\'t brown the vegetables at this stage, just soften them.'
                },
                {
                    instruction: 'Add garlic and cook for another minute until fragrant.',
                    tip: 'Be careful not to burn the garlic as it can become bitter.'
                },
                {
                    instruction: 'Add crushed tomatoes, thyme, and bay leaf. Simmer for 10 minutes until slightly thickened.',
                    tip: 'This creates a flavorful base for your ratatouille.'
                },
                {
                    instruction: 'Transfer the tomato mixture to a baking dish. Arrange the sliced zucchini, eggplant, and tomatoes in an alternating pattern on top.',
                    tip: 'Create a beautiful pattern by slightly overlapping the vegetable slices.'
                },
                {
                    instruction: 'Drizzle with remaining olive oil and sprinkle with herbs de Provence, salt, and pepper.',
                    tip: 'Be generous with the herbs for authentic French flavor.'
                },
                {
                    instruction: 'Cover with foil and bake for 40 minutes.',
                    tip: 'The foil helps steam the vegetables and keep them moist.'
                },
                {
                    instruction: 'Remove foil and bake for an additional 20 minutes until vegetables are tender and slightly caramelized on top.',
                    tip: 'This final uncovered baking gives the dish a beautiful roasted appearance.'
                },
                {
                    instruction: 'Let rest for 10 minutes before serving.',
                    tip: 'Ratatouille tastes even better at room temperature or the next day.'
                },
                {
                    instruction: 'Garnish with fresh basil leaves and serve.',
                    tip: 'Serve as a main dish with crusty bread or as a side with grilled meat or fish.'
                }
            ];
            break;
            
        case 'bouillabaisse':
            steps = [
                {
                    instruction: 'Prepare all your seafood: clean the fish and cut into 2-inch chunks, clean the shellfish.',
                    tip: 'Fresh seafood is essential for authentic flavor.'
                },
                {
                    instruction: 'Heat olive oil in a large pot over medium heat. Add leeks, onion, and fennel, and cook until softened, about 5 minutes.',
                    tip: 'Don\'t brown the vegetables, just soften them.'
                },
                {
                    instruction: 'Add garlic and cook for another minute until fragrant.',
                    tip: 'Be careful not to burn the garlic.'
                },
                {
                    instruction: 'Stir in tomato paste and cook for 1-2 minutes.',
                    tip: 'This helps develop a deeper flavor.'
                },
                {
                    instruction: 'Add diced tomatoes, fish stock, white wine, saffron, bay leaves, thyme, orange zest, salt, and pepper.',
                    tip: 'The saffron is crucial for the distinctive color and flavor.'
                },
                {
                    instruction: 'Bring to a simmer and cook for 15 minutes to allow flavors to meld.',
                    tip: 'This creates a flavorful base for the seafood.'
                },
                {
                    instruction: 'Add the firm white fish pieces and simmer for 5 minutes.',
                    tip: 'Add fish in order of cooking time, firmest pieces first.'
                },
                {
                    instruction: 'Add the shellfish and continue to simmer until all seafood is cooked through, about 5 more minutes.',
                    tip: 'Shellfish is done when shells open (discard any that remain closed).'
                },
                {
                    instruction: 'Taste and adjust seasoning if necessary.',
                    tip: 'The broth should be richly flavored but not overpowering the seafood.'
                },
                {
                    instruction: 'Ladle into warm bowls, distributing the seafood evenly.',
                    tip: 'Make sure each serving gets a variety of seafood.'
                },
                {
                    instruction: 'Garnish with fresh parsley and serve immediately with crusty French bread.',
                    tip: 'Traditional serving includes rouille (garlic-saffron mayonnaise) on the side.'
                }
            ];
            break;

        case 'beef-bourguignon':
            steps = [
                {
                    instruction: 'Pat the beef cubes dry with paper towels and season generously with salt and pepper.',
                    tip: 'Dry meat will brown better, creating more flavor.'
                },
                {
                    instruction: 'In a large Dutch oven, cook the diced bacon over medium heat until crisp. Remove with a slotted spoon and set aside.',
                    tip: 'Leave the bacon fat in the pot for browning the beef.'
                },
                {
                    instruction: 'Working in batches, brown the beef cubes on all sides in the bacon fat. Transfer to a plate.',
                    tip: 'Don\'t overcrowd the pot or the meat will steam instead of brown.'
                },
                {
                    instruction: 'Add the sliced onions and carrots to the pot and cook until softened, about 5 minutes.',
                    tip: 'Scrape up any browned bits from the bottom of the pot as you stir.'
                },
                {
                    instruction: 'Add the garlic and cook for another minute until fragrant.',
                    tip: 'Be careful not to burn the garlic.'
                },
                {
                    instruction: 'Add the tomato paste and cook for 1-2 minutes.',
                    tip: 'This helps develop a deeper flavor.'
                },
                {
                    instruction: 'Pour in the red wine, scraping up any browned bits from the bottom of the pot.',
                    tip: 'This deglazing step adds tremendous flavor to the sauce.'
                },
                {
                    instruction: 'Add the beef stock, bouquet garni, browned beef, and cooked bacon. Bring to a simmer.',
                    tip: 'The liquid should just barely cover the meat.'
                },
                {
                    instruction: 'Cover and place in a 325°F (165°C) oven for 2-3 hours, or simmer on the stovetop on low heat, until the beef is very tender.',
                    tip: 'Oven braising provides more even heat.'
                },
                {
                    instruction: 'While the beef is cooking, prepare the pearl onions and mushrooms: In a skillet, melt 1 tablespoon butter and sauté the pearl onions until browned. Set aside.',
                    tip: 'You can use frozen pearl onions to save time.'
                },
                {
                    instruction: 'In the same skillet, melt the remaining butter and sauté the mushrooms until golden. Set aside.',
                    tip: 'Don\'t crowd the mushrooms or they will steam instead of brown.'
                },
                {
                    instruction: 'When the beef is tender, remove the pot from the oven. Skim off any excess fat from the surface.',
                    tip: 'Tilting the pot slightly makes it easier to skim the fat.'
                },
                {
                    instruction: 'Add the sautéed pearl onions and mushrooms to the pot.',
                    tip: 'These add texture and flavor to the finished dish.'
                },
                {
                    instruction: 'In a small bowl, mix the flour with 2 tablespoons butter to form a paste. Stir into the stew to thicken.',
                    tip: 'This is called beurre manié and helps create a silky sauce.'
                },
                {
                    instruction: 'Simmer for another 10 minutes until the sauce is thickened.',
                    tip: 'The sauce should coat the back of a spoon.'
                },
                {
                    instruction: 'Taste and adjust seasoning with salt and pepper. Remove the bouquet garni.',
                    tip: 'The flavors will continue to develop as the dish sits.'
                },
                {
                    instruction: 'Garnish with chopped fresh parsley before serving.',
                    tip: 'Serve with crusty bread, mashed potatoes, or buttered noodles.'
                }
            ];
            break;

        case 'creme-brulee':
            steps = [
                {
                    instruction: 'Preheat the oven to 325°F (165°C).',
                    tip: 'A moderate oven temperature ensures gentle cooking of the custard.'
                },
                {
                    instruction: 'In a medium saucepan, heat the heavy cream and vanilla bean (if using) over medium heat until it just begins to simmer. Do not boil.',
                    tip: 'Heating the cream infuses it with vanilla flavor.'
                },
                {
                    instruction: 'Remove from heat, cover, and let steep for 15 minutes.',
                    tip: 'This allows the vanilla flavor to fully infuse the cream.'
                },
                {
                    instruction: 'In a bowl, whisk together egg yolks, sugar, and salt until the mixture is pale yellow and slightly thickened.',
                    tip: 'Whisking thoroughly at this stage helps create a smooth custard.'
                },
                {
                    instruction: 'Remove the vanilla bean from the cream (if using). If using vanilla extract instead, add it to the cream now.',
                    tip: 'You can rinse and dry the vanilla bean for future use.'
                },
                {
                    instruction: 'Very slowly pour the warm cream into the egg mixture, whisking constantly.',
                    tip: 'Adding the cream too quickly can cook the eggs and create lumps.'
                },
                {
                    instruction: 'Strain the mixture through a fine-mesh sieve into a clean bowl or measuring cup.',
                    tip: 'This ensures a perfectly smooth custard.'
                },
                {
                    instruction: 'Place 4 ramekins in a large baking dish. Divide the custard mixture evenly among the ramekins.',
                    tip: 'Fill each ramekin about 3/4 full.'
                },
                {
                    instruction: 'Pour hot water into the baking dish until it reaches halfway up the sides of the ramekins.',
                    tip: 'This water bath ensures gentle, even cooking.'
                },
                {
                    instruction: 'Carefully transfer to the oven and bake for 35-40 minutes, until the custards are set but still slightly jiggly in the center.',
                    tip: 'They should wobble slightly when gently shaken.'
                },
                {
                    instruction: 'Remove from the oven and carefully take the ramekins out of the water bath. Let cool to room temperature.',
                    tip: 'Use tongs to safely remove the hot ramekins.'
                },
                {
                    instruction: 'Cover each ramekin with plastic wrap and refrigerate for at least 4 hours or overnight.',
                    tip: 'The custard needs time to set completely.'
                },
                {
                    instruction: 'Just before serving, sprinkle a thin, even layer of sugar on top of each custard.',
                    tip: 'About 1-2 teaspoons per ramekin is sufficient.'
                },
                {
                    instruction: 'Use a kitchen torch to caramelize the sugar until it forms a golden-brown crust.',
                    tip: 'Move the torch constantly to avoid burning the sugar.'
                },
                {
                    instruction: 'Let the caramelized sugar cool and harden for 1-2 minutes before serving.',
                    tip: 'Garnish with fresh berries if desired.'
                }
            ];
            break;
            
        case 'tarte-tatin':
            steps = [
                {
                    instruction: 'Preheat the oven to 375°F (190°C).',
                    tip: 'A properly preheated oven ensures even cooking.'
                },
                {
                    instruction: 'Peel, core, and quarter the apples.',
                    tip: 'Choose firm apples that will hold their shape during cooking.'
                },
                {
                    instruction: 'In a 10-inch cast-iron skillet or oven-safe pan, melt the butter over medium heat.',
                    tip: 'A cast-iron skillet works best for even caramelization.'
                },
                {
                    instruction: 'Add the sugar to the melted butter and stir until it begins to dissolve.',
                    tip: 'Keep the heat medium to avoid burning the sugar.'
                },
                {
                    instruction: 'Continue cooking until the mixture turns a golden amber color, about 3-4 minutes.',
                    tip: 'Watch carefully as caramel can burn quickly.'
                },
                {
                    instruction: 'Remove from heat and stir in vanilla, cinnamon, and a pinch of salt.',
                    tip: 'These additions enhance the caramel flavor.'
                },
                {
                    instruction: 'Arrange the apple quarters in the pan, rounded side down, in a circular pattern.',
                    tip: 'Pack them tightly as they will shrink during cooking.'
                },
                {
                    instruction: 'Return the pan to medium heat and cook for 10-15 minutes until the apples begin to soften and absorb the caramel.',
                    tip: 'Occasionally spoon the caramel over the apples.'
                },
                {
                    instruction: 'Remove from heat and let cool for 5 minutes.',
                    tip: 'This cooling period helps the caramel set slightly before adding the pastry.'
                },
                {
                    instruction: 'Place the puff pastry sheet over the apples and tuck the edges down inside the pan.',
                    tip: 'Don\'t worry about making it look perfect; rustic is charming.'
                },
                {
                    instruction: 'Cut a few small vents in the pastry and bake for 25-30 minutes until the pastry is golden brown.',
                    tip: 'The vents allow steam to escape, keeping the pastry crisp.'
                },
                {
                    instruction: 'Remove from oven and let cool for 10 minutes.',
                    tip: 'This resting period is crucial to allow the caramel to set slightly.'
                },
                {
                    instruction: 'Place a serving plate upside down over the pan, and carefully but quickly flip to invert the tart onto the plate.',
                    tip: 'Use oven mitts as the pan will still be hot.'
                },
                {
                    instruction: 'Replace any apple pieces that may have stuck to the pan.',
                    tip: 'A quick rearrangement keeps your tart looking beautiful.'
                },
                {
                    instruction: 'Serve warm with vanilla ice cream or crème fraîche.',
                    tip: 'The contrast of warm tart and cold cream is divine.'
                }
            ];
            break;
            
        default:
            steps = [];
    }
    
    return steps;
}