/* Render cards */
function renderCards(option,last) {

	let newItems = [];

	// JSON Parser
	fetch('../json/content.json')
	.then(response => {
		if (!response.ok) {
			throw new Error(`HTTP Error: ${response.status}`);
		}
		return response.json();
	})
	.then(json => {
		// Build feed from JSON
		json.singlestack.map((item,i) => {
			if (last !== null && i <= last){
				return true;
			}
			
			// Insert new card in stack
			const singleStack = document.querySelector('#single_stack');
			if (singleStack !== null) {
				singleStack.insertAdjacentHTML('beforeend', '\
				<a href="#" class="single_card active" index="'+i+'">\
					<div class="series_title medium_text">\
						'+item.etitle+'\
					</div>\
					<img src="'+item.image+'" class="stack_image" alt="'+item.etitle+'" />\
					<div class="stack_content">\
						<div class="stack_description_wrapper">\
							<div class="stack_info_wrapper">\
								<div class="stack_time semi_large_text">\
									'+item.duration+'\
								</div>\
								<div class="stack_title din_alternate_bold semi_large_text">\
									'+item.etitle+'\
								</div>\
							</div>\
							<div class="stack_description semi_large_text_reg">\
								'+((item.eid !== "") ? item.eid+' <span class="stack_separate">|</span> ' : '')+item.edescription+'\
							</div>\
						</div>\
					</div>\
				</a>');
			}
		});
	}).then(() => { 
		setZindex();

		if (option == null) {
			// Set inital scale
			setScale();
		} else {
			// Set dynamic transitions/positions after card selection
			const card = visualEffects[(visualEffects.length - 1)];
			const cardScale = card[0];
			const cardOffset = card[1];

			newItems.forEach((newItem) => {
				TweenMax.set(newItem, {
					scaleX: cardScale,
					scaleY: cardScale,
					y: cardOffset,
					z: 0.01
				});
			});

			const activeCards = document.querySelectorAll('.active');
			if (activeCards !== null) {
				activeCards.forEach((active,i) => {
					const card = visualEffects[i];
					const cardScale = card[0];
					const cardOffset = card[1];

					if(card == null){
						return false;
					}

					TweenMax.to(active, 2.5, {
						scaleX: cardScale,
						scaleY: cardScale,
						y: cardOffset,
						z: 0.01,
						force3D: true
					});
				});
			}
			roloControl(true);
		}
		setHandler();
	})
	.catch(() => {
		console.log("Error: Cannot parse imported json");
	});
}

// Set zindex inverse from index
function setZindex(){
	const singleCards = document.querySelectorAll('.single_card');
	if (singleCards !== null) {
		singleCards.forEach((card,i) => {
			card.style.zIndex = (singleCards.length - i);
		});
	};
}

// Set scale of each item
let visualEffects= [];
let cachedSiblings = [];

function setScale() {
	let initScale = 1;
	let initOffset = 380;
	let setPerspective = 0;

	document.querySelectorAll('.single_card').forEach((card,i) => {
		// Kickstart GPU Acceleration
		TweenMax.to(card, 0.0, {
			opacity: 1.0,
			scaleX: initScale,
			scaleY: initScale,
			y: initOffset,
			z: 0.01,
			force3D: true
		});

		visualEffects.push([initScale,initOffset]);

		// Adjust default inputs for following cards
		switch(true) {
			case (i <= 1):
				initOffset -= (70 - setPerspective);
				break;
			case (i >= 2 && i <=3):
				initOffset -= (60 - setPerspective);
				break;
			case (i >=4 && i <=6):
				initOffset -= (56 - setPerspective);
				break;
			case (i >= 7):
				initOffset -= (52 - setPerspective);
				break;
			default:
				break;
		}
		setPerspective += 4;
		initScale = parseFloat((initScale - 0.07).toFixed(2));
	});
}

// Convenience function returning previous siblings
function previousSiblings(element) {
	var siblings = [];
	while (element = element.previousElementSibling) {
		siblings.push(element);
	}
	return siblings;
}

// Remove and re-set all click handlers
function setHandler() {
	const singleCard = document.querySelectorAll('.single_card');
	if (singleCard !== null) {
		setTimeout(() => {
		singleCard.forEach((card) => {
			card.onclick = null;
			const siblingsInfront = previousSiblings(card);
			card.onclick = () => roloToCard(siblingsInfront);
		});
		},750);
	}
}

// Rolodex direction / speed / delay manager
function roloControl(forwards) {

	let delay = (forwards ? 0 : 0.75);

	document.querySelectorAll('.active').forEach((active,i) => {
		const card = visualEffects[i];
		const cardScale = card[0];
		const cardOffset = card[1];

		if(card === null){
			return false;
		}

		switch(true) {
			case (i == 0):
				delay = (forwards ? parseFloat((delay += 0.025).toFixed(3)) : delay);
				break;
			case (i > 0 && i <= 2):
				delay = (forwards ? parseFloat((delay += 0.075).toFixed(3)) : parseFloat((delay -= 0.05).toFixed(3)));
				break;
			case (i >= 3 && i <= 6):
				delay = (forwards ? parseFloat((delay += 0.01).toFixed(3)) : parseFloat((delay -= 0.075).toFixed(3)));
				break;
			case (i >= 7):
				delay = (forwards ? parseFloat((delay += 0.125).toFixed(3)) : parseFloat((delay -= 0.1).toFixed(3)));
				break;
			default:
				break;
		}

		TweenMax.to(active, 0.8, {
			delay: delay,
			scaleX: cardScale,
			scaleY: cardScale,
			y: cardOffset,
			z: 0.01,
			force3D: true,
			ease: SlowMo.easeOut
		});
	});
}

// Rolo to clicked card
function roloToCard(siblings) {

	const length = siblings.length;
	const lastIndex = parseFloat(document.querySelector('#single_stack a:last-child').getAttribute('index'));

	const card = visualEffects[0];
	const cardScale = card[0];

	let delay = 0.25;
	let speed = 1.0;

	siblings.reverse().forEach((sibling,i) => {
		cachedSiblings.unshift(sibling);

		sibling.classList.remove('active');

		if (i < 4) {
			speed = parseFloat((speed - 0.1).toFixed(1));
		}

		TweenMax.to(sibling, speed, {
			delay: delay,
			scaleX: cardScale,
			scaleY: cardScale,
			y: window.innerHeight,
			z: 0.01,
			force3D: true,
			ease: SlowMo.easeOut
		});

		delay = delay + 0.15;
	});

	setTimeout(() => {
		renderCards(length,lastIndex);

		setTimeout(() => {
			// Convert NodeList to Array to remove sliced cards
			const singleCards = document.querySelectorAll('.single_card');
			if (singleCards !== null) {
				const cards = Array.from(singleCards).slice(0,length);
				cards.forEach((card) => {
					card.parentNode.removeChild(card);
				});
			}
		},(delay * 2300));
	},(delay * 900));

	delay = 0.25;
	speed = 1.0;
}

// Control amount of cards forward
function roloForwardCard(number) {

	const moreThanLeft = number > document.querySelectorAll('.single_card').length;
	const selectedCard = (moreThanLeft ? document.querySelector('.single_card:last-child') : document.querySelector('.single_card:eq(' + number + ')'));
	
	const siblingsInfront = previousSiblings(selectedCard);

		if(siblingsInfront.length > 0){
			roloToCard(siblingsInfront);
		}else{
			TweenMax.to(selectedCard, 0.25, {
				rotationX: -20,
				z: 0.01,
				yoyo: true,
				repeat: 1
			});
		}
}

// Controle amount of cards backwards
function roloBackCard(number) {
	const count = number - 1;

	// Preserve cards to prepend back to node list
	cachedSiblings.forEach((sibling,i) => {
		if(count !== null && i <= count) {
			const singleStack = document.getElementById('single_stack');
			const stackList = document.querySelectorAll('#single_stack a');
			const firstChild = document.querySelector('#single_stack a:first-child');
			const lastChild = document.querySelector('#single_stack a:last-child');

			if (singleStack !== null && stackList !== null && firstChild !== null && lastChild !== null) {
				singleStack.prepend(sibling);
				firstChild.classList.add('active');

				if (stackList.length > 10) {
					lastChild.parentNode.removeChild(lastChild);
				}
				cachedSiblings.shift();	
			}
		}
	});

	setZindex();
	setHandler();
	roloControl(false);
}

// Swipe velocity control
function velocityProcess(velocity,direction) {
	let t = Math.round(velocity);
	if (velocity < 2) {
		t = 1;
	} else if (velocity > 9) {
		t = 9;
	}

	// Display velocity and rolo card output
	const moveVelocity = document.getElementById('move_velocity');
	if (moveVelocity !== null) {
		moveVelocity.innerHTML = ' <b>INPUT:</b> '+ velocity +' | <b>OUTPUT:</b> ' + t;
	}

	if(direction == 1) {
	  roloForwardCard(t);
	}else{
	  roloBackCard(t);
	}
}

// Initialize card canvas view
window.onload = () => {
	renderCards();

	const dtvtouch = new Hammer(document.getElementById('single_stack'));
	        	
	dtvtouch.get('swipe').set({
		direction: Hammer.DIRECTION_VERTICAL,
		threshold: 5,
		velocity: 0.75
	});

	dtvtouch.on('swipedown swipeup',(ev) => {		
		const velocity = Math.abs(ev.velocityY);
		const direction = ((ev.type == 'swipedown') ? 1 : 0);
		velocityProcess(velocity,direction);
	});
}