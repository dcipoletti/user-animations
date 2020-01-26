# user-animations
user-animations/single_stack_animation reflects interaction research, prototyping, and deploying production-ready interactions and micro-interactions for scrollign through video assets.

The video asset cards can be clicked on and the rolodex animation will occur up to the card selected. Greensock was leveraged to achieve smooth scaling and GPU-assisted movements.

Note: jQuery and Hammer.js are present for testing purposes only (prototyping swipe detections) Never intended for production use.

## Simple Setup

This repo is leveraging bower (will move to yarn shortly!)

I left bower_components intact in this instance because bower is mostly deprecated. 
After pulling the repo, run `python -m SimpleHTTPServer` to run the static code.
Navigate to `http://127.0.0.1:8000/single_stack_animation/` to view it!
