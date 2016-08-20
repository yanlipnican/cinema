/*
	DOM READY
*/

$(document).ready(() =>{

   // remove data in /admin/show-data/:col

	$('.show-data .remove').click(function(e){
		e.preventDefault();
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

	});


	// add data in /admin/add-data/:col

	$('.add-data #add-new').click(function(e){
		e.preventDefault();
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
	});


	// edit data


	$('.add-data #edit').click(function(e){
		e.preventDefault();
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
	});

	$('.add-data').ready(function(){

		$(document).ready(function() {
		  $('.summernote').summernote({
		  	height: 300
		  });
		});

	});

	$('#change-password').submit(function(e){
		e.preventDefault();
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

	});

	$('.admin-openGallery').click(function(e){
		e.preventDefault();
		let saveTo = $(this).data('save-to');
		let url = $(this).data('url');

		$('.popup').show();
		$('.popup .content').html('<span class="loading">Loading</span>');

		$('.popup .content').load(url, function(){
			$('.admin-image-gallery .image').click(function(){
				let url = $(this).children('img').attr('src');
				$('.' + saveTo).val(url);
				$('.popup').hide();
			});
		});

	});

	$('#admin-create-category').click(function(e){
		e.preventDefault();
		let collection = $(this).data('collection');
		let name = prompt('Name the new category');

		if(name.replace(/ /g, '') !== ''){
			$.ajax({
				url : '/admin/create-category',
				data : {
					name,
					col : collection
				},
				method : 'POST'
			}).done(function(response){
				if(response.error){
					alert(response.error);
				} else {
					alert('Category has been created.');
					location.reload();
				}
			}).fail(function(response){
				alert('Something went wrong');
			});
		} else {
			alert('Category has to have name!');
		}
	});

	$('#admin-choose-category').change(function(){
		let category = $(this).val();
		let col = $(this).data('col');
		if(category !== "choose") window.location = `/admin/show-data/${col}/1/${category}`;
	});

});