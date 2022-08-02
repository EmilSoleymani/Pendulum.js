# Pendulum Simulation

Pendulum Simulation created using the `p5.js` library. For more information on `p5.js`, see [here](https://p5js.org/).

This software simulates simple pendulums, with a basic collision system.

## How to use

To use the `Pendulum` class, simply create new `Pendulum` instances and store them in an array called `pendulums`. In the `draw()` loop enter the following code to update and render pendulums:

``` javascript
for(let p of pendulums){
    p.update()
    p.render()
    p.collides()
}
```

`Pendulum` class requires the following arguments:

``` javascript
new Pendulum((x, y, length, mass, initial_angle))
```

## Improvements

Will be working on adding interactivity, better collisions
