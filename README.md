# waveformr (play with the app [here](https://msabin.github.io/waveformr/))

<img src="/screencaps/drawing-demo.gif" width="500">

waveformr is a GUI for visually sculpting your own fundamental waveform!  

**Play with the app [here](https://msabin.github.io/waveformr/)!!**

Draw a waveform in either the time domain or in the frequency domain and use waveformr as an Oscillator to play melodies with a MIDI controller, sound design the exact tone you're looking for, or experientially learn how sound in the time domain relates to sound in the frequency domain.

This project was built using the React framework for JavaScript, the Web Audio and Web MIDI APIs to deal with sound and connecting to MIDI controllers, and a barebones [JavaScript implementation](https://www.nayuki.io/page/free-small-fft-in-multiple-languages) of the Fourier transform.



<!-- <img src="/screencaps/drawing-demo2.gif" width="350"> -->

## Usage

- Plug and play with a MIDI keyboard! (Safari does not support MIDI)\
**OR**\
Use the keyboard as a piano (black keys are on QWERTY row, white keys are ASDF row):\
-WE-TYU-\
ASDFGHJK
- Draw on the screen with your mouse to draw a waveform
- M key: Mute the sound
- +/- keys: Incrementally increase/decrease the volume
- 1/2/3/4 keys: Use the buttons with pictures of different waves on them to fill the waveform in with presets
- Change the pitch by semi-tones with the arrow buttons on the GUI, type in the Hz display box to change the pitch to your desired Hz, or play the waveform with a the keyboard piano layout or a MIDI piano to pitch the wave at will
- Enter key: Toggle between time domain and frequency domain for two methods of shaping a waveform that sync with each other


## Installation
Visit [here](https://msabin.github.io/waveformr/) to play with the app in a browser immediately and you can use the browser's developer tools to explore and modify the transpiled *deployment version* of the code!

To download, explore, and modify the *source/development version* code yourself, these installation instructions should work for MacOS with the default shell:

Open a directory on your computer that you want to download this repository to and clone it from GitHub from the command line with

`git clone https://github.com/msabin/waveformr.git`

If you don't have `npm` already installed (the package manager for JavaScript libraries) that should be [done first](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).  Then, in the directory that you cloned this repo to, run

`npm install`

This will install all the dependencies for the project and a new folder called `node-modules` should appear in your directory.  Lastly run

`npm run dev`

This should use [Vite](https://vitejs.dev/guide/) to run a local server on your machine to host the application.  The terminal should have a line that looks something like:

`Local:   http://localhost:5173/waveformr`

The number may be different but if you put the link it gives you in your browser of choice (note: Safari does not support MIDI), you should see the application running.

With Vite, changes you make to the code will be immediately reflected on your browser page.
