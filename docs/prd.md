# Product Requirements Document: Virtual Factory Demo (Sentient Factory)

## 1. Project Vision
The **Virtual Factory Demo**, also known as the **Sentient Factory**, is a next-generation manufacturing intelligence platform. It transforms traditional industrial monitoring from static, reactive dashboards into a dynamic, "living" 3D ecosystem. The project aims to bridge the gap between physical operations and digital intelligence, providing real-time visibility and actionable insights into the manufacturing process.

## 2. Target Audience
- **Factory Managers**: To monitor production KPIs and overall factory health.
- **Operations Engineers**: To identify bottlenecks, track individual product units ("Tile Passports"), and manage quality control.
- **Digital Transformation Leaders**: To demonstrate the potential of AI-driven, sentient manufacturing environments.

## 3. Core Features

### 3.1. Real-Time 3D Factory Simulation
- **Dynamic Scene**: A high-fidelity 3D environment built with React Three Fiber, featuring animated conveyor belts and production lines.
- **Physical Interaction**: Integration with physics engines (Cannon.js) to simulate realistic movement and behavior of objects on the line.
- **Visual Feedback**: Real-time updates of factory assets based on sensor data.

### 3.2. Tile Passport System
- **Unit Tracking**: Every product (Tile) is tracked throughout its lifecycle on the production line.
- **Historical Data**: Access to detailed logs for each unit, including timestamps, quality checks, and processing steps.
- **Unique Identification**: Each unit is assigned a persistent ID for end-to-end traceability.

### 3.3. Management Dashboard & Analytics
- **KPI Monitoring**: Real-time display of key metrics such as production speed, throughput, and error rates.
- **Defect Heatmap**: Visual representation of quality issues across different zones of the production line.
- **Telemetry Sync**: Background synchronization of sensor data to ensure the digital twin is always up-to-date.

### 3.4. Control Panel & Playbooks
- **Operational Control**: Interface to start, stop, or adjust production parameters.
- **Actionable Insights**: "Playbooks" that suggest interventions based on detected anomalies or inefficiencies.

## 4. Technical Stack

### 4.1. Frontend
- **Framework**: React 19 (TypeScript)
- **3D Engine**: Three.js, React Three Fiber (@react-three/fiber), React Three Drei (@react-three/drei)
- **Physics**: Cannon-es, @react-three/cannon
- **Styling**: Tailwind CSS 4.0, Lucide React (Icons)
- **Build Tool**: Vite

### 4.2. State Management & Data
- **Global State**: Zustand (for high-performance, reactive state updates)
- **Backend/Database**: Supabase (for telemetry storage and real-time data synchronization)

## 5. User Interface & Design
- **Theme**: "Sentient Dark" - A premium, cinematic aesthetic with high contrast, glassmorphism, and subtle micro-animations.
- **Information Density**: Optimized to provide a high-level overview while allowing deep dives into specific unit data (Tile Passports).

## 6. Future Roadmap
- **AI-Driven Predictive Maintenance**: Integration of machine learning models to predict equipment failures before they occur.
- **Extended Reality (XR)**: Support for VR/AR headsets for immersive factory walk-throughs.
- **Advanced Simulation**: Multi-factory support and interconnected supply chain visualization.
