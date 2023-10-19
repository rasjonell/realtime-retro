---
date: 2023-10-19
tags: data-structures,architecture
title: "FAFO: The Newest Tech Abbreviation You Didn't Know You Needed!"
abstract: FIFO and LIFO sequences are fine, but have you ever tried something as unpredictable and chaotic as FAFO?
---

So, we all know about FIFO and LIFO, right? They're like the good kids of tech buzzwords. But have you met their wild cousin, FAFO? It's like your uncle at a family dinner – unpredictable, a bit crazy, and full of surprises! Get ready for a tech lingo roller-coaster, where rules in alignment docs are meant to be bent, and predictability is taking a mandatory time-off to focus on its mental health.


## Intro To Sequences
If you're just one of those low-lives who decided not to take tens of thousands of dollars in student-loan debts and skipped the academic rollercoaster and dived straight into a 3-6 month bootcamp, actually making money and providing for your family like a complete idiot, you may not know what FIFO and LIFO sequences are, so let me just break it down for you.

In the tech world, where jargon is as common as lay-offs, there's **FIFO** and **LIFO** - acronyms that have *real* engineers sipping their coffee and having existential crises.

**FIFO** or 'First-In-First-Out', much like the San Francisco tech crowd patiently sipping their meticulously crafted boba teas, is all about maintaining order – ensuring that the *first bubble in is the first one out!*

The `Queue` data structure is the perfect example of a **FIFO** sequence:

```typescript
class Queue<T> {
    private elements: T[] = [];

    enqueue(element: T): void {
        this.elements.push(element);
    }

    dequeue(): T | undefined {
        return this.elements.shift();
    }

    get size(): number {
        return this.elements.length;
    }
}
```

In this implementation, the `Queue` class has methods for adding elements (`enqueue`), removing elements (`dequeue`), and getting the size of the queue (`size`). The queue stores elements of generic type `T`. You can create a `Queue` object and use these methods to manage the queue as needed.

```typescript
const queue = new Queue<number>();

queue.enqueue(1);
queue.enqueue(2);
queue.enqueue(3);

console.log("Queue size:", queue.size); // Output: 3
console.log("Removed Item:", queue.dequeue()); // Output: 1
console.log("Queue size after removing:", queue.size); // Output: 2
```

FIFO queues are widely used in various real-life scenarios where the order of processing is important.

### Example: Printer Job Queue

In a printer spooler system, print jobs are processed in the order they are received. A FIFO queue can be used to manage the print job queue.

```typescript
class PrinterSpooler {
    private printQueue: Queue<string> = new Queue<string>();

    addPrintJob(job: string): void {
        this.printQueue.enqueue(job);
    }

    processPrintJobs(): void {
        while (this.printQueue.size !== 0) {
            const job = this.printQueue.dequeue();
            console.log(`Printing: ${job}`);
        }
    }
}

// Example usage
const spooler = new PrinterSpooler();
spooler.addPrintJob("Document 1");
spooler.addPrintJob("Document 2");
spooler.addPrintJob("Document 3");

spooler.processPrintJobs();
```

In these example, the FIFO nature of the queue ensures that operations are performed in the order in which they were added, making it suitable for scenarios where the first item in should be the first item out.

**LIFO**, or 'Last-In-First-Out,' is like managing your email inbox – the latest message that arrives is the first one demanding your attention, just like urgent cross-functional all-hands alignment meeting invites!

`Stack` data structure is the perfect example of **LIFO**  sequences.

```typescript
class Stack<T> {
    private elements: T[] = [];

    push(element: T): void {
        this.elements.push(element);
    }

    pop(): T | undefined {
        return this.elements.pop();
    }

    get size(): number {
        return this.elements.length;
    }
}
```

In this implementation, the `Stack` class has methods for adding elements (`push`), removing elements (`pop`), and getting the size of the stack (`size`). The stack stores elements of generic type `T`. You can create a `Stack` object and use these methods to manage the stack as needed.

```typescript
const stack = new Stack<number>();

stack.push(1);
stack.push(2);
stack.push(3);

console.log("Stack size:", stack.size); // Output: 3
console.log("Popped item:", stack.pop()); // Output: 3
console.log("Stack size after pop:", stack.size); // Output: 2
```

`Stacks` are commonly used in various scenarios, such as function call management in programming languages, backtracking algorithms, managing history in web browsers, etc.

### Example: Browser History

```typescript
class BrowserHistory {
    private pageStack: Stack<string> = new Stack<string>();

    visitPage(pageUrl: string): void {
        this.pageStack.push(pageUrl);
        console.log(`Visited Page: ${pageUrl}`);
    }

    navigateBack(): void {
        const previousPage = this.pageStack.pop();
        console.log(`Navigating back to: ${previousPage}`);
    }
}

// Example usage
const browserHistory = new BrowserHistory();

browserHistory.visitPage("https://gurgen.info");
browserHistory.visitPage("https://gurgen.info/blog");
browserHistory.visitPage("https://www.gurgen.info/blog/awk-for-csv");


browserHistory.navigateBack(); // Output: Navigating back to: https://gurgen.info/blog
browserHistory.navigateBack(); // Output: Navigating back to: https://gurgen.info
```

Now, forget the rules of FIFO and LIFO, because it's time to meet FAFO, the sequence that's as wild as your company's bi-yearly offsite gathering. In the world of **FAFO** there are no rules, just spontaneous surprises. What's FAFO? Let's Fuck Around and Find Out!

In a Fuck-Around-and-Find-Out sequence, elements are managed without any specific rules, exposing only completely random operations.

```typescript
class FAFO<T> {
  private elements: T[] = [];

  add(element: T): void {
    this.elements.splice(
      Math.floor(Math.random() * (this.elements.length + 1)),
      0,
      element
    );
  }

  remove(): T | undefined {
    if (this.elements.length === 0) {
      return undefined;
    }

    return this.elements.splice(
      Math.floor(Math.random() * this.elements.length),
      1
    )[0];
  }

  findOut(): T | undefined {
    if (this.elements.length === 0) {
      return undefined;
    }

    return this.elements[Math.floor(Math.random() * this.elements.length)];
  }

  get size(): number {
    return this.elements.length;
  }
}
```

In this implementation, the `add` method adds elements at random positions, the `remove` method removes a random element, and the `findOut` method retrieves a random element from the sequence. The order of elements is not fixed, and elements can be inserted and removed randomly.

```typescript
const fuckAround = new FAFO<number>();

fuckAround.add(1);
fuckAround.add(2);
fuckAround.add(3);

console.log("FAFO Sequence size:", fuckAround.size); // Output: 3

const randomElement = fuckAround.findOut();
console.log("Random Element:", randomElement);

const removedElement = fuckAround.remove();
console.log("Removed Element:", removedElement);
console.log("Size after removal:", fuckAround.size); // Output: 2
```

Jokes aside, the creation of FAFO found its roots in a serious need. While working on a system that lets people work on distributed sequences together in real-time (think of Google Docs or Figma), I had a problem. I needed to see how our system handled lots of people doing random things like adding or deleting text at random positions. It's like when friends all want to edit a single google doc at once – things can get chaotic! That's why I created FAFO. It helped me test and benchmark our system against this kind of unpredictability, so we could make sure it works smoothly even when people are being spontaneous and creative together.
