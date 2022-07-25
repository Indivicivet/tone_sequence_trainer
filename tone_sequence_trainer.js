
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


var tone_display_sets = {
	"numerical": {1: 1, 2: 2, 3: 3, 4: 4},
	"ma_simplified": {1: "妈", 2: "麻", 3: "马", 4: "骂"},
}

// num markers is definitive! :)
var markers = document.getElementsByClassName("marker")
var typing_marker_idx = 0

// todo :: more sensible maybe
var entered_seq = ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]

var num_tones_box = document.getElementById("num_tones")

// todo :: FUTURE SETTINGS BIN
var mark_on_completion = true  // todo :: setting
var display_set = "ma_simplified"  // todo :: setting

var seq

var vocalize_duration = 0.3
var pause_duration = 0.1


// todo :: consistent camelCase for functions?
// sry I don't know JS :D
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


function generateSequence() {
	// get a list of random tone vals ("keys")
	var tone_vals = Object.keys(tones)
	var tone_seq = []
	for (i = 0; i < markers.length; i++) {
		tone_seq.push(tone_vals[Math.floor(Math.random() * tone_vals.length)])
	}
	return tone_seq
}


function playCurrentSequence() {
	play_tone_seq(
		...seq.map(t => tones[t])
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


function begin() {
	seq = generateSequence()
	playCurrentSequence()
}


function repeat() {
	if (seq == undefined) {
		begin()
	} else {
		playCurrentSequence()
	}
}


function markTones() {
	for (i = 0; i < markers.length; i++) {
		c = markers[i].classList
		c.remove("correct")
		c.remove("incorrect")
		c.remove("missing")
		if (entered_seq[i] == seq[i]) {
			c.add("correct")
		} else if (entered_seq[i] == "") {
			c.add("missing")
		} else {
			c.add("incorrect")
		}
	}
}


function setTypeMarkerIdx(idx) {
	markers[typing_marker_idx].classList.remove("typetarget")
	typing_marker_idx = idx
	markers[typing_marker_idx].classList.add("typetarget")
}


function moveTypeMarkerLeft() {
	if (typing_marker_idx > 0) {
		setTypeMarkerIdx(typing_marker_idx - 1)
	}
}


function moveTypeMarkerRight() {
	if (typing_marker_idx < markers.length - 1) {
		setTypeMarkerIdx(typing_marker_idx + 1)
	}
}


function enterValue(val) {
	markers[typing_marker_idx].textContent = tone_display_sets[display_set][val]
	entered_seq[typing_marker_idx] = val
}


function keydown(e) {
	if (e.key == "r") {
		repeat()
		return
	}
	if (e.key == "n") {
		begin()
		return
	}
	if (e.key == "ArrowLeft") {
		moveTypeMarkerLeft()
		return
	}
	if (e.key == "ArrowRight") {
		moveTypeMarkerRight()
		return
	}
	if (e.key == "Backspace") {
		moveTypeMarkerLeft()
		enterValue("")
		return
	}
	if (e.key == "x" || e.key == "Delete") {
		enterValue("")
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
		return
	}
	// todo :: maybe still a bug with typing markers and going in/out of
	// the settings box
	enterValue(e.key)
	if (typing_marker_idx == (markers.length - 1) && mark_on_completion) {
		markTones()
	}
	moveTypeMarkerRight()
}


function createMarkers(n) {
	var marker_zone = document.getElementById("marker_zone")
	while (marker_zone.firstChild) {
		marker_zone.removeChild(marker_zone.firstChild)
	}
	for (i = 0; i < n; i++) {
		var marker = document.createElement("div")
		marker.setAttribute("class", "marker")
		if (i == 0) {
			marker.classList.add("typetarget")
		}
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
document.getElementById("begin").onclick = begin
document.getElementById("repeat").onclick = repeat
document.addEventListener("keydown", keydown);

// settings
num_tones_box.oninput = set_num_tones

createMarkers(parseInt(num_tones_box.innerText))
