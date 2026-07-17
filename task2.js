// Task 2: Event Loop Demonstration
// Run with: node task2.js

console.log("Program Started");

setTimeout(() => {
  console.log("Executing Delayed Task");
}, 0);

console.log("Program Finished");

/*
Output:
Program Started
Program Finished
Executing Delayed Task

How the Event Loop executes this:
----------------------------------
1. The Call Stack runs console.log("Program Started") immediately —
   this is synchronous code, so it prints first.
2. It reaches setTimeout(). Even with a delay of 0ms, setTimeout is
   handed off to libuv's timers phase, not run instantly. The main
   script keeps executing.
3. console.log("Program Finished") runs next, straight off the
   Call Stack, since it comes right after in the synchronous code.
4. Only once the Call Stack is completely empty does the Event Loop
   move to the timers phase, find the expired 0ms timer, and push
   its callback onto the stack.
5. "Executing Delayed Task" finally prints last.

The core idea: synchronous code in the main script always finishes
before any callback queued through setTimeout runs, no matter how
short the delay is set to — because the Event Loop only picks up
queued callbacks after the Call Stack is empty.
*/
