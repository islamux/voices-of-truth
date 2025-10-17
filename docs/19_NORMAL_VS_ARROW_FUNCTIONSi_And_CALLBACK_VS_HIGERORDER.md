# Normal Functions vs. Arrow Functions: Best Practices in "Voices of Truth"

As a junior developer, understanding when to use a "normal" function declaration (`function myFunction() { ... }`) versus an arrow function (`const myFunction = () => { ... };`) is crucial for writing clean, maintainable, and idiomatic JavaScript/TypeScript in our Next.js project. While both achieve similar results in many cases, there are subtle differences and best practices that guide our choices.

---

## Key Differences & Considerations

### 1. `this` Binding

This is the most significant difference.

*   **Normal Functions:** Have their own `this` context. The value of `this` depends on how the function is called.
    ```typescript
    // Example: Normal function
    const myObject = {
      value: 10,
      getValue: function() {
        console.log(this.value); // 'this' refers to myObject
      }
    };
    myObject.getValue(); // Output: 10

    const standaloneGetValue = myObject.getValue;
    standaloneGetValue(); // Output: undefined (or error in strict mode) - 'this' is now global/undefined
    ```

*   **Arrow Functions:** Do *not* have their own `this` context. They lexically inherit `this` from their parent scope at the time they are defined.
    ```typescript
    // Example: Arrow function
    const myObject = {
      value: 10,
      getValue: () => {
        console.log(this.value); // 'this' refers to the global 'this' (window in browser, undefined in module)
      }
    };
    myObject.getValue(); // Output: undefined (or error)
    ```
    **However, this behavior is often *desirable* in React components, especially within class components (though less relevant in functional components with hooks).**

### 2. `arguments` Object

*   **Normal Functions:** Have their own `arguments` object, which contains all arguments passed to the function.
*   **Arrow Functions:** Do *not* have their own `arguments` object. They inherit it from their parent scope. You should use rest parameters (`...args`) instead.

### 3. Constructor (`new`)

*   **Normal Functions:** Can be used as constructors with the `new` keyword to create new objects.
*   **Arrow Functions:** Cannot be used as constructors and will throw an error if you try.

### 4. Hoisting

*   **Normal Function Declarations (`function myFunction() { ... }`):** Are hoisted, meaning you can call them before they are defined in the code.
*   **Arrow Functions (and Function Expressions `const myFunction = function() { ... }`):** Are not hoisted. You must define them before you call them.

---

## Best Practices in "Voices of Truth"

Given the context of a modern Next.js/React project using functional components and hooks, here's a general guideline:

### Prefer Arrow Functions for:

1.  **Callbacks and Event Handlers:** A **callback function** is a function passed as an argument to another function, which is then invoked inside the outer function to complete some kind of routine or action. When you need to pass a function as a callback (e.g., `onClick`, `onChange`, `useEffect` cleanup functions), arrow functions are often cleaner and automatically bind `this` to the correct context (the component's scope).
    ```typescript
    function greet(name: string, callback: () => void) {
      console.log("Hello " + name);
      callback(); // ← هنا يتم استدعاء الدالة الممررة
    }

    function afterGreeting() {
      console.log("Nice to meet you!");
    }

    greet("Islamux", afterGreeting);
    ```

    ### Higher-Order Function (HOF) vs. Callback Function

    It's important to distinguish between a Higher-Order Function and a Callback Function, though they are closely related.

    *   **Higher-Order Function (HOF):** A function that takes one or more functions as arguments, or returns a function as its result.
    *   **Callback Function:** A function that is passed as an argument to another function (the HOF) and is executed later.

    ```typescript
    function higherOrder(callback: () => void) {
      callback(); // ← This is where the callback function is invoked
    }

    function sayHi() {
      console.log("Hi!");
    }

    higherOrder(sayHi);
    // In this example:
    // `higherOrder` is the Higher-Order Function.
    // `sayHi` is the Callback Function.
    ```
    ```typescript
    // src/components/LanguageSwitcher.tsx (Example)
    // Original arrow function for changeLanguage
    const changeLanguage = (newLang: string) => {
      // ... logic ...
    };

    // Used as a callback
    <Button onClick={() => changeLanguage('en')}>...</Button>
    ```

2.  **Functions within Functional Components:** For helper functions defined directly inside a functional React component, arrow functions are generally preferred for consistency and to avoid unexpected `this` binding issues.
    ```typescript
    // src/app/[locale]/HomePageClient.tsx (Example)
    const handleFilterChange = useCallback(
      (name: string, value: string) => {
        // ... logic ...
      },
      [pathname, router, searchParams]
    );
    ```

3.  **Concise, Single-Expression Functions:** Arrow functions shine for their brevity when the function body is a single expression.
    ```typescript
    // src/data/scholars.ts (Example)
    const uniqueCountryIds = Array.from(new Set(allCountryIds));
    const foundCountries = uniqueCountryIds.map(id => countries.find(c => c.id === id));
    ```

### Use Normal Function Declarations for:

1.  **Named Exports (especially for Components and Hooks):** For the main component or hook being exported from a file, a named function declaration (`export default function ComponentName() { ... }` or `export function hookName() { ... }`) is often clearer for debugging and readability. It provides a clear name in stack traces.
    ```typescript
    // src/components/LanguageSwitcher.tsx (Example)
    export default function LanguageSwicher() {
      // ...
    }

    // src/hooks/useTheme.ts (Example)
    // While currently 'export const', 'export function' would also be appropriate here.
    export function useTheme() {
      // ...
    }
    ```
    *   **Benefit:** When debugging, the function name `LanguageSwicher` or `useTheme` will appear directly in the call stack, making it easier to trace execution. With anonymous arrow functions assigned to `const`, the name might be inferred, but a direct function declaration is explicit.

2.  **Global Utility Functions:** For standalone utility functions that are not tied to a component's scope or `this` context, a normal function declaration is perfectly fine and can sometimes be more readable.

---

## Conclusion

In our project, you'll primarily see arrow functions used for callbacks and internal helper functions within components, and named function declarations for the components themselves and exported hooks. This balance leverages the strengths of both syntaxes, leading to more predictable behavior and easier debugging.

When in doubt, consider:
*   **Does it need its own `this` context?** (Rarely in modern React functional components)
*   **Is it a main component or hook export?** (Lean towards `function` declaration)
*   **Is it a short, inline callback?** (Lean towards `arrow function`)

By adhering to these guidelines, we maintain a consistent and high-quality codebase.
