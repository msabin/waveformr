# waveformr

<img src="/screencaps/drawing-demo.gif" width="640">

waveformr is an **in progress** project for visually sculpting your own fundamental waveform!  

Draw a waveform in either the time domain or in the frequency domain and use waveformr as an Oscillator to feed into another application (like a subtractive synth), play melodies at will with a MIDI controller, or sound design the exact tone you're looking for.

This project uses the [p5.js](https://p5js.org/) library for interacting with and displaying the canvas, the Web Audio and Web MIDI APIs to deal with sound and connecting to MIDI controllers, and a barebones [JavaScript implementation](https://www.nayuki.io/page/free-small-fft-in-multiple-languages) of the Fourier transform.

A React-built GUI wrapper for interacting with waveformr with extended functionality is under construction and coming soon!


<p>
<img src="/screencaps/rhythmonics-blur.png" width="350">
<img src="/screencaps/rhythmonics-quartet.png" width="350">
<img src="/screencaps/rhythmonics-all.png" width="350">
<img src="/screencaps/rhythmonics-harmony.png" width="350">
</p>



## Installation
This project will soon be hosted at a domain to link to and play with in the browser but, for now, you can clone the repository here and run it yourself locally.

These installation instructions should work for MacOS with the default shell:

Open a directory on your computer that you want to download this repository to and clone it from GitHub from the command line with

`git clone https://github.com/msabin/waveformr.git`

Feel free to use your own local build environment if wanted, but a simple way to run a local server if you have Python is to go to waveformr's directory and run

`python3 -m http.server`

Put the link of the port that this Python module opened (e.g. `http://localhost:8000/`) and play with waveformr!


## Usage

- Plug and play with a MIDI keyboard!
- Draw on the screen with your mouse to draw a waveform
- Press `F` to flip betweem time domain and frequency domain
- Press `R` to reset the wave to silence
- Press left and right arrows to change pitch down and up by a semitone

## TO-DO

### In Progress

1. Build a GUI around the canvas with the React framework
  - Hz and volume sliders
  - Buttons to flip between time and frequency domains, mute, and reset
2. Make the drawing smoother and fix snapping between points
3. Host the application on a server

### Next Up
- Allow importing and exporting `.wav` files (drag-and-drop file onto canvas)
- Connect it to other apps as a real-time usable Oscillator (starting with [rhythmonics](https://github.com/msabin/rhythmonics))
- Make everything pretty to see and smooth to use