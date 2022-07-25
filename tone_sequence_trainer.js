var context = new AudioContext()
var o

var beeping = false

document.getElementById("trainer").onclick = function() {
	if (beeping) {
		o.stop()
		beeping = false
	} else {
		o = context.createOscillator()
		o.connect(context.destination)
		o.start()
		beeping = true
	}
}
