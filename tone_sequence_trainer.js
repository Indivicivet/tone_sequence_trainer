
function play_seq() {
	var context = new AudioContext()
	var o = context.createOscillator()
	o.connect(context.destination)
	o.start(0)
	o.stop(0.5)
}

document.getElementById("begin").onclick = play_seq
