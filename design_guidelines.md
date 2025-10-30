# Knockturn Private Limited Employee Timestrap - Design Guidelines

## Design Approach
**Selected Approach:** Custom Aesthetic (Futuristic Corporate Tech)
- Dark, professional interface with sci-fi influences
- GSAP-powered interactive animations for premium feel
- Data visualization focus with Chart.js integration

## Core Visual Identity

### Color Palette
- **Primary Background:** Pure black (#000000)
- **Primary Accent:** Electric blue (#0EA5E9, #3B82F6, #60A5FA range)
- **Glowing Effects:** Bright electric blue with blur for lamp and interactive elements
- **Text:** White for primary content, light blue for secondary
- **Borders/Dividers:** Dark blue (#1E3A8A) with subtle glow

### Typography
- **Font Family:** 
  - Primary: Inter or Poppins (Google Fonts) for clean, modern readability
  - Monospace: JetBrains Mono for Employee ID, timestamps, and numeric data
- **Scale:**
  - Page titles: text-4xl to text-5xl, font-bold
  - Section headers: text-2xl to text-3xl, font-semibold
  - Body text: text-base to text-lg
  - Data displays (time, IDs): text-xl, monospace
  - Button text: text-sm to text-base, font-medium

### Layout System
- **Spacing Units:** Use Tailwind units of 4, 6, 8, 12, 16, 24 for consistent rhythm
- **Container:** max-w-7xl for main content areas, max-w-md for login card
- **Component Padding:** p-6 to p-8 for cards, p-4 for smaller elements
- **Gaps:** gap-6 for grids, gap-4 for lists, gap-8 for major sections

## Page-Specific Designs

### Login Page
**Layout:** Full-viewport centered experience (min-h-screen)
- **GSAP Lamp Animation:** Center-stage interactive lamp with pull thread
  - Lamp idle state: Soft blue glow (opacity-50)
  - On pull: Bright glow animation expanding outward, then navigate
  - Animation timing: 1.2s total (0.5s pull, 0.7s glow expansion)
- **Login Form:** Below lamp, contained card (max-w-md)
  - Black background with blue border glow (border-2 border-blue-500/50)
  - Rounded corners: rounded-2xl
  - Fields: Employee ID (monospace input), Employee Name
  - Input styling: Dark background (bg-gray-900), blue focus ring, white text
  - Spacing: space-y-6 between elements
- **Visual Effects:**
  - Gradient radial glow behind lamp using blur-3xl
  - Subtle particle effects (optional CSS stars/dots in background)

### Tracker/Timesheet Page
**Layout:** Dashboard with header, main content, and analytics sidebar

**Header Section:**
- Full-width dark bar with subtle bottom border glow
- Left: Company branding "Knockturn Private Limited"
- Center: Live date and time display (text-2xl, monospace, glowing text effect)
- Right: Employee info card (name + ID in rounded badge)
- Height: h-20, padding: px-8

**Main Content Grid:**
- Two-column layout (lg:grid-cols-3)
- Left (col-span-2): Task tracker section
- Right (col-span-1): Charts analytics

**Task Tracker Section:**
- **Current Session Card:**
  - Large display of total working time (text-6xl, monospace, electric blue)
  - Start time indicator with icon
  - Rounded-xl card with p-8, blue glow border
- **Task List:**
  - Each task: Horizontal card with rounded-lg, p-6
  - Left: Task title input (bold, text-lg)
  - Center: Start/End time badges (monospace, small rounded pills)
  - Right: Complete button (blue glow on hover)
  - Spacing: space-y-4 between tasks
- **Add Task Button:** Prominent at bottom, full-width, h-12, rounded-lg, blue gradient
- **Final Submit:** Bottom-right corner, large primary button with strong glow effect

**Charts & Analytics Section:**
- Vertical stack of chart cards (space-y-6)
- **Chart Cards:**
  - Each chart in rounded-2xl container with p-6
  - Card background: bg-gray-900/50 with blue border glow
  - Chart title: text-xl, mb-4
  - Charts sizing: Doughnut (256px square), Bar (full width, 200px height), Progress (full width)
  - Soft blue glow shadow around each card (shadow-2xl shadow-blue-500/20)

## Component Library

### Buttons
- **Primary Action:** bg-blue-600, rounded-lg, px-6 py-3, font-medium, glow effect (shadow-lg shadow-blue-500/50)
- **Secondary:** border-2 border-blue-500, transparent bg, same padding/rounding
- **Complete Task:** Smaller, rounded-md, px-4 py-2, green accent on completion
- **Hover States:** Scale-105 transform, increased glow intensity

### Input Fields
- **Text Inputs:** bg-gray-900, border border-blue-500/30, rounded-lg, px-4 py-3, white text
- **Focus State:** border-blue-500, ring-2 ring-blue-500/50, outline-none
- **Placeholder:** text-gray-500

### Cards/Containers
- **Main Cards:** rounded-2xl, bg-black/80, border border-blue-500/30, p-6 to p-8
- **Nested Elements:** rounded-lg, bg-gray-900/50, p-4
- **Glow Effect:** shadow-2xl shadow-blue-500/20 for elevated cards

### Data Displays
- **Time Displays:** Monospace font, text-2xl to text-6xl, electric blue color
- **Employee Badges:** Rounded-full pills, px-4 py-2, border with glow
- **Task Status:** Color-coded pills (blue: in-progress, green: complete)

## Animations & Interactions

### GSAP Animations
- **Lamp Pull:** Custom GSAP timeline with physics-based spring
- **Page Transitions:** Fade in with slight upward motion (0.3s ease-out)
- **Task Addition:** Slide in from top with bounce effect

### CSS Transitions
- **Button Hovers:** transition-all duration-200
- **Card Hovers:** Subtle lift (transform translateY(-2px)) with increased glow
- **Input Focus:** Smooth border and glow transitions (duration-300)
- **Chart Cards:** Pulse glow on data update (keyframe animation)

### Smooth Behaviors
- All state changes use ease-in-out timing
- Loading states have blue spinning indicators
- Task completion triggers brief celebratory glow pulse

## Responsive Behavior
- **Desktop (lg+):** Three-column layout with sidebar
- **Tablet (md):** Two-column, charts stack below tasks
- **Mobile:** Single column, full-width cards, adjusted padding (p-4)
- **Login Page:** Centered across all viewports, max-w-md maintained

## Images
**No hero images required** - This is a data-focused application where the lamp animation serves as the primary visual centerpiece. The design relies on glowing effects, charts, and data visualization rather than photographic imagery.