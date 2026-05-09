---
invokable: true
---

Review this code for potential issues, including:

- Security vulnerabilities (especially in authentication and user management)
- Performance concerns with audio processing and real-time WebSocket communication  
- Memory leaks or resource handling issues in the backend
- Proper error handling and validation of user inputs
- Inconsistent use of asynchronous operations
- Potential race conditions in shared state (like the in-memory user_db and analysis_results)
- Code duplication or areas for refactoring 
- Best practices for FastAPI/Next.js development
- Proper separation of concerns between frontend and backend
- Correct usage of Docker containers and environment variables
- Data persistence considerations (currently using in-memory storage instead of PostgreSQL)

Provide specific, actionable feedback for improvements.