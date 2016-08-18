/*
	DOM READY
*/

$(document).ready(() =>{

	$('a[data-toggle="tooltip"]').tooltip();


	function showPopup(url){

		console.log(url);
		if(typeof url !== "undefined"){
			$('.popup .content').html('<span class="loading">Loading</span>');
			$('.popup .content').load(url);
		}

		$('.popup').show();

	};

	$('.openPopup').click(function(){

		let url = $(this).data('url');

		showPopup(url);

	});

	$('.popup .close').click(function(){

		$('.popup').hide();

	});

});