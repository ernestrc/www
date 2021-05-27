function loadPhotos() { // eslint-disable-line no-unused-vars
	var photoEl = document.getElementById('pub-photos');
	var api_url = 'https://graph.facebook.com/v10.0/instagram_oembed?access_token=145798694237169|0a3678ae40d59df4563f67a03adbdb50&omitscript=true';
	var posts = [
		'https://www.instagram.com/p/COdsaDBDeTx/',
	];

	function parseNext(response) {
		var data = JSON.parse(response);
		return data.html;
	}

	function appendLi(parent, html) {
		var li = document.createElement('LI');
		li.innerHTML = html;
		parent.appendChild(li);
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

	instgrm.Embeds.process();

	for (var i = 0; i < posts.length; i++) {
		fetchPost(posts[i]);
	}
}

