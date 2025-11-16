# Step 6: Federated Thread Networks - Getting Started

## Overview

Step 6 introduces **federated networking** - the ability for multiple Thread instances to discover each other and collaborate peer-to-peer. This transforms Thread from a single-instance multi-agent system into a truly decentralized network of AI collaboration.

## What is Thread Federation?

Federation allows:
- **Multiple Thread instances** to connect and communicate
- **Workers to request help** from workers in other Thread instances
- **Peer-to-peer collaboration** without central servers
- **Decentralized intelligence** - no single point of control
- **Privacy-first** - you choose what to share and with whom

## Core Concepts

### Thread Identity

Each Thread instance has a unique identity:
- **Thread ID**: Cryptographic identifier (e.g., `thread-1731654321000-abc123def456`)
- **Display Name**: Human-readable name (e.g., "Alice's Coding Thread")
- **Protocol Version**: Ensures compatibility (currently `1.0.0`)

Your Thread identity persists across sessions (stored in browser localStorage).

### Peer Threads

Other Thread instances you connect to. Each peer has:
- **Capabilities**: List of skills their workers can perform
- **Reputation**: Performance score and tier (Novice to Expert)
- **Availability**: Whether they accept remote requests
- **Status**: Connected, connecting, disconnected, or error

### Thread Manifest

A JSON document describing your Thread's capabilities that you share with others to enable connections.

## Quick Start: Connecting Two Threads

### Scenario: Alice and Bob want to collaborate

**Alice has:** Thread with Python coding skills
**Bob has:** Thread with documentation skills

### Step 1: Alice Shares Her Manifest

1. Open Alice's Thread in browser
2. Click **"🌐 Federated Network"** to expand
3. Click **"📋 Copy My Manifest"**
4. Send the JSON to Bob (via email, chat, etc.)

Example manifest:
```json
{
  "threadId": "thread-1731654321000-alice123",
  "displayName": "Alice's Coding Thread",
  "protocolVersion": "1.0.0",
  "capabilities": [
    {
      "skill": "python",
      "workerCount": 2
    },
    {
      "skill": "rust",
      "workerCount": 1
    }
  ],
  "reputation": {
    "score": 0.85,
    "tier": "Advanced"
  },
  "nodes": {
    "total": 5,
    "workers": 3
  }
}
```

### Step 2: Bob Adds Alice as a Peer

1. Open Bob's Thread in browser
2. Expand **"🌐 Federated Network"**
3. Click **"+ Add Peer Thread"**
4. Paste Alice's manifest JSON
5. Click **"Add Peer"**

Bob will see Alice's Thread appear in the peers list with status "connected".

### Step 3: Bob Shares His Manifest with Alice

Repeat the process - Bob copies his manifest and Alice adds him as a peer.

### Step 4: Test the Connection

1. Click **"Test Task"** button on peer card
2. System sends a simple test task
3. If successful, you're connected!

## How Federation Works

### Collaboration Flow

```
Local Collaboration Attempt:
1. Worker-1 tries task
2. Worker-1 fails
3. Worker-1 requests help from local Worker-2
4. Worker-2 also fails

↓

Remote Collaboration (Federated):
5. System checks if peer Threads are connected
6. Finds peer Thread with matching skills
7. Sends task to remote Thread
8. Remote Thread's worker processes task
9. Remote Thread returns result
10. Both Threads update reputation

↓

Success! Task completed via federated collaboration.
```

### Reputation Across Threads

**Local Reputation**: Your own assessment based on direct interactions
**Reported Reputation**: What the peer Thread claims
**Combined Reputation**: Weighted average (60% reported, 40% local)

As you interact with peers, your local assessment becomes more accurate.

### Privacy & Security

**What is shared:**
- Thread ID and display name
- Aggregated skills (not specific prompts)
- Overall reputation (not task details)
- Node counts (not node configurations)

**What is NOT shared:**
- API keys
- Task content (unless you request remote help)
- Internal delegation logs
- Model configurations
- Specific node details

**When tasks are shared:**
- Only when local collaboration fails AND
- You have connected peers AND
- Peer has matching skills AND
- You choose to enable remote requests

## Configuration

### Privacy Settings (Future)

```javascript
{
  privacy: {
    shareMode: 'opt-in',  // Only share when explicitly requested
    allowedPeers: [],     // Whitelist specific Threads (empty = all allowed)
    blockedPeers: [],     // Blacklist specific Threads
    taskSanitization: true  // Remove sensitive data before sharing
  }
}
```

Currently, remote help is enabled by default but only occurs as a fallback after local collaboration fails.

### Display Name

Change your Thread's display name:
1. Expand **"🌐 Federated Network"**
2. Click **"Edit"** next to your display name
3. Enter new name
4. Click **"Save"**

## Use Cases

### 1. Personal Collaboration

**Scenario**: You have two Thread instances
- Thread A on desktop: Coding specialists
- Thread B on laptop: Writing specialists

When A needs documentation help, it asks B. When B needs code help, it asks A.

### 2. Team Coordination

**Scenario**: Team of 5 developers
- Each runs their own Thread instance
- All connect to each other
- Natural skill specialization emerges
- Automatic load balancing

### 3. Community Knowledge Sharing

**Scenario**: Online community
- Members share Thread manifests in forum
- Everyone adds peers they trust
- Community builds collective intelligence
- No central server required

### 4. Complementary Skills

**Scenario**: Different expertise areas
- Thread 1: Python, data science
- Thread 2: JavaScript, web dev
- Thread 3: DevOps, infrastructure
- Thread 4: Documentation, writing

All four connect, forming a complete skill set.

## Federation Dashboard Features

### Your Thread Identity Section

- View your Thread ID (unique identifier)
- Edit display name
- See protocol version
- Copy manifest to share with others

### Connected Peers Section

For each peer, see:
- Display name and Thread ID
- Connection status (connected/disconnected/error)
- Reputation score and tier
- Number of workers
- Available skills
- Tasks completed
- Times helped

Actions:
- **Test Task**: Send a test task to verify connection
- **Remove**: Disconnect and remove peer

### Network Statistics

- **Total Peers**: How many Threads you're connected to
- **Connected Peers**: How many are currently online
- **Avg Reputation**: Average reputation of your peers
- **Remote Tasks**: Total remote tasks processed

### Remote Task Performance

- **Success Rate**: % of remote tasks that succeeded
- **Avg Duration**: Average response time
- **Successful**: Count of successful remote tasks
- **Failed**: Count of failed remote tasks

## Testing Federation

### Test Scenario 1: Simple Connection

**Setup:**
1. Open Thread in two browser windows (or two machines)
2. Give each a different display name
3. Add workers with different skills to each

**Test:**
1. Copy manifest from Thread 1
2. Add as peer in Thread 2
3. Copy manifest from Thread 2
4. Add as peer in Thread 1
5. Both should show status "connected"
6. Click "Test Task" on each peer

**Expected**: Both tests succeed, stats update

### Test Scenario 2: Skill-Based Routing

**Setup:**
- Thread 1: Workers with skill "coding"
- Thread 2: Workers with skill "documentation"
- Connect both as peers

**Test:**
1. In Thread 1, execute documentation task
2. Local workers fail (no documentation skill)
3. System seeks remote help
4. Thread 2's documentation worker helps
5. Task succeeds

**Expected Output:**
```
Delegation Log:
✗ Worker-1 executing task (attempt 1/3)
✗ Worker-1 failed
📨 Seeking help from local collaborators
✗ All local collaborators failed
🌐 Seeking remote help from peer Threads
✓ Remote Thread (Thread 2) successfully assisted Worker-1

Metadata:
Executed by: remote-thread/worker-docs
Assisted by: Thread 2
Federated Collaboration: Yes
```

### Test Scenario 3: Multi-Peer Selection

**Setup:**
- Thread 1: Your Thread
- Thread 2: Peer with reputation 0.9
- Thread 3: Peer with reputation 0.6
- All have same skills

**Test:**
1. Execute task that requires remote help
2. Observe which peer is selected

**Expected**: Thread 2 selected first (higher reputation)

## Troubleshooting

### Issue: Peer shows "disconnected"

**Cause**: Simulated connection in current implementation
**Fix**: Click peer to attempt reconnection, or remove and re-add

### Issue: Test task fails

**Possible causes:**
1. Peer Thread not actually running (if on different machine)
2. Network issues (current version is simulated)
3. Skills mismatch

**Note**: Current implementation simulates remote tasks. In production with WebRTC, actual task execution would occur.

### Issue: Remote help not triggered

**Check:**
1. Do you have connected peers?
2. Do peers have required skills?
3. Did local collaboration fail first?
4. Check delegation log for details

**Remote help only activates when:**
- Local collaboration has been exhausted
- Peers are connected
- Peers have matching skills
- Peers are available (not overloaded)

### Issue: Can't copy manifest

**Fix**: Ensure you have nodes created first. Manifest includes node statistics.

## Current Limitations

### Simulated Networking

The current implementation **simulates** peer-to-peer connections for browser compatibility:
- Peers are stored locally
- "Connections" are simulated
- Remote tasks return simulated responses
- No actual network communication

### Future Implementation (WebRTC)

Production version will include:
- Real WebRTC data channels
- Actual peer-to-peer connections
- NAT traversal (STUN/TURN)
- True task execution on remote Threads
- Encrypted communication
- DHT-based discovery

### Why Simulated?

Browsers have security restrictions on direct peer connections. The current implementation:
- Demonstrates the UX and workflow
- Proves the architecture
- Works 100% locally
- Can be upgraded to real networking later

## What's Working Now

1. **Thread Identity**: ✅ Unique IDs, persistent names
2. **Peer Management**: ✅ Add, remove, list peers
3. **Manifest Sharing**: ✅ Copy/paste to connect
4. **Reputation Tracking**: ✅ Local assessment of peers
5. **Skill Matching**: ✅ Find best peer for task
6. **Federated Delegation**: ✅ Request remote help
7. **Federation UI**: ✅ Complete dashboard

## What's Simulated

1. **Network Communication**: Simulated (no actual WebRTC yet)
2. **Remote Task Execution**: Simulated responses
3. **Discovery**: Manual (no DHT or mDNS yet)

## Roadmap to Real Federation

### Phase 1: WebRTC Integration
- Implement WebRTC data channels
- Add STUN/TURN servers for NAT traversal
- Real peer-to-peer connections

### Phase 2: Discovery
- mDNS for local network discovery
- DHT for global discovery
- Bootstrap nodes for initial connections

### Phase 3: Security
- Implement actual cryptographic keys
- End-to-end encryption
- Task signature verification
- Reputation attestation

### Phase 4: Advanced Features
- Peer recommendations (friend-of-friend)
- Credit system for resource sharing
- Consensus validation
- Cross-Thread learning

## Best Practices

### 1. Start Small

Begin with 2-3 trusted peers before expanding your network.

### 2. Build Complementary Skills

Connect with Threads that have skills you lack. The value is in diversity.

### 3. Monitor Reputation

Remove peers with consistently low performance. Quality over quantity.

### 4. Test Connections

Use "Test Task" periodically to ensure peers are healthy.

### 5. Share Selectively

Only share your manifest with people/Threads you trust.

### 6. Update Display Name

Use descriptive names like "Alice's Python Thread" not "My Thread".

### 7. Maintain Diverse Peers

Don't connect only to high-reputation Threads. Give developing Threads a chance to help and learn.

## Architecture Notes

### File Structure

```
src/services/
├── threadIdentityService.js    # Thread ID, manifest generation
├── peerDiscoveryService.js     # Peer management, discovery
├── remoteTaskService.js         # Remote task delegation
└── collaborationService.js      # Enhanced with remote fallback

src/components/
└── FederatedPanel.js           # Federation UI dashboard
```

### Key Classes

**ThreadIdentity**
- Generates and manages Thread ID
- Creates manifests for sharing
- Persists to localStorage

**PeerThread**
- Represents a connected peer
- Tracks reputation and stats
- Manages connection state

**PeerDiscoveryManager**
- Manages all peers
- Handles peer lifecycle
- Finds best peer for tasks

**RemoteTaskManager**
- Delegates tasks to remote Threads
- Manages request/response
- Tracks remote task statistics

## Advanced Features

### Peer Ranking Algorithm

When selecting which peer to ask for help:

```javascript
score = (reputation * 10)  // Base score from reputation
      + (complementary_skills * 2)  // Bonus for unique skills
      + (fast_response * 1)  // Bonus for speed
      + (low_load * 2)  // Bonus for availability
```

### Reputation Updates

After each remote collaboration:

```javascript
if (successful) {
  localReputation += 0.05  // Increase trust
} else {
  localReputation -= 0.10  // Decrease trust
}

if (faster_than_average) {
  localReputation += 0.02  // Bonus for speed
}
```

### Fallback Cascade

The complete fallback chain:

```
1. Try task locally
   ↓ Failed
2. Try local collaborator #1
   ↓ Failed
3. Try local collaborator #2
   ↓ Failed
4. Try remote peer #1 (best reputation)
   ↓ Failed
5. Try remote peer #2 (second best)
   ↓ Failed
6. Try role switch (worker → architect)
   ↓ Failed
7. Return failure
```

## Security Considerations

### Current Security

- Thread IDs are random, hard to guess
- Manifests must be explicitly shared
- No auto-discovery (prevents unwanted connections)
- Local storage only (data stays on your machine)

### Future Security

- Public/private key cryptography
- Signed manifests (verify authenticity)
- Encrypted task content
- Reputation attestation (provable claims)
- Sybil attack prevention

## Privacy Model

### Privacy-First Design

- **Opt-in**: Federation is optional
- **Explicit**: You choose which peers to connect
- **Minimal**: Only share what's necessary
- **Local**: Computation stays local when possible
- **Transparent**: You see all remote requests

### Data Retention

- Peer list: Stored in memory only (not persisted)
- Thread ID: Persisted locally
- Remote task history: Kept for current session only
- Reputation: Local assessments stay local

## FAQ

**Q: Can anyone connect to my Thread?**
A: No. They need your manifest, which you explicitly share.

**Q: Will my tasks be sent to random people?**
A: No. Only to peers you've manually added.

**Q: Can I run Thread privately (no federation)?**
A: Yes. Simply don't add any peers. Federation is opt-in.

**Q: How is this different from cloud AI services?**
A: You control everything. Your Threads, your peers, your data, your rules.

**Q: Is this really peer-to-peer?**
A: The architecture is P2P-ready. Current version simulates P2P for browser compatibility. Production version will use WebRTC.

**Q: Can I connect Threads across the internet?**
A: Not yet (simulated connections only). Future WebRTC version will support global connections.

**Q: What happens if a peer goes offline?**
A: They'll show as "disconnected". Remote help won't route to them.

**Q: Can malicious peers attack my Thread?**
A: Current version: Low risk (simulated). Future version: Will include cryptographic verification, rate limiting, and sandboxing.

**Q: How many peers can I connect to?**
A: No hard limit currently. Recommended: 5-20 for performance.

**Q: Do peers see my API keys?**
A: Absolutely not. Never shared.

**Q: Can I earn money by helping others?**
A: Not currently. Future versions may include credit systems or cryptocurrency integration (optional).

## Next Steps

After setting up federation:

1. **Read**: FEDERATED_VISION.md for the complete vision
2. **Experiment**: Connect multiple Thread instances
3. **Share**: Your manifest with trusted collaborators
4. **Contribute**: Help build real WebRTC networking
5. **Imagine**: What's possible with decentralized AI collaboration

## Contributing to Federation

The federated networking layer is foundational for Thread's decentralized vision. Areas for contribution:

1. **WebRTC Integration**: Real peer-to-peer connections
2. **Discovery Protocols**: DHT, mDNS implementation
3. **Cryptography**: Key generation, signing, encryption
4. **NAT Traversal**: STUN/TURN server setup
5. **Mobile Support**: Thread on phones/tablets
6. **Performance**: Optimize for many peers
7. **UX**: Better peer management interface

## Conclusion

Federation transforms Thread from a single-instance tool into a **decentralized network of collaborative intelligence**. This is just the beginning.

**The vision:**
Thousands of Thread instances, run by people around the world, forming an open, censorship-resistant, privacy-preserving AI collaboration network.

**No companies. No gatekeepers. Just people helping people.**

**Thread is meant for the people. Let's build it together.**

---

For more details, see:
- FEDERATED_VISION.md - Complete architectural vision
- README.md - Project overview
- STEP3_GUIDE.md - Worker collaboration basics
- STEP4_5_GUIDE.md - Reputation system details
