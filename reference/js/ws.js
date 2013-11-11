$(document).on('ready', function() {
	$('pre.js code').each(function() {
		$(this).html(highlight($(this).text()));
	});
	/*
	$('header').load('header.html', function(){
		$('nav.side-nav').load('sidebar.html', function(){
			$('article').load('content.html', function(){
				
				$('[data-spy="scroll"]').each(function () {
				  var $spy = $(this).scrollspy('refresh');
				});
			});	
		});
	});
	*/
});

function highlight(js) {
	return js
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/\/\/(.*)/gm, '<span class="comment">//$1</span>')
		.replace(/('.*?')/gm, '<span class="string">$1</span>')
		.replace(/(\d+\.\d+)/gm, '<span class="number">$1</span>')
		.replace(/(\d+)/gm, '<span class="number">$1</span>')
		.replace(/\bnew *(\w+)/gm, '<span class="keyword">new</span> <span class="init">$1</span>')
		.replace(/\b(function|new|throw|return|var|if|else)\b/gm, '<span class="keyword">$1</span>');
}