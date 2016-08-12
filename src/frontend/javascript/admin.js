/*
	DOM READY
*/

$(document).ready(() =>{

   // remove data in /admin/show-data/:col

	$('.show-data .remove').click(function(e){
		
		if(confirm("Are you sure ?")){

			const address = $(this).attr('href');
			const anchor = $(this);

			$.ajax({
				method : 'post',
				url : address
			}).done(function(data){
				if(data.error){
					alert(data.error);
				} else {
					const td = anchor.parent().parent();
					td.addClass('danger');
					setTimeout(function(){
						td.hide(function(){
							td.remove();
						});
					}, 200);
				}
			}).fail(function(){
				alert('Something went wrong, data hasnt been removed.');
			});

		}

		e.preventDefault();

	});


	// add data in /admin/add-data/:col

	$('.add-data #add-new').click(function(e){

		const address = $(this).attr('href');

		const data = {};

		$('textarea').each(function(){
			data[$(this).attr('name')] = $(this).val();
		})

		$.ajax({
			url : address,
			method : 'POST',
			data
		}).done(function(response){
			if(response.error){
				alert(data.error);
			} else {
				alert(response.success);
				let showDataAddr = '/admin/show-data/' + address.split('/').pop();
				location.replace(showDataAddr);
			}
		}).fail(function(){
			alert('Something went wrong, data hasnt been saved');
		});

		e.preventDefault();

	});

});