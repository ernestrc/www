function loadPhotos() { // eslint-disable-line no-unused-vars
	var photoEl = document.getElementById('pub-photos');
	var api_url = 'https://graph.facebook.com/v10.0/instagram_oembed?access_token=145798694237169|0a3678ae40d59df4563f67a03adbdb50&omitscript=true';
	var posts = [
		'https://www.instagram.com/p/COdsaDBDeTx/',
		'https://www.instagram.com/p/CDMusEhD0YF/',
		'https://www.instagram.com/p/CCUmF9Ojfnz/',
		'https://www.instagram.com/p/CORDAC0jrI7/',
	];
	var postElements = [];

	function parseNext(response) {
		var data = JSON.parse(response);
		return data.html;
	}

	function appendLi(parent, html) {
		var li = document.createElement('DIV');
		li.innerHTML = html;
		parent.appendChild(li);
		postElements.push(li);
	}


	function fetchPost(post) {
		var url = api_url + '&url=' + post;
		var xhttp = new XMLHttpRequest();

		console.log('loading ' + url);

		xhttp.open('GET', url, true);
		xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				var html = parseNext(xhttp.response);
				appendLi(photoEl, html)
			}
		};
		xhttp.send();
	}

	for (var i = 0; i < posts.length; i++) {
		fetchPost(posts[i]);
	}

	var observer = new MutationObserver(function() {
		var rendered = postElements.reduce((res, el) => res && document.contains(el), true);
		if (postElements.length == posts.length && rendered) {
			observer.disconnect();
			instgrm.Embeds.process();
		}
	});
	
	observer.observe(document, {attributes: false, childList: true, characterData: false, subtree:true});
}
