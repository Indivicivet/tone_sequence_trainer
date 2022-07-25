
function play_seq() {
	var context = new AudioContext()
	var o = context.createOscillator()
	var pitch = o.frequency
	pitch.linearRampToValueAtTime(220, 0.2)
	pitch.linearRampToValueAtTime(440, 0.5)
	o.connect(context.destination)
	o.start(0)
	o.stop(0.5)
}

document.getElementById("begin").onclick = play_seq
