# Schedule Master

A modern, beautiful, and intuitive college schedule management application built with Next.js 14, React, TypeScript, and Tailwind CSS.


- **Framework:** [Next.js 14](https://nextjs.org/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** Custom components with [Radix UI](https://www.radix-ui.com/)
- **State Management:** React Hooks
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Icons:** [Lucide Icons](https://lucide.dev/)
- **Fonts:** [Geist Font](https://vercel.com/font)

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
   - Location
   - Instructor
   - Notes

### Managing Classes

- **Edit:** Click on any class to edit its details
- **Delete:** Use the delete button in the class card or edit modal  
- **Move:** Drag and drop classes to rearrange them
- **Color:** Customize class colors in the edit modal
- **Search:** Use the quick search (`Ctrl + K`) to find classes

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl + N` | Add new class |
| `Ctrl + Z` | Undo last action |
| `Ctrl + Shift + Z` | Redo last action |  
| `Ctrl + E` | Export schedule |
| `Ctrl + K` | Focus search |

## Contributing

We welcome contributions! To contribute:

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature` 
5. Open a Pull Request

## License

Licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Framer Motion](https://www.framer.com/motion/) - Animations  
- [Radix UI](https://www.radix-ui.com/) - Accessible components
- [Lucide Icons](https://lucide.dev/) - Icon system
- [Vercel](https://vercel.com) - Hosting platform
