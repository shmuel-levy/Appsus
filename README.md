Appsus - Google Apps Suite Clone

A comprehensive clone of Google's productivity suite, featuring Google Keep and Gmail functionality. Built with React, this project demonstrates advanced front-end development techniques and state management.
📱 Applications
📝 Notes (Google Keep Clone)
Create, manage, and organize notes with multiple formats including text, lists, images, videos, audio, and canvas drawings.
Features:

Multiple Note Types:

Text notes
Image notes
Todo lists
YouTube videos
Audio notes - In prograss
Canvas drawings- In prograss


Organization:

Pin important notes
Archive notes
Move notes to trash
Color-code notes


Rich Editing:

In-place editing
Drawing tools
Todo management



📧 Mail (Gmail Clone)
A fully-featured email client with organization, composition, and management capabilities.
Features:

Email Management:

Compose new emails
View inbox, sent, and drafts
Star important emails
Mark as read/unread
Move to trash


Auto-saving Drafts:

Automatic draft saving every 5 seconds
Resume drafts seamlessly


Composition Tools:

Rich text editor
Subject and recipient management
Link with notes (compose from note content)



🚀 Tech Stack

Frontend: React (Hooks-based architecture)
Routing: React Router
State Management: React Hooks (useState, useEffect)
Styling: CSS
Storage: Local storage for persistence



🏗️ Project Structure
Copy/Appsus
├── /cmps                  # Shared components
├── /lib                   # External libraries
├── /pages                 # Main application pages
├── /services              # Utility and service functions
├── /apps
│   ├── /mail              # Mail application
│   │   ├── /cmps
│   │   │   ├── GmailLoader.jsx
│   │   │   ├── MailCompose.jsx
│   │   │   ├── MailFilter.jsx
│   │   │   ├── MailFolderList.jsx
│   │   │   ├── MailList.jsx
│   │   │   └── MailPreview.jsx
│   │   ├── /pages
│   │   │   ├── MailDetails.jsx
│   │   │   └── MailIndex.jsx
│   │   └── /services
│   │       └── mail.service.js
│   └── /note              # Notes application
│       ├── /cmps
│       │   ├── /dynamic-components # Note type components
│       │   │   ├── NoteAudio.jsx
│       │   │   ├── NoteCanvas.jsx
│       │   │   ├── NoteImg.jsx
│       │   │   ├── NoteTodos.jsx
│       │   │   ├── NoteTxt.jsx
│       │   │   └── NoteVideo.jsx
│       │   ├── /sidebar-components
│       │   ├── NoteAdd.jsx
│       │   ├── NoteList.jsx
│       │   └── NotePreview.jsx
│       ├── /pages
│       │   ├── NoteEdit.jsx
│       │   └── NoteIndex.jsx
│       └── /services
│           └── note.service.js
└── /assets
    └── /css               # Component-specific styling
![NOTES](https://github.com/user-attachments/assets/7f3e72ba-c2bc-4874-922a-ea65afc14f5a)
![HOME](https://github.com/user-attachments/assets/b97c9f7e-7e90-449c-bf59-8265d9ab6bb0)
![ABOUT](https://github.com/user-attachments/assets/a8ad3775-4bb6-4159-9074-acb1d2f194e0)
![GMAIL](https://github.com/user-attachments/assets/b35711fb-43de-4394-8dd9-4c301390fc3f)

🔧 Key Functionality
Notes Management

Create: Add new notes with various formats
Read: View all your notes in an organized grid layout
Update: Edit notes in a modal interface
Delete: Move notes to trash and permanently delete them
Organize: Archive notes to declutter your main view

Email System

Composition: Create new emails with a rich editor
Folders: Organize emails into inbox, sent, drafts, starred, and trash
Actions: Star, read/unread, delete, and restore emails
Auto-save: Automatic saving of drafts every 5 seconds
Integration: Send notes as emails directly from the notes app

Special Features

Canvas Drawing: Create sketches directly in notes
Todo Management: Create checklists with items that can be marked as done
YouTube Integration: Add and play YouTube videos in notes
Audio Support: Add audio links to your notes
Cross-app Integration: Send notes as emails with a single click

🧩 Components
Mail Components

MailIndex: Main email management interface
MailCompose: Email composition interface with auto-saving
MailList: Displays emails in a list format
MailPreview: Preview of individual emails in the list
MailDetails: Full view of selected email
MailFilter: Search and filter emails
MailFolderList: Navigation between email folders

Notes Components

NoteApp: Main notes application container
NoteIndex: Manages the notes display and organization
NoteAdd: Component for creating new notes
NoteList: Displays the grid of note cards
NotePreview: Card view of individual notes
NoteEdit: Modal for editing notes
Dynamic Components: Specialized components for each note type

📋 Future Enhancements

User authentication
Cloud storage integration
Collaborative notes and emails
Labels and categories
Mobile app version

🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check issues page.

👏 Acknowledgements

Inspired by Google's productivity suite
Icons from Material Design and Font Awesome


Made with ❤️ by Shoham and Shmuel
