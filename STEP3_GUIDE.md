# Step 3: Dynamic Role Switching and Worker Collaboration Guide

This guide explains the advanced features introduced in Step 3, including worker collaboration, dynamic role switching, and intelligent task routing.

## Overview

Step 3 transforms Thread from a hierarchical system into a self-organizing, adaptive network where:
- **Workers collaborate** with each other when stuck
- **Roles dynamically switch** when traditional approaches fail
- **Skills drive routing** for intelligent task assignment
- **Failures trigger escalation** and alternative problem-solving approaches

## New Features

### 1. Skills System

Every node can now advertise its capabilities:

```javascript
Skills: "coding, python, documentation, testing"
```

**Benefits**:
- Brokers intelligently route tasks to best-suited workers
- Workers with matching skills are prioritized
- More versatile workers (more skills) get preference when skills don't match

**Configuration**:
1. Select a node
2. Scroll to "Skills & Capabilities" section
3. Enter comma-separated skills
4. Save configuration

### 2. Worker Collaboration

When a worker encounters a problem it can't solve:

```
Worker-1 fails → Seeks help from Worker-2 → Worker-2 assists → Success
```

**How it Works**:
1. Worker attempts task
2. On failure, checks if collaboration is enabled
3. Finds another available worker in the network
4. Requests assistance with context about previous failure
5. Collaborating worker attempts with enhanced prompt
6. Success credited to both workers

**Configuration**:
- **Can Collaborate**: Yes/No toggle in configuration
- **Max Retries**: Number of attempts before seeking help (default: 3)

### 3. Dynamic Role Switching

The most innovative feature - workers become architects when needed:

```
Worker fails repeatedly → No collaboration available → Worker becomes Architect
→ Re-frames problem → Solves with new approach
```

**When It Happens**:
- Worker exhausts all retry attempts
- Collaboration failed or unavailable
- Worker has `Can Lead` enabled
- Worker re-analyzes and tries alternative approach

**Configuration**:
- **Can Lead**: Yes/No toggle in configuration
- Allows worker to temporarily act as architect

### 4. Failure Detection & Retry Logic

Intelligent failure handling with escalation:

**Retry Sequence**:
1. **Attempt 1**: Direct execution
2. **Attempt 2**: Retry with same approach
3. **Attempt 3**: Seek collaboration (if enabled)
4. **Max Retries**: Dynamic role switch (if can lead)

**Configuration**:
- **Max Retry Attempts**: 0-10 (default: 3)
- Configurable per node in System Parameters

## Usage Examples

### Example 1: Simple Collaboration

**Setup**:
```
Worker-1 (Skills: "coding, python", Can Collaborate: Yes)
Worker-2 (Skills: "debugging, testing", Can Collaborate: Yes)
```

**Scenario**:
1. Assign complex task to Worker-1
2. Worker-1 fails after retries
3. Worker-1 seeks help from Worker-2
4. Worker-2 solves it
5. Output shows: "Assisted by: node-2 (Collaboration)"

### Example 2: Role Switching

**Setup**:
```
Worker-1 (Can Collaborate: No, Can Lead: Yes, Max Retries: 2)
```

**Scenario**:
1. Assign difficult task
2. Worker fails twice
3. No collaboration available
4. Worker becomes Architect
5. Re-frames problem with new approach
6. Output shows: "Role Switch: worker → architect"

### Example 3: Skill-Based Routing

**Setup**:
```
Architect → Broker
  ├→ Worker-1 (Skills: "coding, javascript, frontend")
  ├→ Worker-2 (Skills: "coding, python, backend")
  └→ Worker-3 (Skills: "documentation, writing")
```

**Scenarios**:
- Task: "Write Python API" → Routed to Worker-2 (python skill)
- Task: "Create React component" → Routed to Worker-1 (javascript, frontend)
- Task: "Write user guide" → Routed to Worker-3 (documentation)

### Example 4: Full Collaboration Flow

**Setup**:
```
Architect → Broker → Worker-1, Worker-2, Worker-3
All workers: Can Collaborate: Yes, Can Lead: Yes, Max Retries: 3
```

**Complex Scenario**:
1. Architect receives difficult task
2. Broker analyzes and assigns to Worker-1 (best skill match)
3. Worker-1 attempts (Attempt 1): Fails
4. Worker-1 retries (Attempt 2): Fails
5. Worker-1 seeks collaboration from Worker-2 (Attempt 3)
6. Worker-2 also fails
7. Worker-1 becomes Architect (Role Switch)
8. Worker-1 re-frames problem and solves it
9. Output shows full collaboration log with all attempts

## Understanding the Delegation Log

The delegation log now shows advanced behaviors:

### Standard Execution
```
🏗️ Architect node-1: Received task (attempt 1)
🏗️ Architect node-1: Delegating to broker node-2
🔀 Broker node-2: Analyzing task for skill match
🔀 Broker node-2: Assigned to worker node-3 (skills: coding, python)
⚙️ Worker node-3: Executing task (attempt 1/3)
⚙️ Worker node-3: Completed task successfully
```

### Collaboration
```
⚙️ Worker node-3: Executing task (attempt 1/3)
⚙️ Worker node-3: Task failed - error message
⚙️ Worker node-3: Seeking help from peers
⚙️ Worker node-3: Requesting help from node-4
⚙️ Worker node-4: Assisting node-3 (Collaboration)
⚙️ Worker node-4: Successfully assisted node-3
```

### Role Switch
```
⚙️ Worker node-3: Executing task (attempt 3/3)
⚙️ Worker node-3: Task failed - error message
⚙️ Worker node-3: Taking lead role due to repeated failures
🏗️ Worker node-3: Now acting as Architect - re-decomposing task (Role Switch)
🏗️ Worker node-3: Solved problem with new approach
```

## Configuration Best Practices

### For Collaborative Networks

**Architect**:
```
- Skills: "planning, architecture, task-decomposition"
- Can Collaborate: No (architects don't typically collaborate)
- Can Lead: Yes
```

**Broker**:
```
- Skills: "routing, coordination"
- Can Collaborate: No (brokers route, don't execute)
- Can Lead: No
```

**Workers**:
```
- Skills: Specific to their role
- Can Collaborate: Yes
- Can Lead: Yes
- Max Retries: 3
```

### For Independent Networks

**All Nodes**:
```
- Can Collaborate: No
- Can Lead: No
- Max Retries: 1 (fail fast)
```

### For Experimental Networks

**All Workers**:
```
- Skills: Varied and overlapping
- Can Collaborate: Yes
- Can Lead: Yes
- Max Retries: 5 (high resilience)
```

## Metadata and Badges

The output panel now shows special badges for advanced features:

### Collaboration Badge (Blue)
- **Label**: "Assisted by"
- **Shows**: Which worker helped
- **Indicates**: Successful peer collaboration

### Role Switch Badge (Pink)
- **Label**: "Role Switch"
- **Shows**: Original role → New role
- **Indicates**: Dynamic role adaptation occurred

### Validation Badge (Green)
- **Label**: "Validation"
- **Shows**: "Independently Verified"
- **Indicates**: Validator node checked the result

## Troubleshooting

### Workers Not Collaborating

**Check**:
1. "Can Collaborate" is enabled
2. Other workers exist in the network
3. Max retries is > 1
4. Task is actually failing (simulated failures won't trigger collaboration)

### No Role Switching

**Check**:
1. "Can Lead" is enabled
2. All retries exhausted
3. Collaboration failed or disabled
4. Task failed (success won't trigger switch)

### Skills Not Matching

**Remember**:
- Skills are keyword-based
- Match is case-insensitive
- Partial matches work (skill "python" matches task "Python API")
- Workers with no skill matches still get assigned (lowest priority)

### Collaboration Log Empty

**Reasons**:
- Direct execution (no delegation needed)
- Task succeeded first try (no collaboration needed)
- No failures occurred

## Advanced Scenarios

### Cascading Collaboration

Multiple workers helping each other:

```
Worker-1 fails → asks Worker-2 → Worker-2 fails → asks Worker-3 → Success
```

Currently, collaboration is one level deep. Future versions may support cascading.

### Skill Specialization

Create specialized workers:

```
Worker-Frontend: "javascript, react, css, html"
Worker-Backend: "python, django, sql, api"
Worker-DevOps: "docker, kubernetes, ci/cd"
Worker-Testing: "testing, qa, selenium, jest"
```

Broker intelligently routes each part of a complex project.

### Self-Healing Networks

Network adapts to node failures:

```
Worker-A fails permanently → Worker-B takes over → Becomes architect → Reorganizes remaining workers
```

### Reputation (Future)

While not yet implemented, the foundation exists for:
- Tracking success rates per worker
- Prioritizing high-reputation workers
- Learning which workers excel at which tasks

## Testing Step 3

### Test 1: Basic Collaboration

1. Create 2 workers
2. Set both "Can Collaborate: Yes"
3. Give them different skills
4. Send a challenging task to Worker-1
5. Watch collaboration unfold in the log

### Test 2: Role Switching

1. Create 1 worker
2. Set "Can Collaborate: No", "Can Lead: Yes", "Max Retries: 2"
3. Send a complex task
4. Worker will switch roles and solve it differently

### Test 3: Skill Routing

1. Create Architect → Broker → 3 Workers
2. Give each worker unique skills
3. Send tasks matching different skills
4. Watch broker route to appropriate workers

## Performance Considerations

### Retries Impact Speed

More retries = slower execution but higher success rate

**Recommendation**: 2-3 retries for production

### Collaboration Overhead

Each collaboration attempt doubles execution time

**Recommendation**: Enable only for complex tasks

### Role Switching Cost

Role switching adds one additional execution attempt

**Recommendation**: Reserve for truly stuck situations (high max retries)

## Next Steps

After mastering Step 3:

**Step 4** will add:
- Validator feedback loops
- Client clarification requests
- Requirement validation
- Validation-driven retries

**Step 5** will add:
- Reputation scoring system
- Performance-based routing
- Learning from failures
- Network optimization

## Tips for Best Results

1. **Start Simple**: Enable one feature at a time
2. **Watch the Logs**: Collaboration log reveals the magic
3. **Tune Retries**: Find the right balance for your use case
4. **Specialize Skills**: Clear skill definitions improve routing
5. **Embrace Failure**: The system learns from failures

## Real-World Applications

### Software Development
- Frontend worker collaborates with backend worker
- Testing worker validates code worker's output
- DevOps worker switches to architect when deployment fails

### Content Creation
- Writer worker collaborates with editor worker
- Research worker provides data to writer
- Designer worker validates visual consistency

### Data Analysis
- Data collector fails → switches to architect → redesigns collection strategy
- Analyst collaborates with statistician
- Validator ensures data quality

---

For more information:
- See STEP2_GUIDE.md for multi-node basics
- See SETUP.md for installation
- Check delegation log for real-time insights into collaboration
