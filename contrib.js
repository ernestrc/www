function loadContrib() { // eslint-disable-line no-unused-vars
	var contribEl = document.getElementById('pub-contrib');
	var createEl = document.getElementById('pub-create');
	var TOTAL_PAGES = 10;
	var page = 0;
	var pushes = {};
	var creates = {};

	function appendLi(parent, linkText, linkUrl, text) {
		var li = document.createElement('LI');
		var b = document.createElement('B');
		var a = document.createElement('A');
		a.href = linkUrl;
		b.innerHTML = linkText;
		a.appendChild(b);
		li.appendChild(a);
		if (text) {
			li.appendChild(document.createTextNode(text));
		}

		parent.appendChild(li);

		return li;
	}

	function renderCreates() {
		while (createEl.firstChild) {
			createEl.removeChild(createEl.firstChild);
		}
		var createIds = Object.keys(creates);

		if (createIds.length === 0)
			return;

		createEl.appendChild(document.createTextNode('Created ' + createIds.length + ' repositories: '));
		var ul = document.createElement('UL');
		createEl.appendChild(ul);

		for (var i = 0, len = createIds.length; i < len; i++) {
			var repo = creates[createIds[i]];
			var li = appendLi(ul, repo.name, repo.url, repo.description);
		}
	}

	function renderContrib() {
		while (contribEl.firstChild) {
			contribEl.removeChild(contribEl.firstChild);
		}
		var pushIds = Object.keys(pushes);

		contribEl.appendChild(document.createTextNode('Contributed to ' + pushIds.length + ' repositories: '));
		var ul = document.createElement('UL');
		contribEl.appendChild(ul);

		for (var i = 0, len = pushIds.length; i < len; i++) {
			var repo = pushes[pushIds[i]];
			var commits = Object.keys(repo.commits);

			var li = appendLi(ul, repo.name, repo.url);
			var c = document.createElement('UL');

			for (var j = 0, len2 = commits.length; j < len2; j++) {
				var sha = commits[j];
				var commit = repo.commits[sha];
				appendLi(c, sha.slice(0, 7), 'https://github.com/' + repo.name + '/commit/' + sha, ': ' + commit.message);
			}

			li.appendChild(c);
		}
	}

	function getRepoUrl(obj) {
		return 'https://github.com/' + obj.repo.name;
	}

	function aggregate(obj) {
		var repoId = obj.repo.id;
		var repo;

		switch(obj.type) {
		case 'PushEvent':
			repo = pushes[repoId] || (function(){
				var rdata = {
					name: obj.repo.name,
					url: getRepoUrl(obj),
					commits: {},
				};
				pushes[repoId] = rdata;
				return rdata;
			})();
			var commits = obj.payload.commits;
			for (var j = 0, len2 = commits.length; j < len2; j++) {
				var commit = commits[j];
				repo.commits[commit.sha] = {
					message: commit.message
				};
			}
			break;
		case 'CreateEvent':
			switch (obj.payload.ref_type) {
			case 'repository':
				creates[obj.repo.id] = {
					name: obj.repo.name,
					url: getRepoUrl(obj),
				};
				break;
			default:
				console.log(obj.payload);
			}
			break;
		default:
			console.log(obj);
		}
	}

	function parseNext(response) {
		var data = JSON.parse(response);
		for (var i = 0, len = data.length; i < len; i++) {
			var obj = data[i];
			aggregate(obj);
		}
	}

	function fetchNext() {
		if (++page <= TOTAL_PAGES) {
			var xhttp = new XMLHttpRequest();
			xhttp.open('GET', 'https://api.github.com/users/ernestrc/events', true);
			xhttp.onreadystatechange = function() {
				if (this.readyState == 4 && this.status == 200) {
					parseNext(xhttp.response);
					renderContrib();
					renderCreates();
					fetchNext();
				}
			};
			xhttp.send('page=' + page);
		}
	}

	fetchNext();
}
