/**
 * Add an item to the list
 * If the item empty: display a warning
 * If the item is on the list and checked off: uncheck it and display a message
 * If the item is on the list: display a warning
 * @param {string} item - An item to add to the list.
 */	
function addToList( item, checked = false, category = null ) {
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
		let categoriesHtml = "";
		if ( category != null && category.trim().length > 0  ) {
			categoriesHtml = categoryButtonFactory( category );
		}
		let list = ( checked ) ? getCheckedItems() : getUnCheckedItems();
		let html = `
			<li style="position:relative; border-radius:5px;padding:10px;">
				<button class="shopping-item-toggle" style="border: 0px;background-color:unset">
					<i class="far fa-square"></i>
				</button>
				<span class="shopping-item" style="display:inline;margin-bottom:0;margin-left:10px;">${item}</span>
				<div style="display:inline-block;position:absolute;right:0px;text-align:right;margin-right:20px;margin-top:0;margin-bottom:0;">
					<div style="display:inline-block" hidden class="categories">
					</div>
					${categoriesHtml}
					<button class="add-category" style="border:2px #569CB9 solid; border-radius: 40px; background-color:lightgrey;padding-left:7px;padding-right:7px;padding-top:0px;padding-bottom:0px;">
						<i class="fas fa-plus-circle" style="font-size:0.8rem;margin-top:4px;margin-bottom:4px;margin-right: 4px;"></i>
						<span style="font-size:0.8rem;margin-top:4px;margin-bottom:4px;">Category</span>
					</button>
					<button class="shopping-item-delete" style="position:static;border: 0px;background-color:unset;color:red;">
						<i class="far fa-trash-alt"></i>
					</button>
				</div>
			</li>
		`;
		insertBeforeIdx = getInsertIndex( item, checked );
		console.log(insertBeforeIdx);

		if ( insertBeforeIdx === $(list).length || $(list).length === 0 ) {
			if ( checked ) {
				$('.shopping-list-checked').append(`${html}`);
				styleCheckedItem(item);
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
	$('.warning').attr('hidden', false);
	$('.warning').append( htmlString );
}

/**
 * Remove any warning messages
 */
function removeWarning() {
	$('.warning').attr('hidden', true);
	$('.warning').children().remove();
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
	let cat = getCategories(item);
	$(match).closest('li').remove();
	addToList( item, false, cat );
	toggleHideChecked();
}

/**
 * Finds an item in the list, checks it and moves it to the bottom of the list
 * @param {string} item - The item to uncheck
 */
function check( item ) {
	let match = getItem( item );
	if ( match.length === 0 ) return;
	let cat = getCategories(item);
	console.log("categories: " + cat);
	$(match).closest('li').remove();
	addToList(item, true, cat );
	styleCheckedItem(item);
	toggleHideChecked();
}

function styleCheckedItem(item) {
	match = getItem( item );
	$(match).addClass('shopping-item__checked');
	$(match).closest('li').find('.shopping-item-toggle').find('i').remove(); // .button-label').text('uncheck');
	$(match).closest('li').find('.shopping-item-toggle').append(`<i class="far fa-check-square"></i>`);
	$(match).closest('li').attr("style", "position:relative;border-radius:5px;padding:10px;background-image:radial-gradient(at 20% 20%, #b2b2b2, #ffffff)");
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

function categoryButtonFactory( category ) {
	return `
		<div class="category-container" style="display:inline-block;border:2px #569CB9 solid; border-radius: 40px; background-color:lightgrey;padding-left:7px;padding-right:7px;font-size:0.8rem;">
			<span class="category" style="margin-right:6px;">${category}</span><button class="remove-category" style="border:0px;background-color:unset;margin:0"><i class="fas fa-times-circle"></i></button>
		</div>
	`;
}

function getCategories( item ) {
	return getItem(item).closest('li').find('.category').text();
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
		 toggleHideChecked();
		 focusEntry();
	});
})

/**
 * Listener on the add category button on each item
 */
$( function() {
	$('.shopping-list').on('click', 'button[class="add-category"]', function( event ) {
		removeWarning();
		// Change the button to a similarly styled entry field
		$(this).after(`
			<form id="add-category-form" class="add-category-form" style="display:inline-block;border:2px #569CB9 solid; border-radius: 40px; background-color:lightgrey;padding-left:7px;padding-right:7px;padding-top:0px;padding-bottom:0px;">
				<label for="add-category-field" hidden>New Category Name</label>
				<input type="text" name="add-category-field" placeholder="Category" style="background-color:unset;font-size:0.8rem;margin:0px;border:0px;border-radius:10px;">
				<button type="submit"><i class="fas fa-plus-circle" style="background-color:unset"></i></button>
			</form>
		`);
		// Focus on the entry field that we just created
		$('#add-category-form').find('input').focus();
		// Hide the add category button while the user is in the process of already adding a category
		$(this).attr('hidden', true);
	});
})

/**
 * Listener on the button to toggle hiding the checked items
 */
$( function () {
	$('.btn-hide-checked-toggle').click( function( event ) {
		removeWarning();
		event.stopPropagation();
		$('.shopping-list-checked').attr('hidden', function(_, attr){ return !attr});
		if ( $('.lbl-hide-checked-toggle').text() === "Hide Checked Items" ) {
			$('.lbl-hide-checked-toggle').text("Show Checked Items");
			$('.lbl-hide-checked-toggle').closest('div').find('button').find('i').remove();
			$('.lbl-hide-checked-toggle').closest('div').find('button').append(`<i class="fas fa-angle-right">`);
		} else {
			$('.lbl-hide-checked-toggle').text("Hide Checked Items");
			$('.lbl-hide-checked-toggle').closest('div').find('button').find('i').remove();
			$('.lbl-hide-checked-toggle').closest('div').find('button').append(`<i class="fas fa-angle-down">`);
		}
		console.log('clicked the hide checked items button');
		focusEntry();
	});
})

/**
 * Listener on the add category field.
 * When clicking out of the field, delete the form and show the add category button again
 */
$( function() {
	$('.shopping-list').on('focusout', '.add-category-form', function( event ) {
		$(this).parent().find('button[class="add-category"]').attr('hidden', false);
		$(this).remove();
		focusEntry();
	});
})

/**
 * Listener on the add category field when submitted
 * Add a category with the specified name or change the category if the item already has a category
 */
$( function() {
	$('.shopping-list').on('submit', '.add-category-form', function( event ) {
		event.preventDefault();
		event.stopPropagation();
		console.log(this);
		let inputField = $(this).find('input');
		let value = $(inputField).val().trim();
		console.log(value);
		// Each item can only have one category (for now)
		if ( $(this).parent().find('.category').length === 0 ) {
			$(this).parent().find('button[class="add-category"]').before(categoryButtonFactory(value));
		} else {
			$(this).parent().find('.category span').text(`${value}`);
		}
		// Unhide the add category button
		$(this).parent().find('button[class="add-category"]').attr('hidden', false);
		// Remove the category entry field now that we're done.
		$(this).remove();
	});
})

$( function() {
	$('.shopping-list').on('click', '.remove-category', function( event )  {
		$(this).parent('.category-container').remove();
		// Remove the category
	});
})

// Functions to affect / reconfigure the webpage before any user interaction.
addToList('apples');
addToList('oranges');
addToList('bread');
addToList('milk', true);
focusEntry();
