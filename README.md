# Event Hub

## 🎥 Demo

[![Kynnovate Demo][https://streamable.com/uu3xo9](https://streamable.com/uu3xo9)

Welcome to **Event HUB**, an innovative platform designed to revolutionize the way you discover, manage, and engage with events. Leveraging cutting-edge technologies and a user-centric design, Kynnovate provides a seamless experience for both event organizers and attendees. Whether you're looking to host a virtual conference, attend a local meetup, or connect with like-minded individuals, Kynnovate has you covered.

---

## 📋 Table of Contents

1. [🌟 Overview](#-overview)
2. [🚀 Key Features](#-key-features)
3. [🛠️ Tech Stack](#-tech-stack)
4. [📥 Getting Started](#-getting-started)
    - [🔧 Prerequisites](#-prerequisites)
    - [📦 Installation](#-installation)
        - [1. Clone the Repository](#1-clone-the-repository)
        - [2. Backend Setup](#2-backend-setup)
        - [3. Frontend Setup](#3-frontend-setup)
5. [📄 API Documentation](#-api-documentation)
6. [🏗️ Architecture](#-architecture)


---

## 🌟 Overview

**Kynnovate** is a comprehensive event management and discovery platform that bridges the gap between event organizers and attendees. By integrating advanced AI-driven features, real-time analytics, and a robust community engagement system, Kynnovate ensures that every event is a success and every attendee has a memorable experience.

### Key Objectives

- **For Organizers:** Streamline event creation, management, and promotion.
- **For Attendees:** Discover events tailored to their interests and connect with like-minded individuals.
- **For Community:** Foster a vibrant community through interactive features and real-time feedback.

---

## 🚀 Key Features

### 1. Voice-Enabled Smart Assistant
- **Natural Voice Commands:** Easily search for events using natural voice queries.
- **Real-Time Voice-to-Text Transcription:** Transcribe voice inputs instantly with high accuracy.
- **Multi-Browser Compatibility:** Works seamlessly across Chrome, Safari, Edge, and other popular browsers.
- **Visual Feedback:** Get real-time visual feedback during voice input for enhanced usability.
- **Contextual Conversation Memory:** Retain context across interactions for smoother, multi-step conversations.

### 2. RAG-Enhanced Search
- **Custom Retrieval-Augmented Generation:** Leverage advanced AI for precise, contextually relevant responses.
- **Semantic Chunking:** Break down content into meaningful segments for better context understanding.
- **Real-Time Result Ranking:** Dynamically rank results for optimal relevance.
- **Context-Aware Responses:** Deliver results tailored to the user's specific needs and previous queries.
- **Groq LLM Integration:** Enhance search capabilities with cutting-edge AI model integration.

### 3. Personalized Event Discovery
- **Advanced Filtering System:** Filter events based on time of day, location, categories, and price range.
- **Location-Based Search:** Find events happening near your current or specified location.
- **Category-Based Browsing:** Explore events by interest categories such as music, sports, or networking.
- **Real-Time Updates:** Receive live updates on newly added or modified events.

### 4. Interactive Event Cards
- **Smooth Animations:** Enhance the user experience with dynamic animations powered by AOS (Animate On Scroll).
- **Rich Event Details:** Display comprehensive event information, including descriptions, images, and organizer details.
- **Dynamic Image Loading:** Optimize loading times with on-demand image rendering.
- **One-Click Registration:** Simplify event sign-ups with a single click.
- **Share Functionality:** Effortlessly share event details with others via social media or direct links.

---

### Example Interaction:
**User Query:** "Find me jazz events this weekend near Marina Beach"  
**Response:**  
- A curated list of events matching the following criteria:  
  - **Location Matching:** Events near Marina Beach.  
  - **Time/Date Relevance:** Events happening over the weekend.  
  - **Category Alignment:** Jazz music events.  
  - **Sentiment Analysis:** Highly rated or positively reviewed events.  

## 🛠️ Tech Stack

### Frontend
- **Framework:** React.js
- **Language:** TypeScript
- **Styling:** TailwindCSS
- **Animations:** AOS (Animate On Scroll)
- **State Management:** Redux Toolkit
- **Routing:** React Router
- **Icons:** Lucide React

### Backend
- **Framework:** FastAPI
- **Language Model:** Groq LLM
- **Embeddings:** Sentence Transformers
- **Data Analysis:** NumPy, Pandas
- **Database:** SQLite (development), PostgreSQL (production)

### Additional Technologies
- **Voice Recognition:** Integrated for voice-enabled queries in.
- **Real-Time Processing:** WebSockets for real-time interactions.

---


## 📥 Getting Started

Follow these steps to set up and run **Kynnovate** locally.

### 🔧 Prerequisites

Before you begin, ensure you have the following installed on your machine:

- **Node.js:** v16+ ([Download Node.js](https://nodejs.org/))
- **Python:** 3.8+ ([Download Python](https://www.python.org/downloads/))
- **pip:** Python package installer (comes with Python)
- **Git:** Version control system ([Download Git](https://git-scm.com/downloads))
- **Docker:** (Optional, for containerization) ([Download Docker](https://www.docker.com/get-started))

### 📦 Installation

#### 1. Clone the Repository

First, clone the GitHub repository to your local machine.

```bash
git clone https://github.com/Rohit-Yadav-47/Kynnovate.git
cd Kynnovate
```

#### 2. Backend Setup

The backend is built using FastAPI and handles all server-side operations.

##### a. Navigate to the Backend Directory

```bash
cd backend
```

##### b. Set Up a Virtual Environment

Creating a virtual environment helps manage project-specific dependencies.

- **Create the Virtual Environment**

  ```bash
  python -m venv venv
  ```

- **Activate the Virtual Environment**

  - **On macOS/Linux:**

    ```bash
    source venv/bin/activate
    ```

  - **On Windows:**

    ```bash
    .\venv\Scripts\activate
    ```

  After activation, your terminal prompt should be prefixed with `(venv)`.

##### c. Install Dependencies

Install the required Python packages listed in `requirements.txt`.

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

##### d. Start the Backend Server

Launch the FastAPI server using Uvicorn.

```bash
uvicorn main:fast --reload
```

- **`main`** refers to the `main.py` file.
- **`app`** is the FastAPI instance inside `main.py`.
- **`--reload`** enables auto-reloading on code changes (useful for development).

> **Access the API:** Open [http://127.0.0.1:8000](http://127.0.0.1:8000) in your browser.

#### 3. Frontend Setup

The frontend is built using React.js and provides the user interface for Kynnovate.

##### a. Navigate to the Frontend Directory

From the root of the repository (assuming frontend is in the main folder):

```bash
cd ..
```

##### b. Install Dependencies

Install the required Node.js packages listed in `package.json`.

```bash
npm install
```

##### c. Start the Development Server

Launch the React development server.

```bash
npm run dev
```

> **Access the Application:** Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---
## 📄 API Documentation

Kynnovate provides a comprehensive API to interact with various features of the platform. Below is an overview of the core endpoints and their respective schemas.

### 🔌 Core Endpoints

#### **Chat Endpoints**
- **POST** `/chatbot`  
  *Chatbot Endpoint*

- **POST** `/chat`  
  *Chat Endpoint*

#### **Event Endpoints**
- **GET** `/events`  
  *Get Events*

- **GET** `/events/{event_id}`  
  *Get Event*

#### **User Endpoints**
- **GET** `/users`  
  *Get Users Endpoint*

- **GET** `/users/{user_id}`  
  *Get User Endpoint*

- **GET** `/users/{user_id}/full`  
  *Get User Full Profile*

- **POST** `/match/users`  
  *Match Users Endpoint*

- **POST** `/users/match`  
  *Match Users*

#### **Community Endpoints**
- **GET** `/communities`  
  *Get Communities Endpoint*

- **GET** `/communities/{community_id}`  
  *Get Community Endpoint*

- **POST** `/match/communities`  
  *Match Communities Endpoint*

#### **Health Check Endpoint**
- **GET** `/health`  
  *Health Check*

### 📚 Schemas

The following schemas define the structure of the data returned by the API endpoints.

- **Community**
  - Detailed structure of the Community object.

- **Event**
  - Detailed structure of the Event object.

- **HTTPValidationError**
  - Structure for validation error responses.

- **User**
  - Detailed structure of the User object.

- **ValidationError**
  - Structure for general validation errors.

---

## 🏗️ Architecture

Kynnovate is built on a modular architecture that ensures scalability, maintainability, and efficiency. Below is an overview of the system architecture:

```mermaid
graph TD
    A[Frontend React App] --> B[FastAPI Backend]
    B --> C[SQLite Database]
    B --> D[Groq LLM]
    B --> E[Sentiment Analysis]
    E --> F[Analytics Dashboard]
```

### Components

1. **Frontend:**
   - **Technology:** React.js with TypeScript
   - **Responsibilities:** 
     - Render user interfaces
     - Handle user interactions
     - Communicate with the backend via API calls
     - Manage state using Redux Toolkit

2. **Backend:**
   - **Technology:** FastAPI
   - **Responsibilities:**
     - Handle API requests
     - Business logic and data processing
     - Integrate with AI services like Groq LLM and Sentiment Analysis

3. **Database:**
   - **Technology:** SQLite (development), PostgreSQL (production)
   - **Responsibilities:**
     - Store user data, event details, tickets, and other relational data
     - Ensure data integrity and support complex queries

4. **AI Services:**
   - **Groq LLM:** Facilitates advanced natural language understanding and generation.
   - **Sentiment Analysis:** Analyzes user feedback to gauge community sentiment.

5. **Analytics Dashboard:**
   - **Technology:** Integrated within the backend for real-time insights.
   - **Responsibilities:**
     - Display analytics data
     - Monitor event performance and user engagement

---
