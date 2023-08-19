---
date: 2020-07-08
title: Type Safe Module Decorators In Typescript
tags: typescript,architecture
abstract: Using Typescript Utility Types to create custom module decorators to enable pluggable services.
---

## Problem

I was working on [SquashReader](https://github.com/SquashConsulting/rss-reader-backend) and realized that I wanted to make my services pluggable, meaning that with an environment variable a user may enable or disable a particular service. For example, I have a Daemon service that, when called, creates a background job that repeatedly fetches new RSS Feed updates.

The whole application does not depend on this service and if you decide that you do not want recurrent updates you will be
able to just disable that service and expect everything to work as expected.

## Approach

To enable this feature, I decided to use the [Decorator Pattern]().
Before going into the solution let me illustrate how my services are architected, so we can see what options we have.

First let's take a look at the Daemon service:

```typescript
// services/daemon.ts

export default {
  createJob,
};

function createJob(feed: Document<Repo.Feed>): void {
  DB.runService(MOUNT, SCRIPT, [feed]);
}
```

This module is then used by my `FeedController` to create background jobs on feed creation:

```typescript
// controllers/feed.ts

import Daemon from 'services/feed';

// ...

async function Create(req: Request, res: Response): Promise<void> {
  /**
   * Handling Feed creation 
   */

  Daemon.createJob(feed);
}

```
Because of the nature of my Services, using classes would not make sense as the only class feature that I'd be using would be code organization which can simply be achieved with modules. I mention this, as if I used classes I could use [Typescript Decorators](https://www.typescriptlang.org/docs/handbook/decorators.html).

That leaves us with the option of creating a decorator function that will take our module and return a modified version of it that holds our desired logic.

Let's implement it!

```typescript
// decorators/service.ts

export default function decorateService(ENV: string, Service) {
  const condition = ENV === "true";

  for (const key in Service) {
    Service[key] = function () {
      if (condition) {
        return Service[key].apply(this, arguments);
      } else {
        console.warn("Trying to call a disabled service action:", key);
      }
    };
  }

  return Service;
}
```

And then we can use this decorator with our daemon service like so:

```typescript
// services/daemon.ts

import ServiceDecorator from 'decorators/service';

export default ServiceDecorator(SOME_ENV_VAR, {
  createJob,
});

// ...
```
This works fine and when we make the service disabled via an ENV variable, the decorator does its job and warns us. However, with this solution we lose all of our types!. 

If we inspect our imported Daemon module we can see that it has an ``any`` type. So our decorator makes is impossible for Typescript to infer our decorated module's types. Let's solve this!

## Solution

Before we write our generic decorator that persists the types of its given Service, let's take a look at what Typescript gives us to solve this problem.

### Utility Types

Typescript has a bunch of Utility Types. These types help us to do a bunch of type transformations.

For example if we have an interface that has some optional fields and we want to get a type that is basically that same interface but all the fields are required, we can use the `Requred<T>` Utility Type.

```typescript
interface Props {
    a?: number;
    b?: string;
};

const obj: Props = { a: 5 }; // OK

const obj2: Required<Props> = { a: 5 }; // Error: property 'b' missing
```
### TypeSafe Decorator

To solve our problem we need to find a way to infer the function signatures of our module functions.
In order to achieve this we are going to use two very useful Utility Types:
- `Parameters<T>` - Constructs a tuple type of the types of the parameters of a function type `T`.
- `ReturnType<T`> - Constructs a type consisting of the return type of function `T`.


First let's create a separate function that given a Service method and a condition returns a modified version of the method that handles our desired logic.

```typescript
// decorators/service.ts

function decorateMethod<T extends (...args: any[]) => any>(
  method: T,
  condition: boolean,
): (...funcArgs: Parameters<T>) => ReturnType<T> {
  return (...args: Parameters<T>): ReturnType<T> => {
    if (condition) {
      return method(...args);
    } else {
      console.warn("Trying to a call a disabled service action:", method.name);
    }
  };
}
```

Notice how we utilize the above-mentioned Utility Types to persist the type signature of Service actions.

Next we need a service-decorator function that given a service module returns a modified module that has the exact same keys as the service but the corresponding values are decorated using the function above.

```typescript
// decorators/service.ts

type DecoratedService<T extends { [key: string]: (...args: any[]) => any }> = {
  [key in keyof T]: (...args: Parameters<T[key]>) => ReturnType<T[key]>;
};

export default function decorateService<
  T extends { [key: string]: (...args: any[]) => any }
>(ENV: string, Service: T): DecoratedService<T> {
  const condition = ENV === "true";

  let tempObj: { [key: string]: any } = {};

  for (const key in Service) {
    tempObj[key] = decorateMethod(Service[key], condition);
  }

  return tempObj as DecoratedService<T>;
}
```

That's it! Now if go to our controller and inspect the imported Daemon module we can see that all the functions kept their original signatures.

## Links

This project is a part of SquashReader, a modern, federated, collaborative RSS reader.

You can check out the source code [here](https://github.com/SquashConsulting/SquashReader).
The code for this article is located in the `backend` submodule.

