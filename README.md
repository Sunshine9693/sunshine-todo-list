# SUNSHINE'S TO-DO LIST - React Edition

A beautiful, feature-rich TO-DO list application built with React.

## Features

✨ **Task Management**
- Add, complete, and delete tasks
- Priority levels (High, Medium, Low)
- Due dates with reminders
- Drag & drop to reorder tasks

📊 **Progress Tracking**
- Visual progress circle with percentage
- Task counters (Total, Completed, Pending)
- Real-time progress updates

🎨 **Theme Support**
- Light mode (default - Pink & Mint)
- Dark mode for comfortable viewing

🔍 **Smart Features**
- Search and filter tasks
- Task sorting by priority and due date
- Smart suggestions and motivation quotes
- Notifications for overdue tasks

💾 **Data Persistence**
- Automatic saving to browser localStorage
- Tasks persist across sessions

## Project Structure

```
src/
├── components/
│   ├── Header.js
│   ├── Sidebar.js
│   ├── TaskList.js
│   ├── TaskForm.js
│   ├── TaskItem.js
│   ├── TaskCounter.js
│   ├── ProgressCircle.js
│   └── ExtrasView.js
├── hooks/
│   └── useTasks.js
├── App.js
├── index.js
├── style.css
└── index.html
public/
├── index.html
└── ...
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)

### Steps to Run Locally

1. **Navigate to the project folder:**
   ```bash
   cd "path\to\TO-DO List"
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

4. **Open in browser:**
   - The app will automatically open at `http://localhost:3000`
   - If not, manually navigate to that URL

5. **Build for production (optional):**
   ```bash
   npm run build
   ```

## Usage

### Adding a Task
1. Enter task text in the input field
2. (Optional) Select priority level
3. (Optional) Set a due date/time
4. Click the "+" button or press Enter

### Managing Tasks
- **Complete**: Click the ✓ button to mark as done
- **Delete**: Click the trash icon to remove
- **Reorder**: Drag tasks to reorganize
- **Search**: Use the search bar to filter tasks

### Theme Toggle
Click "Toggle Theme" in the sidebar menu to switch between light and dark modes

### Notifications
The app will show notifications when a task is due in less than 1 hour (if permitted by your browser)

## Color Scheme

### Light Mode
- Header & Container: Light Pink (#FFB6C1)
- Background: Mint Green (#A8FFE3)
- Priority Borders: Red, Yellow, Green

### Dark Mode
- Dark Navy background with gray container
- Optimized contrast for comfortable reading

## Technologies Used

- **React 18.2.0** - UI Framework
- **React DOM** - DOM rendering
- **CSS3** - Styling with animations
- **FontAwesome Icons** - Icon library
- **LocalStorage API** - Data persistence
- **Notifications API** - Task reminders

## Browser Support

Works on all modern browsers:
- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

## Tips & Tricks

💡 **Smart Suggestions**: Check the "Extras" tab for AI suggestions on what to work on next

🎯 **Priority System**: Tasks are automatically sorted by priority and due date

⏰ **Drag & Drop**: Grab the handle icon (≡) to reorder tasks

🔔 **Reminders**: Enable notifications in your browser for task reminders

## Future Enhancements

- [ ] Cloud sync with Firebase
- [ ] Categories/Tags for tasks
- [ ] Recurring tasks
- [ ] Task subtasks
- [ ] Export tasks as PDF
- [ ] Social sharing

## License

This project is open source and available for personal use.

---

Made with ❤️ by Sunshine
