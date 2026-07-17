// Task 1: Understanding Asynchronous Execution
// Run with: node task1.js

console.log("Start");

setTimeout(() => {
  console.log("This message appears after 2 seconds.");
}, 2000);

console.log("End");

/*
Expected Output:
Start
End
This message appears after 2 seconds.

Why does "End" print before the delayed message?
--------------------------------------------------
Node.js runs JavaScript on a single main thread and executes code
line by line through the Call Stack. setTimeout() is not part of
the V8 engine itself — it's an API provided by libuv/the Node APIs.
When the engine reaches setTimeout(), it hands the callback and the
2000ms timer off to libuv and immediately moves on to the next line
in the script, without waiting for the timer to finish.

So the Call Stack finishes running "Start" and "End" first, because
that's synchronous code sitting directly in the main script. Only
after the stack is empty does the Event Loop check the Callback
Queue, see that the 2-second timer has completed, and push the
setTimeout callback onto the stack to run. That's why "End" — even
though it appears after setTimeout() in the code — logs before the
delayed message.
*/
