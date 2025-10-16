
# 🚀 Tutorial: Building "Voices of Truth" From Scratch (Updated) 🚀

<center>
  <img src="https://img.icons8.com/color/96/000000/nextjs.png" alt="Next.js" width="50"/>
  <img src="https://img.icons8.com/color/96/000000/typescript.png" alt="TypeScript" width="50"/>
  <img src="https://img.icons8.com/color/96/000000/tailwindcss.png" alt="Tailwind CSS" width="50"/>
</center>

> **Welcome, junior developer!** 👋 This document is your up-to-date guide to rebuilding the "Voices of Truth" project. The goal is for you to understand the architecture, data flow, and component-based structure of a modern Next.js application.

--- 

## 📦 1. Create a New Next.js Project

We'll use `pnpm` to create a new Next.js project with TypeScript, ESLint, and Tailwind CSS configured.

```bash
pnpm create next-app voices-of-truth --typescript --eslint --tailwind --app --src-dir --use-pnpm
```

<details>
  <summary>📌 What does this command do?</summary>

- **`voices-of-truth`**: Names your project directory.
- **`--typescript`**: Configures TypeScript.
- **`--eslint`**: Configures ESLint.
- **`--tailwind`**: Configures Tailwind CSS.
- **`--app`**: Uses the App Router (recommended for Next.js 13+).
- **`--src-dir`**: Creates an `src/` directory.
- **`--use-pnpm`**: Uses pnpm as the package manager.

</details>

Navigate into your new project:
```bash
cd voices-of-truth
```

--- 

## 🛠️ 2. Project Structure

Here's a quick overview of the project structure:

```plaintext
voices-of-truth/
├── src/
│   ├── app/
│   ├── components/
│   ├── styles/
│   └── ...
├── package.json
└── ...
```

<details>
  <summary>📂 What's inside each folder?</summary>

- **`app/`**: Contains the main application logic and routing.
- **`components/`**: Reusable UI components.
- **`styles/`**: Global styles and Tailwind CSS configurations.

</details>

--- 

## 🎨 3. Styling with Tailwind CSS

Tailwind CSS is already configured. You can start using utility classes directly in your components.

```jsx
// Example: src/components/Button.jsx

export default function Button({ children }) {
  return (
    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
      {children}
    </button>
  );
}
```

<details>
  <summary>🎭 Why Tailwind CSS?</summary>

- **Utility-first**: Build designs directly in your markup.
- **Responsive**: Easy to make responsive designs.
- **Customizable**: Configure your design system in `tailwind.config.js`.

</details>

--- 

## 📦 4. Install Additional Dependencies

You might need additional libraries. Here's how to install them:

```bash
pnpm add axios react-icons
```

<details>
  <summary>📦 What are these?</summary>

- **`axios`**: For making HTTP requests.
- **`react-icons`**: For using popular icons in your React app.

</details>

--- 

## 🌐 5. Running the Development Server

Start the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

--- 

## 📚 Next Steps

- [ ] Explore the `app/` directory to understand routing.
- [ ] Create a new component in the `components/` directory.
- [ ] Style your component using Tailwind CSS.

--- 

