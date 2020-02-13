function addToList( item, listItems=[] ) {
	// Don't add empty items or items that are already on the list (if we pass a list to check against...)
	if ( item.length <= 0 ) {
		// Probably don't need a message here...
		return;
	} 
	if ( listItems.includes(item) ) {
		/* maybe do something like display a message: item is already on the list */
		return;
	}
	$('.shopping-list').append(`
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
		</li>`);
}

function isOnList( item ) {
	item = item.toLowerCase();
	// Get the items already on the list
	const list = [];
	$('.shopping-list').find('.shopping-item').each(function(idx, elem) {
		list.push($(elem).text().toLowerCase());
	})
	console.log(list);
	return list.map((i) => i.toLowerCase()).includes( item );
}

function unCheck( item ) {
	item = item.trim().toLowerCase();
	let match = $('.shopping-list').find('.shopping-item').filter(function(idx,elem) {
		return $(elem).text().toLowerCase() === item;
	});
	if ( match.length === 0 )
		return;
	$(match).removeClass('shopping-item__checked');
	resetCheck(match);
}

$( function() {
	// Create listener on the form used to add new items to the list:
	$('#js-shopping-list-form').submit( function(event) {
		// We're not submitting the form
		event.preventDefault();

		// Get the text of what the user wants to add to the list:
		let inputField = $(this).find('input[name="shopping-list-entry"]');
		let item = inputField.val().trim();
		console.log(item);
		// Add it to the list
		if ( !isOnList( item ) ) {
			addToList( item );
		} else {
			unCheck( item );
			// Some indication that it was already on the list??
		}
		// Reset the field so it doesn't still contain the text of what we just added
		inputField.val('');
	})
})

$( function () {
	// Create listener on the check buttons
	$('.shopping-list').on('click', 'button[class="shopping-item-toggle"]',  function( event ) {
		event.stopPropagation();
		 // Each shopping list item is a <li>. Go up the DOM tree to the <li> element, 
		 // then back down to find the item text itself.
		let itemText = $(this).closest('li').find('.shopping-item');
		// Toggle whether the text is struck through or not
		itemText.toggleClass('shopping-item__checked');
		// Set the text on the check button based on the item's state
		resetCheck(itemText);
	})
})

$( function () {
	// Create listener on the delete buttons
	$('.shopping-list').on('click', 'button[class="shopping-item-delete"]', function( event ) {
		event.stopPropagation();
		 // Each shopping list item is a <li>. Go up the DOM tree to the <li> element, and remove it 
		 $(this).closest('li').remove();
	})
})

/**
 * Toggle the text on the button to check/uncheck depending on it's state.
 */
function resetCheck( items=[] ) {
	if ( items.length === 0 )
		items = $('.shopping-list').find('.shopping-item');
	$(items).each( function( item ) {
		console.log( $(this).attr('class'));
		if ( $(this).attr('class').split(/\s+/).includes('shopping-item__checked') )
			$(this).closest('li').find('.shopping-item-toggle .button-label').text('uncheck');
		else
			$(this).closest('li').find('.shopping-item-toggle .button-label').text('check');
	});
}

resetCheck();