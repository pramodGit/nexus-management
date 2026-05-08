# Nexus Management (v1.1.0) 🚀

Nexus is a high-performance, **Zoneless Angular 21** Kanban board designed for modern task management. It features real-time cross-tab synchronization and a developer-centric UI inspired by professional IDEs.

## 🛠 Tech Stack

* **Framework:** Angular 21 (Zoneless Change Detection)
* **State Management:** Angular Signals & Computed Signals
* **Drag & Drop:** Angular CDK DragDropModule
* **Persistence:** LocalStorage with multi-tab `storage` event synchronization
* **Styling:** SCSS with technical "IDE-style" themes

## ✨ Key Features

* **Zoneless Reactivity:** Leverages `provideZonelessChangeDetection()` for surgical UI updates without Zone.js overhead.
* **Cross-Tab Sync:** Move a task in one tab, and watch it jump in another automatically via a custom `StorageEvent` listener.
* **Real-time Search:** Optimized task filtering using `computed` signals that respond instantly to user input.
* **Persistence Engine:** Uses a timestamped state logic to ensure data integrity during simultaneous updates.
* **Git-Integrated UI:** Technical footer displaying current branch, commit hash, and package version.

## 🚀 Getting Started

1.  **Clone the repo:**
    ```bash
    git clone [https://github.com/your-username/nexus-management.git](https://github.com/your-username/nexus-management.git)
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Run the dev server:**
    ```bash
    npm start
    ```
4.  **Access the app:** Open `http://localhost:4200` in multiple tabs to see the sync in action!

## 📈 Roadmap

- [x] v1.0.0: Core Kanban + LocalSync
- [x] v1.1.0: Real-time Search + Git Footer
- [ ] v1.2.0: Task Archiving & Custom Categories
- [ ] v2.0.0: Firebase Backend Integration

---
Developed by **Pramod** | [pramod.click](http://pramod.click)