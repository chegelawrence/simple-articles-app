/*
main client javascript file
@author:lawz
*/

$(document).ready(function(){
	$('.delete-article').on('click',function(e){
		$target = $(e.target)
		const id = $target.attr('data-id')
		$.ajax({
			type:'DELETE',
			url:'/articles/delete/'+id,
			succes:function(response){
				alert('Deleting Article')
				window.location.href = '/'
			},
			error:function(err){
				console.log(err)
			}
		});
	});
});