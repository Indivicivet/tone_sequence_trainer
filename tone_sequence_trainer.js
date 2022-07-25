
// mandarin tones, first pass approximation
// todo :: less bad
var tones = {
	1: [[0, 1]],  // high
	2: [[0, 0], [1, 1]],  // up
	3: [[0, 0.3], [0.5, 0], [1, 0.5]],  // low and wobbly
	4: [[0, 1], [1, 0]],  // down
}
// todo :: tones for specific pairs
// todo :: no tone


function play_tone(pitches) {
	var context = new AudioContext()
	var o = context.createOscillator()
	var length = 0.5
	var min_pitch = 220
	var max_pitch = 440
	var pitch = o.frequency
	for (i = 0; i < pitches.length; i++) {
		pitch.linearRampToValueAtTime(
			pitches[i][0] * (max_pitch - min_pitch) + min_pitch,
			pitches[i][1] * length
		)
	}
	o.connect(context.destination)
	o.start(0)
	o.stop(length)
}


function choose_and_play_tone() {
	var tone_name = 3  // todo
	play_tone(tones[tone_name])
}


document.getElementById("begin").onclick = choose_and_play_tone
