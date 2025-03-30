# Mandelbrot!

This project contains two Mandelbrot set renderers:

- TypeScript renderer that runs on the CPU
  - Advantages:
    - Uses double-precision numbers so can zoom in a fair way
    - Implemented from scratch (including all the maths) by me, so at least I understand it
  - Disadvantages:
    - Relatively slow
- WebGL renderer that runs on the GPU; written by the Cursor IDE (because I have yet to learn WebGL)
  - Advantages:
    - Blazingly fast; highly parallelisable tasks like this are great for the GPU
  - Disadvantages:
    - WebGL only supports single-precision (32-bit) floats so you can't zoom in very far
    - Cursor did a sterling job of writing it but it wasn't perfect and required a lot of refactoring and fixing
    - I still don't understand it; I must learn WebGL and try to understand how GPUs work
