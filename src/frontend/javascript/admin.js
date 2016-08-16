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

		$('.data').each(function(){
			
			if($(this).hasClass('summernote')){
				data[$(this).attr('name')] = $(this).summernote('code');
			} else {
				data[$(this).attr('name')] = $(this).val();
			}

		});

		$.ajax({
			url : address,
			method : 'POST',
			data
		}).done(function(response){
			if(response.error){
				alert(response.error);
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


	// edit data


	$('.add-data #edit').click(function(e){

		const address = $(this).attr('href');

		const data = {};

		$('.data').each(function(){
			
			if($(this).hasClass('summernote')){
				data[$(this).attr('name')] = $(this).summernote('code');
			} else {
				data[$(this).attr('name')] = $(this).val();
			}

		});

		$.ajax({
			url : address,
			method : 'POST',
			data
		}).done(function(response){
			if(response.error){
				alert(response.error);
			} else {
				alert(response.success);
				let showDataAddr = '/admin/show-data/' + address.split('/')[3];
				location.replace(showDataAddr);
			}
		}).fail(function(){
			alert('Something went wrong, data hasnt been saved');
		});

		e.preventDefault();

	});

	$('.add-data').ready(function(){

		$(document).ready(function() {
		  $('.summernote').summernote({
		  	height: 300
		  });
		});

	});

	$('#change-password').submit(function(e){

		const address = '/admin/change-password';

		const data = {};

		let valid = true;

		$('.data').each(function(){
			console.log($(this).val());
			if($(this).val() !== ""){
				data[$(this).attr('name')] = $(this).val();
			} else {
				valid = false;
			}
		});

		if(!valid){
			alert('Fill all fields.');
			return false;
		}


		if(data.newPass !== data.newPassRepeat){
			alert('Repeat password correctly');
			return false;
		}

		$.ajax({
			url : address,
			method : 'POST',
			data
		}).done((response) => {
			if(response.error){
				alert(response.error);
			} else {
				alert(response.success);
				window.location = "/admin";
			}
		}).fail((err) => {
			alert('Something went wrong :' + err);
		});

		e.preventDefault();

	});

});