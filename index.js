/**
 * Add an item to the list
 * If the item empty: display a warning
 * If the item is on the list and checked off: uncheck it and display a message
 * If the item is on the list: display a warning
 * @param {string} item - An item to add to the list.
 */
function addToList( item, checked = false ) {
	item = item.trim();
	// If it's an empty string, display an error message
	if ( item.length === 0 ) { 
		addWarning(`You can't add an empty item to the list`);
	} else if ( isOnList( item ) ) {
		// If the item is on the list and isn't checked, display a warning
		if ( !isChecked( item ) ) {
			addWarning(`<span style="color:red">${item}</span> ${( item[item.length - 1] === 's') ? 'are' : 'is'} already on the list`);
		// If the item is on the list and checked: uncheck it and display a message letting the user know that's what you did
		} else {
			unCheck( item );
			addWarning(`Unchecked <span style="color:red">${item}</span>`);
		}
	// Otherwise, the item isn't on the list, so add it
	} else {
		let list = ( checked ) ? getCheckedItems() : getUnCheckedItems();
		let html = `
			<li>
				<span class="shopping-item">${item}</span>
				<div class="shopping-item-controls">
					<button class="shopping-item-toggle">
						<span class="button-label">check</span>
					</button>
					<button class="shopping-item-delete">
						<span class="button-label">delete</span>
					</button>
				</div>
			</li>
		`;
		insertBeforeIdx = getInsertIndex( item, checked );

		if ( insertBeforeIdx === $(list).length || $(list).length === 0 ) {
			if ( checked ) {
				$('.shopping-list-checked').append(`${html}`);
			} else {
				$('.shopping-list-unchecked').append(`${html}`);
			}
		} else {
			$(list).eq(insertBeforeIdx).before(`${html}`);
		}
	}
}

function getInsertIndex( newItem, checked = false ) {
	let items = [];
	let idx = 0;
	let list = ( checked ) ? getCheckedItems() : getUnCheckedItems();
	$(list).each(function() { 
		items.push($(this).find('.shopping-item').text());
	});
	items.some(function( item ) {
		if ( item.localeCompare( newItem ) > 0 ) 
			return true;
		idx++;
		return false;
	});
	return idx;
}

/**
 * Add a warning message below the form
 * @param {string} htmlString - A string containing the text of the warning (can include html tags)
 */
function addWarning(htmlString) {
	$('#js-shopping-list-form').after(`
		<p class="warning" style="border:red solid 2px;padding:20px;font-style:italic;text-align:center">
			{ ${htmlString} }
		</p>
	`);
}

/**
 * Remove any warning messages
 */
function removeWarning() {
	$('.warning').remove();
}

function focusEntry() {
	document.getElementById('shopping-list-entry').focus();
}

/**
 * Returns whether or not an item is in the list already
 * @param {string} item - The item to find on the list
 * @return true - If the item is on the list
 *         false - if the item is not on the list
 */
function isOnList( item ) {
	return getItem( item ).length > 0;
}

/**
 * Returns the DOM item from the list that matches the input item
 * @param {string} item - The item to retrieve from the list
 * @return Array of the DOM items from the list that match the input item
 */
function getItem( item ) {
	item = item.trim().toLowerCase();
	return $('.shopping-list').find('.shopping-item').filter(function(idx, elem) {
		return $(elem).text().toLowerCase() === item;
	});
}

/**
 * Finds an item in the list and returns if it is checked off or not
 * @param {string} item - The item to check
 * @return true if the item is checked
 *         false if it is not checked
 */
function isChecked( item ) {
	let match = getItem( item );
	if ( match.length === 0 ) return false;
	return $(match).attr('class').split(/\s+/).includes('shopping-item__checked');
}

/**
 * Finds an item in the list, unchecks it and moves it above the checked items
 * @param {string} item - The item to uncheck
 */
function unCheck( item ) {
	let match = getItem( item );
	if ( match.length === 0 ) return;
	$(match).closest('li').remove();
	addToList( item );
	toggleHideChecked();
}

/**
 * Finds an item in the list, checks it and moves it to the bottom of the list
 * @param {string} item - The item to uncheck
 */
function check( item ) {
	let match = getItem( item );
	if ( match.length === 0 ) return;
	$(match).closest('li').remove();
	addToList(item, true);
	match = getItem( item );
	// Add styling to the checked items.
	$(match).addClass('shopping-item__checked');
	$(match).closest('li').find('.shopping-item-toggle .button-label').text('uncheck');
	$(match).closest('li').attr("style", "background-image:radial-gradient(at 20% 20%, #b2b2b2, #ffffff)");
	toggleHideChecked();
}

function toggleHideChecked() {
	console.log(getCheckedItems().length);
	if ( getCheckedItems().length === 0 ) {
		$('.hide-checked-toggle').attr('hidden', true);
	} else {
		$('.hide-checked-toggle').attr('hidden', false);
	}
}

/**
 * Toggle whether an item is checked or not
 * @param {string} item - the item for which to toggle whether it is checked or not
 */
function toggleChecked( item ) {
	if ( isChecked( item ) ) {
		unCheck( item );
	} else {
		check( item );
	}
}

/**
 * Get an array of the checked items on the list
 * @return An array of the checked elements on the list
 */
function getCheckedItems() {
	return $('.shopping-list-checked').find('li');
}

/**
 * Get an array of the unchecked items on the list
 * @return An array of the unchecked elements on the list
 */
function getUnCheckedItems() {
	return $('.shopping-list-unchecked').find('li');
}

/**
 * Get an array of all the items on the list
 * @return An array of the the items on the list (checked or unchecked)
 */
function getAllItems() {
	return $('.shopping-list').find('li');
}

/**
 * Listener on the form used to add items to the list
 */
$( function() {
	$('#js-shopping-list-form').submit( function(event) {
		// We're not submitting the form
		event.preventDefault();
		// Remove any previous warnings
		removeWarning();

		// Get the text of what the user wants to add to the list:
		let inputField = $(this).find('input[name="shopping-list-entry"]');
		let item = inputField.val().trim();
		console.log(item);
		// Add it to the list
		addToList( item );
		// Reset the field so it doesn't still contain the text of what we just added
		inputField.val('');
		focusEntry();
	});
})

/**
 * Listener on the check buttons on each list item
 */
$( function () {
	$('.shopping-list').on('click', 'button[class="shopping-item-toggle"]', function(event) {
		removeWarning();
		event.stopPropagation();
		 // Each shopping list item is a <li>. Go up the DOM tree to the <li> element, 
		 // then back down to find the item text itself.
		let item = $(this).closest('li').find('.shopping-item').text();
		// Toggle whether the text is struck through or not
		toggleChecked( item );
		focusEntry();
	});
})

/**
 * Listener on the delete buttons on each list item
 */
$( function () {
	$('.shopping-list').on('click', 'button[class="shopping-item-delete"]', function( event ) {
		removeWarning();
		event.stopPropagation();
		 // Each shopping list item is a <li>. Go up the DOM tree to the <li> element, and remove it 
		 $(this).closest('li').remove();
		 focusEntry();
	});
})

$( function () {
	$('.btn-hide-checked-toggle').click( function( event ) {
		removeWarning();
		event.stopPropagation();
		$('.shopping-list-checked').attr('hidden', function(_, attr){ return !attr});
		// TODO: use something from FontAwesome to give better looking arrows.
		if ( $('.lbl-hide-checked-toggle').text() === "Hide Checked Items" ) {
			$('.lbl-hide-checked-toggle').text("Show Checked Items");
			$('.lbl-hide-checked-toggle').closest('div').find('button').text(">");
		} else {
			$('.lbl-hide-checked-toggle').text("Hide Checked Items");
			$('.lbl-hide-checked-toggle').closest('div').find('button').text("^");
		}
		console.log('clicked the hide checked items button');
		focusEntry();
	});
})

/**
 * Reset the initial list to it's correct state
 */
function resetList() {
	// If we don't pass it a list of items to check, check all the items in the list
	let items = [];
	let checkedItems = [];
	// Make a list of all the items and a list of the checked items
	$('.shopping-list').find('.shopping-item').each( function () {
		let item = $(this).text();
		if ( isChecked( item ) )
			checkedItems.push( item );
		items.push( item );
		$(this).closest('li').remove();
	});
	// Add all the items to the list unchecked
	items.forEach( function( item ) {
		addToList( item );
	});
	// Check the checked off items (moving them to the checked list)
	checkedItems.forEach( function( item ) {
		check( item );
	});
	toggleHideChecked();
}

/**
 * Repurpose the existing shopping-list as a list for unchecked items
 * Add a list for checked items after it.
 */
function addCheckedItemList() {
	$('.shopping-list').addClass('shopping-list-unchecked');
	let html = `
		<div class="hide-checked-toggle">
			<button id='btn-hide-checked-toggle' class='btn-hide-checked-toggle' style='background-color:white;border:0px'>^</button>
			<label for='btn-hide-checked-toggle' class='lbl-hide-checked-toggle'>Hide Checked Items</label>
		</div>
		<ul class="shopping-list shopping-list-checked"></ul>
	`;
	$('.shopping-list').after(`${html}`);
}

// Functions to affect / reconfigure the webpage before any user interaction.
addCheckedItemList();
resetList();
focusEntry();
