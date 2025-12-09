# Bisheng Backend Architecture Design Documentation

## Overview

Bisheng is an AI application platform built on FastAPI that provides workflow orchestration, chat capabilities, knowledge management, and multi-LLM integration. This document outlines the key architectural designs and their code locations for quick reference and deeper analysis.

## Table of Contents

1. [Core Architecture Patterns](#core-architecture-patterns)
2. [Application Entry Points](#application-entry-points)
3. [API Layer Design](#api-layer-design)
4. [Service Layer Architecture](#service-layer-architecture)
5. [Database Design](#database-design)
6. [Workflow Engine](#workflow-engine)
7. [Authentication & Authorization](#authentication--authorization)
8. [AI/ML Integration](#aiml-integration)
9. [Storage & Caching](#storage--caching)
10. [Key Configuration Files](#key-configuration-files)

---

## Core Architecture Patterns

### 1. Layered Architecture
```
API Layer → Service Layer → Data Access Layer → Database
```

### 2. Key Design Patterns Used
- **Service Locator Pattern**: Centralized service registry
- **Dependency Injection**: Automatic dependency resolution
- **Factory Pattern**: Service and component creation
- **Observer Pattern**: Event callbacks and workflow monitoring
- **Strategy Pattern**: Multiple AI providers and storage backends
- **Repository Pattern**: Data access abstraction through DAOs
- **Chain of Responsibility**: Workflow node execution

### Code Locations:
- Base service interface: `bisheng/services/base.py`
- Service manager: `bisheng/services/manager.py`
- DAO base: `bisheng/database/dao/dao.py`

---

## Application Entry Points

### 1. FastAPI Application Initialization
**File**: `bisheng/main.py:68-143`
- Creates FastAPI app with middleware
- Configures exception handlers
- Sets up JWT authentication
- Includes API routers
- Manages application lifecycle (startup/shutdown)

### 2. CLI Entry Point
**File**: `bisheng/__main__.py`
- Typer-based CLI interface
- Environment configuration
- Server startup with platform-specific settings
- Default port: 7860

### 3. Gunicorn Wrapper
**File**: `bisheng/server.py`
- Production deployment wrapper for Linux

---

## API Layer Design

### 1. Main Router Structure
**File**: `bisheng/api/router.py`
- Orchestrates all API endpoints
- Version 1 API: `/api/v1/`
- RPC endpoints: `/api/v2/`

### 2. Key API Modules

#### Chat System
**File**: `bisheng/api/v1/chat.py`
- OpenAI-compatible chat completions with streaming
- WebSocket support for real-time chat
- Chat history and session management

#### User Management
**File**: `bisheng/api/v1/user.py`
- User registration and authentication
- Profile management
- SSO integration

#### Flow/Workflow Management
**Files**:
- `bisheng/api/v1/flows.py` - Flow CRUD operations
- `bisheng/api/v1/workflow.py` - Workflow execution
- `bisheng/api/v1/assistant.py` - AI assistant management

#### Component System
**File**: `bisheng/api/v1/component.py`
- Reusable component management
- Custom component creation

#### Knowledge Base
**File**: `bisheng/api/v1/knowledge.py`
- Document processing
- RAG (Retrieval Augmented Generation)

### 3. API Patterns
- Unified response model: `UnifiedResponseModel`
- JWT authentication: `bisheng/api/JWT.py`
- Role-based access control: Admin/User roles
- Streaming responses for real-time features

---

## Service Layer Architecture

### 1. Service Manager
**File**: `bisheng/services/manager.py`
- Centralized service registry
- Dependency injection container
- Service lifecycle management

### 2. Core Services

#### Authentication Service
**Files**: `bisheng/services/auth/`
- JWT token management
- User session handling
- Permission verification

#### Cache Service
**Files**: `bisheng/services/cache/`
- Redis-based caching
- Memory caching fallback
- Cache invalidation strategies

#### Task Service
**Files**: `bisheng/services/task/`
- Background task execution
- Celery integration
- Async job management

#### Settings Service
**Files**: `bisheng/services/settings/`
- Configuration management
- Dynamic settings updates
- Environment variable handling

#### Storage Service
**Files**: `bisheng/services/store/`
- File abstraction layer
- MinIO integration
- Local file system support

### 3. Service Types Definition
**File**: `bisheng/services/schema.py`
- Enum defining all available services
- Service dependency definitions

---

## Database Design

### 1. Database Models Location
**Directory**: `bisheng/database/models/`

### 2. Core Data Models

#### Assistant
**File**: `bisheng/database/models/assistant.py`
- AI assistant definitions
- System prompts and model configs
- Status management (online/offline)

#### Flow/Workflow
**File**: `bisheng/database/models/flow.py`
- Workflow definitions
- Node and edge storage (JSON format)
- Version control support

#### Flow Version
**File**: `bisheng/database/models/flow_version.py`
- Version history for flows
- Version comparison
- Rollback support

#### Component
**File**: `bisheng/database/models/component.py`
- Reusable workflow components
- Component metadata
- Custom component definitions

#### Dataset
**File**: `bisheng/database/models/dataset.py`
- Knowledge base data storage
- Document embeddings
- Vector data storage

#### User & Group Management
**Files**:
- `bisheng/database/models/user.py`
- `bisheng/database/models/group.py`
- Multi-tenant support
- Resource access control

#### Audit Log
**File**: `bisheng/database/models/audit_log.py`
- Activity tracking
- User action logging
- Compliance support

### 3. Data Access Layer
**Directory**: `bisheng/database/dao/`
- DAO classes for each model
- Async/sync operation support
- Soft delete patterns
- Transaction management

### 4. Database Configuration
**File**: `bisheng/core/database/connection.py`
- Connection pooling
- Async/sync database sessions
- Migration support

---

## Workflow Engine

### 1. Workflow Graph System
**Directory**: `bisheng/workflow/graph/`
- Workflow execution engine
- State management
- Execution flow control

### 2. Node System
**Directory**: `bisheng/workflow/nodes/`

#### Base Node
**File**: `bisheng/workflow/nodes/base.py`
- Abstract base node class
- Node execution template
- State persistence

#### Node Types
- **Agent Nodes**: `bisheng/workflow/nodes/agent/`
- **LLM Nodes**: `bisheng/workflow/nodes/llm/`
- **Code Execution**: `bisheng/workflow/nodes/code_exec/`
- **Conditional Logic**: `bisheng/workflow/nodes/if_else/`
- **Data Processing**: `bisheng/workflow/nodes/start/`, `bisheng/workflow/nodes/end/`
- **Tool Integration**: `bisheng/workflow/nodes/tools/`
- **RAG Nodes**: `bisheng/workflow/nows/rag_retrieval/`

### 3. Edge System
**Directory**: `bisheng/workflow/edges/`
- Node connection logic
- Data flow between nodes
- Conditional routing

### 4. Callback System
**Directory**: `bisheng/workflow/callback/`
- Event handling during execution
- LLM streaming callbacks
- Progress tracking

### 5. Workflow State Management
**Files**:
- `bisheng/workflow/common/workflow.py` - Status enums
- `bisheng/workflow/common/node.py` - Node data structures
- `bisheng/workflow/common/condition.py` - Conditional logic

---

## Linsight Autonomous Agent System

### 1. Overview
Linsight (灵思) is a general-purpose autonomous agent system that provides advanced decision-making capabilities beyond the standard workflow execution model. It implements the ReAct (Reasoning + Acting) pattern for autonomous task execution.

### 2. Core Architecture

#### Linsight Agent
**File**: `bisheng_langchain/linsight/agent.py`
- Main agent class: `LinsightAgent`
- SOP (Standard Operating Procedure) generation
- Dynamic task planning and execution
- Tool integration and autonomous tool selection

#### Task Management
**Files**:
- `bisheng_langchain/linsight/manage.py` - `TaskManage` class for task lifecycle management
- `bisheng_langchain/linsight/task.py` - Base task implementation
- `bisheng_langchain/linsight/react_task.py` - ReAct pattern implementation

#### Execution Engine
**Directory**: `bisheng/linsight/`
- `task_exec.py` - Task execution logic
- `worker.py` - Queue-based worker system
- `state_message_manager.py` - Real-time state management
- `utils.py` - Utility functions

### 3. API Layer
**File**: `bisheng/api/v1/linsight.py`
- Main API router with 1369+ lines of code
- Endpoints for workbench, SOP management, and task execution
- Real-time streaming via WebSocket and SSE

#### Key API Endpoints:
- `POST /workbench/upload-file` - File upload and parsing
- `POST /workbench/submit` - Question submission
- `POST /workbench/generate-sop` - SOP generation
- `POST /workbench/start-execute` - Task execution start
- `POST /workbench/user-input` - Interactive user input
- `GET /sop/list` - SOP listing and management

### 4. Service Layer
**Directory**: `bisheng/api/services/linsight/`
- `workbench_impl.py` - Workbench implementation
- `message_stream_handle.py` - Message streaming handling
- `sop_manage.py` - SOP management service

### 5. Database Models
**Files**:
- `bisheng/database/models/linsight_execute_task.py` - Task execution records
- `bisheng/database/models/linsight_session_version.py` - Session version tracking
- `bisheng/database/models/linsight_sop.py` - SOP definitions and records

### 6. Configuration
**File**: `bisheng/initdb_config.yaml` (lines 62-81)
- Tool buffer size: 100000 tokens
- Max execution steps: 200
- Retry attempts: 3
- Max files in prompt: 5
- Max knowledge bases: 20

### 7. Key Features
1. **Autonomous Decision-Making**: ReAct pattern implementation for reasoning and acting
2. **Dynamic Task Planning**: Generates execution plans based on goals and constraints
3. **Tool Autonomy**: Autonomous tool selection and parameter generation
4. **Real-Time Adaptation**: Adjusts execution based on intermediate results
5. **Interactive Execution**: Human-in-the-loop capabilities with user input
6. **State Persistence**: Maintains context across multiple execution cycles
7. **Queue Management**: Redis-based task queue for scalable execution

### 8. Error Handling
**File**: `bisheng/common/errcode/linsight.py`
- Error codes 11010-11170
- Specific error types for file upload, SOP generation, task execution, etc.

### 9. Integration Points
- **LangChain Integration**: `bisheng_langchain/linsight/` directory
- **Knowledge Base Integration**: Personal and organizational knowledge bases
- **Tool Integration**: Dynamic tool discovery and usage
- **File Processing**: Multi-format file upload and parsing

---

## Authentication & Authorization

### 1. JWT Implementation
**File**: `bisheng/api/JWT.py`
- Token generation and validation
- User payload encoding
- Token refresh handling

### 2. Authentication Decorators
**File**: `bisheng/api/deps.py`
- `get_login_user` - User authentication
- `get_admin_user` - Admin authentication
- Permission verification

### 3. Access Control Types
**File**: `bisheng/database/models/access.py`
- Resource access levels
- Group-based permissions
- Fine-grained access control

---

## AI/ML Integration

### 1. LLM Clients
**Directory**: `bisheng/core/ai/`
- OpenAI client: `bisheng/core/ai/llms/openai.py`
- Ollama compatibility: `bisheng/core/ai/llms/ollama.py`
- Azure OpenAI: `bisheng/core/ai/llms/azure_openai.py`
- Base LLM interface: `bisheng/core/ai/llms/base.py`

### 2. Embedding Providers
**Directory**: `bisheng/core/ai/embeddings/`
- Multiple embedding implementations
- Vector generation for RAG

### 3. ASR/TTS Services
**Directory**: `bisheng/core/ai/audio/`
- Speech recognition
- Text-to-speech

### 4. Model Fine-tuning
**Directory**: `bisheng/llm/finetune/`
- Custom model training
- Fine-tuning job management

---

## Storage & Caching

### 1. File Storage
**Directory**: `bisheng/core/storage/`
- MinIO integration: `bisheng/core/storage/minio.py`
- Local file system: `bisheng/core/storage/local.py`
- Storage abstraction layer

### 2. Vector Storage
**Directory**: `bisheng/core/vectorstore/`
- Milvus integration
- Vector similarity search
- RAG support

### 3. Caching Layer
**Directory**: `bisheng/core/cache/`
- Redis implementation
- Memory cache fallback
- LRU caching strategies

### 4. Configuration Storage
**File**: `bisheng/core/config/settings.py`
- Centralized configuration
- Environment-specific settings
- Encrypted sensitive data

---

## Key Configuration Files

### 1. Database Initialization
**File**: `bisheng/initdb_config.yaml`
- Database schema definitions
- Initial data setup
- System defaults

### 2. Default Node Configuration
**File**: `bisheng/default_node.yaml`
- Workflow node defaults
- Component configurations
- System presets

### 3. Environment Configuration
**File**: `.env`
- Database credentials
- API keys
- Service endpoints

### 4. Project Configuration
**File**: `pyproject.toml`
- Dependencies
- Build settings
- Python version

---

## Quick Reference Summary

| Component | Primary Location | Key Files | Purpose |
|-----------|------------------|-----------|---------|
| API Entry | `bisheng/main.py` | `main.py`, `router.py` | FastAPI application setup |
| Chat System | `bisheng/api/v1/` | `chat.py` | Real-time chat functionality |
| Workflow Engine | `bisheng/workflow/` | `graph/`, `nodes/` | Flow execution engine |
| **Linsight Agent** | `bisheng_langchain/linsight/` | `agent.py`, `react_task.py` | Autonomous agent system |
| Database Models | `bisheng/database/models/` | `*.py` | Data persistence layer |
| Services | `bisheng/services/` | `manager.py`, `auth/` | Business logic layer |
| AI Integration | `bisheng/core/ai/` | `llms/`, `embeddings/` | LLM and AI services |
| Configuration | `bisheng/core/config/` | `settings.py` | System configuration |
| Storage | `bisheng/core/storage/` | `minio.py`, `local.py` | File handling |

---

## How to Use This Document

When asked about a specific module:
1. Locate the module in the appropriate section above
2. Refer to the file paths for implementation details
3. Check related components in the same architectural layer
4. Follow the integration patterns described

For example:
- "How does authentication work?" → Check "Authentication & Authorization" section
- "Where are workflow nodes defined?" → See "Workflow Engine → Node System"
- "How is the database structured?" → Refer to "Database Design" section
- "How does the autonomous agent system work?" → See "Linsight Autonomous Agent System" section
- "What are the autonomous decision-making capabilities?" → Check "Linsight → Key Features"

This document serves as a map to quickly navigate the codebase and understand the architectural decisions behind each component.