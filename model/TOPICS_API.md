# Topics Generation API

## Overview
This new API route generates a comprehensive list of topics/subtopics from a user prompt that should be assessed.

## Endpoint
- **URL**: `POST http://localhost:8000/topics/generate_topics`
- **Method**: POST
- **Content-Type**: application/json

## Request Format
```json
{
  "prompt": "User description of what they want to assess"
}
```

## Example Request
```bash
curl -X POST http://localhost:8000/topics/generate_topics \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Java programming language fundamentals and advanced concepts"}'
```

## Example Response
```json
{
  "status": "success",
  "data": {
    "main_topic": "Java Programming Language",
    "total_topics": 10,
    "topics": [
      {
        "topic_id": 1,
        "title": "Java Basics and Syntax",
        "description": "Understanding Java syntax, variables, data types, and basic programming constructs",
        "difficulty": "Beginner",
        "suggested_questions": 5
      },
      {
        "topic_id": 2,
        "title": "Object-Oriented Programming",
        "description": "Classes, objects, inheritance, polymorphism, and encapsulation",
        "difficulty": "Intermediate",
        "suggested_questions": 6
      },
      {
        "topic_id": 3,
        "title": "Collections and Generics",
        "description": "ArrayList, HashMap, Sets, and type-safe collections",
        "difficulty": "Intermediate",
        "suggested_questions": 5
      },
      {
        "topic_id": 4,
        "title": "Exception Handling",
        "description": "Try-catch blocks, custom exceptions, and error handling best practices",
        "difficulty": "Beginner",
        "suggested_questions": 4
      },
      {
        "topic_id": 5,
        "title": "Multithreading and Concurrency",
        "description": "Threads, synchronization, thread pools, and concurrent programming",
        "difficulty": "Advanced",
        "suggested_questions": 6
      },
      {
        "topic_id": 6,
        "title": "File I/O and Streams",
        "description": "Reading and writing files, stream processing, and serialization",
        "difficulty": "Intermediate",
        "suggested_questions": 4
      },
      {
        "topic_id": 7,
        "title": "Java Stream API",
        "description": "Functional programming with streams, lambdas, and functional interfaces",
        "difficulty": "Advanced",
        "suggested_questions": 5
      },
      {
        "topic_id": 8,
        "title": "Design Patterns",
        "description": "Singleton, Factory, Observer, Strategy, and other design patterns",
        "difficulty": "Advanced",
        "suggested_questions": 6
      },
      {
        "topic_id": 9,
        "title": "Java Virtual Machine and Memory",
        "description": "JVM architecture, garbage collection, memory management, and optimization",
        "difficulty": "Expert",
        "suggested_questions": 5
      },
      {
        "topic_id": 10,
        "title": "Reflection and Annotations",
        "description": "Java reflection API, custom annotations, and metaprogramming",
        "difficulty": "Expert",
        "suggested_questions": 4
      }
    ]
  }
}
```

## Response Fields

### Main Response
- `status`: "success" or "error"
- `data`: Object containing topics information

### Topics Data Structure
- `main_topic`: The primary subject extracted from the prompt
- `total_topics`: Total number of topics identified
- `topics`: Array of topic objects

### Topic Object Fields
- `topic_id`: Unique identifier (1-based)
- `title`: Name of the topic
- `description`: Detailed description of what the topic covers
- `difficulty`: Difficulty level (Beginner, Intermediate, Advanced, or Expert)
- `suggested_questions`: Recommended number of questions for this topic

## Use Cases

1. **Assignment Creation**: Teachers can use this to understand all topics that should be covered
2. **Quiz Generation**: Generate questions for the identified topics
3. **Curriculum Planning**: Map out a complete learning path
4. **Assessment Planning**: Determine what should be tested

## Integration Example (Frontend)

```javascript
// Example: Using the topics API in frontend
const response = await fetch('http://localhost:8000/topics/generate_topics', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ prompt: 'Machine Learning and Deep Learning fundamentals' })
});

const result = await response.json();
console.log(result.data.topics); // List of topics
```

## Notes
- The route supports both Ollama and Groq API backends (based on configuration)
- Temperature is set to 0.6 for balanced creativity and consistency
- Response timeout is 30 seconds
- Topics are ordered from foundational to advanced
