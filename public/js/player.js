Player = function() {
	var that = this;
	var queuedSongs = [];
	var playedSongs = []; 
	var currentSong;
	var currentSongPercentDone = 0;
	var isPlaying;

	this.addSongToQueue = function(song) {
		if(!currentSong) {
			handleChangeToSong(song);
			return;
		}
		queuedSongs.push(song);
	}

	this.addSongsToQueue = function(_songs) {
		for(var i in _songs) {
			that.addSongToQueue(_songs[i]);
		}
	}	

	this.getQueuedSongs = function() {
		return queuedSongs;
	}

	this.getPlayedSongs = function() {
		return playedSongs;
	}

	this.nextSong = function() {
		if(queuedSongs.length === 0) {
			console.log('No more songs in queue');
			// Say no more songs

			return;
		}

		var song = queuedSongs.shift();
		console.log('Skipping song to  ' + JSON.stringify(song));

		handleChangeToSong(song);

	}

	function handleChangeToSong(newSong) {
		if(currentSong) {
			playedSongs.push(currentSong);
		}
		currentSong = newSong;
		currentSongPercentDone = 0;

		updateSongProgressUI();
		$('#current-song-title').text(currentSong.title);
		$('#current-song-artist').text(currentSong.artist);
		$('#current-song-icon').css({
			'background-image': 'url('+currentSong.imageUrl+')'
		})
	}

	function handlePlay() {
		// TODO
		isPlaying = true;
	}

	function handlePause() {
		// TODO
		isPlaying = false;
	}


	$('#next-song-btn').click(function() {
		that.nextSong();
	});

	$('#pause-btn').click(function() {
		$(this).hide();
		$('#play-btn').show();
		handlePause();
	});

	$('#play-btn').click(function() {
		$(this).hide();
		$('#pause-btn').show();
		handlePlay();
	});

	
	setInterval(function(){
		if(!isPlaying)
			return;
		++currentSongPercentDone;
		updateSongProgressUI();
	},100);

	function updateSongProgressUI() {
		$('#current-song-progress > .progress-bar').css({width: currentSongPercentDone/10+'%'});
	}
}