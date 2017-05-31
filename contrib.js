function loadContrib() { // eslint-disable-line no-unused-vars
	var contribEl = document.getElementById('pub-contrib');
	var createEl = document.getElementById('pub-create');
	var forkEl = document.getElementById('pub-fork');
	var TOTAL_PAGES = 10;
	var page = 0;
	var pushes = {};
	var forks = {};
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

	function getWordRepo(i) {
		return i > 1 ? 'repositories' : 'repository';
	}

	function renderList(parent, data, action, append) {
		var ids = Object.keys(data);

		if (ids.length === 0)
			return;

		while (parent.firstChild) {
			parent.removeChild(parent.firstChild);
		}

		var li = document.createElement('LI');
		li.appendChild(document.createTextNode(action + ' ' + ids.length + ' ' + getWordRepo(ids.length) + ': '));
		parent.appendChild(li);

		var ul = document.createElement('UL');
		for (var i = 0, len = ids.length; i < len; i++) {
			var datum = data[ids[i]];
			append(ul, datum);
		}

		li.appendChild(ul);
	}

	function getRepoUrl(obj) {
		return 'https://github.com/' + obj.repo.name;
	}

	function renderContrib(ul, repo) {
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

	function renderRepo(ul, repo) {
		appendLi(ul, repo.name, repo.url, repo.description);
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
			case 'ForkEvent':
				forks[obj.repo.id] = {
					name: obj.repo.name,
					url: getRepoUrl(obj),
					description: obj.repo.description
				};
				break;
			case 'CreateEvent':
				switch (obj.payload.ref_type) {
					case 'repository':
						creates[obj.repo.id] = {
							name: obj.repo.name,
							url: getRepoUrl(obj),
							description: obj.repo.description
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
					renderList(contribEl, pushes, 'Pushed changes to', renderContrib);
					renderList(createEl, creates, 'Created', renderRepo);
					renderList(forkEl, forks, 'Forked', renderRepo);
					fetchNext();
				}
			};
			xhttp.send('page=' + page);
		}
	}

	fetchNext();
}
