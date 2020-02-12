function addToList( item, listItems=[] ) {
	// Don't add empty items or items that are already on the list (if we pass a list to check against...)
	if ( item.length <= 0 || listItems.includes(item) ) {
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
		</li>`)
}

$( function() {
	// Create listener on the form used to add new items to the list:
	$('#js-shopping-list-form').submit( function(event) {
		// We're not submitting the form
		event.preventDefault();

		// Get the text of what the user wants to add to the list:
		let inputField = $(this).find('input[name="shopping-list-entry"]');
		let item = inputField.val();
		console.log(item);
		// Add it to the list
		addToList( item );
		// Reset the field so it doesn't still contain the text of what we just added
		inputField.val('');
	})
})