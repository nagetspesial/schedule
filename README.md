# Schedule Master

A modern, beautiful, and intuitive college schedule management application built with Next.js 14, React, TypeScript, and Tailwind CSS.

![Schedule Master](./public/screenshot.png)

## Features

- 📅 Interactive weekly and daily schedule views
- 🎨 Beautiful and responsive design with dark/light mode
- 🌍 Multi-language support (EN, ID, JA, ZH, ES, FR, DE, KO, RU, AR, PT, IT)
- 🎯 Drag and drop class management
- 🔄 Undo/Redo functionality
- 📱 Mobile-friendly interface
- ⌨️ Keyboard shortcuts support
- 🎨 Custom color themes for classes
- 📤 Export schedule functionality
- 🔍 Quick search feature
- 💾 Local storage persistence

## Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** Custom components with [Radix UI](https://www.radix-ui.com/)
- **State Management:** React Hooks
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Icons:** [Lucide Icons](https://lucide.dev/)
- **Fonts:** [Geist Font](https://vercel.com/font)

## Project Structure

```
src/
├── app/                   # Next.js app directory
│   ├── layout.tsx        # Root layout component
│   └── page.tsx          # Home page component
├── components/           # React components
│   ├── ui/              # Reusable UI components
│   ├── schedule/        # Schedule-specific components
│   └── root-layout.tsx  # Root layout wrapper
├── lib/                 # Utility functions and constants
│   ├── constants/       # Application constants
│   ├── hooks/           # Custom React hooks
│   ├── types/          # TypeScript type definitions
│   └── utils/          # Helper functions
└── providers/          # React context providers
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/nagetspesial/schedule-master.git
cd schedule-master
```

2. Install dependencies:
```bash
pnpm install
```

3. Start the development server:
```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Adding Classes

1. Click the "Add Class" button in the header
2. Fill in the class details:
   - Class ID (required)
   - Class Name
   - Day
   - Start/End Time
   - Location (optional)
   - Instructor (optional)
   - Notes (optional)

### Managing Classes

- **Edit:** Click on any class to edit its details
- **Delete:** Use the delete button in the class card or edit modal
- **Move:** Drag and drop classes to rearrange them
- **Color:** Customize class colors in the edit modal

### Keyboard Shortcuts

- `Ctrl + N`: Add new class
- `Ctrl + Z`: Undo
- `Ctrl + Shift + Z`: Redo
- `Ctrl + E`: Export schedule
- `Ctrl + K`: Focus search

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Tailwind CSS](https://tailwindcss.com/) - For styling
- [Framer Motion](https://www.framer.com/motion/) - For animations
- [Radix UI](https://www.radix-ui.com/) - For accessible components
- [Lucide Icons](https://lucide.dev/) - For beautiful icons
- [Vercel](https://vercel.com) - For hosting

## Contact

Petir Anggara - [@nagetspesial](https://twitter.com/nagetspesial)

Project Link: [https://github.com/nagetspesial/schedule-master](https://github.com/nagetspesial/schedule-master)
