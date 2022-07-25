
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


// num markers is definitive! :)
var markers = document.getElementsByClassName("marker")
var typing_marker_idx = 0

var num_tones_box = document.getElementById("num_tones")

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
	markers[i].classList.add("playing")
}


function choose_and_play_seq() {
	// get a list of random tone vals ("keys")
	var tone_vals = Object.keys(tones)
	var tone_seq = []
	for (i = 0; i < markers.length; i++) {
		tone_seq.push(tone_vals[Math.floor(Math.random() * tone_vals.length)])
	}
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
		// todo :: really should work this out :))
		var f = [
			() => playingMarker(0),
			() => playingMarker(1),
			() => playingMarker(2),
			() => playingMarker(3),
			() => playingMarker(4),
			() => playingMarker(5),
			() => playingMarker(6),
			() => playingMarker(7),
			() => playingMarker(8),
			() => playingMarker(9),
			() => playingMarker(10),
			() => playingMarker(11),
			() => playingMarker(12),
			() => playingMarker(13),
			() => playingMarker(14),
			() => playingMarker(15),
			() => playingMarker(16),
		]
		setTimeout(f[i], t * 1000)
		t += vocalize_duration
		setTimeout(unplayingAllMarkers, t * 1000)
		t += pause_duration
	}
}


function keypress(e) {
	if (e.key == "x") {
		typing_marker_idx--
		markers[typing_marker_idx].textContent = ""
		return
	}
	if (!(e.key in tones)) {
		return
	}
	if (e["target"] == num_tones_box) {
		console.log("typed in tones setting` box")
		return
	}
	if (typing_marker_idx >= markers.length) {
		// todo out of bounds/complete
		return
	}
	markers[typing_marker_idx].textContent = e.key
	typing_marker_idx++
}


function createMarkers(n) {
	var marker_zone = document.getElementById("marker_zone")
	while (marker_zone.firstChild) {
		marker_zone.removeChild(marker_zone.firstChild)
	}
	for (i = 0; i < n; i++) {
		var marker = document.createElement("div")
		marker.setAttribute("class", "marker")
		marker_zone.appendChild(marker)
	}
}


function set_num_tones(e) {
	var txt = e.target.innerText
	var val = parseInt(txt)
	if (isNaN(val)) {
		console.log("not an int")
		return
	}
	if (val > 15) {
		// todo bettr
		console.log("15 is max")
		val = 15
		e["target"].innerText = val
	}
	console.log(val)
	createMarkers(val)
}


// gameplay
document.getElementById("begin").onclick = choose_and_play_seq
document.addEventListener("keypress", keypress);

// settings
num_tones_box.oninput = set_num_tones

createMarkers(parseInt(num_tones_box.innerText))
