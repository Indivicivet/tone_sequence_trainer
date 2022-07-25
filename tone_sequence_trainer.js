
// mandarin tones, first pass approximation
// todo :: less bad
var tones = {
	1: [[0, 1]],  // high
	2: [[0.1, 0], [0.9, 1]],  // up
	3: [[0, 0.3], [0.5, 0], [1, 0.5]],  // low and wobbly
	4: [[0.1, 1], [0.9, 0]],  // down
}
// todo :: tones for specific pairs
// todo :: no tone


var markers = document.getElementsByClassName("marker")

var vocalize_duration = 0.3
var pause_duration = 0.1


function play_tone_seq(...tones) {
	var context = new AudioContext()
	var o = context.createOscillator()
	var gain = context.createGain()
	
	var min_pitch = 240
	var max_pitch = 300
	
	function rel_pitch_to_hz(rel) {
		return rel * (max_pitch - min_pitch ) + min_pitch
	}
	
	var t = 0
	for (j = 0; j < tones.length; j++){
		pitches = tones[j]
		gain.gain.setValueAtTime(1, t)
		o.frequency.setValueAtTime(rel_pitch_to_hz(pitches[0][1]), t)
		for (i = 0; i < pitches.length; i++) {
			o.frequency.linearRampToValueAtTime(
				rel_pitch_to_hz(pitches[i][1]),
				t + pitches[i][0] * vocalize_duration
			)
		}
		t += vocalize_duration
		gain.gain.setValueAtTime(0, t)
		if (j < tones.length - 1) {
			t += pause_duration
		}
	}
	o.connect(gain).connect(context.destination)
	o.start(0)
	o.stop(t)
}


function unplayingAllMarkers() {
	for (i = 0; i < markers.length; i++) {
		markers[i].classList.remove("playing")
	}
}


function playingMarker(i) {
	console.log(i)
	markers[i].classList.add("playing")
}


function choose_and_play_seq() {
	// todo :: tone seq based on # of markers
	var tone_seq = [1, 2, 3, 4, 1]
	play_tone_seq(
		...tone_seq.map(t => tones[t])
	)
	// todo :: urgh, it's gonna be kinda a pain to keep this
	// in sync with the tone playing, isn't it?
	// consider refactor. (but I want something playable first)
	
	// duplicated time tracking code :(
	t = 0
	for (i = 0; i < markers.length; i++) {
		// todo :: do I actually have to do this...?
		var f = [
			function(){ playingMarker(0) },
			function(){ playingMarker(1) },
			function(){ playingMarker(2) },
			function(){ playingMarker(3) },
			function(){ playingMarker(4) },
		]
		setTimeout(f[i], t * 1000)
		t += vocalize_duration
		setTimeout(unplayingAllMarkers, t * 1000)
		t += pause_duration
	}
}


document.getElementById("begin").onclick = choose_and_play_seq
