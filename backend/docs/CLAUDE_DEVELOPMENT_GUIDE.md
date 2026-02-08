# Working with Claude for Prompt & JSON Development
# A Cost-Effective Guide for Long-Term Development

---

## WHY USE CLAUDE DIRECTLY FOR DEVELOPMENT?

Instead of using Emergent (me) for every small prompt tweak:
- **Faster iteration** - Claude responds in seconds
- **Cheaper** - Claude API costs less than full agent sessions
- **More control** - You see exactly what's happening
- **Better learning** - You understand your system deeply

**Use Emergent for**: Implementation, debugging, architecture changes
**Use Claude directly for**: Prompt refinement, JSON schema design, content generation

---

## OPTION 1: Claude.ai (Web Interface)

Best for: Quick iterations, testing ideas, no code needed

### How to Set Up

1. Go to https://claude.ai
2. Start a new conversation
3. Paste this context primer (copy the whole block):

```
I'm developing an occult folklore app called "Where The Crowlands". 

KEY ARCHITECTURE:
- DeepSeek handles factual research (outputs strict JSON with sources)
- Claude handles creative writing (transforms facts into beautiful prose)
- Four guide personas: Shigg (kitchen witch), Cathleen (Irish protector), Katherine (Victorian spiritualist), Theresa (Appalachian grandmother)

MY TASK TODAY:
[Describe what you want to create/improve]

I need you to help me design:
1. The JSON schema for input/output
2. The prompt for DeepSeek (research, facts only)
3. The prompt for Claude (creative writing)

Use this format for all responses:
- JSON in code blocks
- Clear section headers
- Examples with real content
```

### Example Session

**You:** 
```
I want to add a new spell block type called "ancestral_offering" that suggests appropriate offerings based on the user's heritage and intention.

Help me design the JSON schema and prompts.
```

**Claude will provide:**
- Input schema (what user provides)
- Output schema (what the block contains)
- DeepSeek prompt (to research offering traditions)
- Claude prompt (to write the suggestion in guide voice)

---

## OPTION 2: Claude API (For Developers)

Best for: Automated testing, batch operations, integration

### Setup

```python
import anthropic

client = anthropic.Anthropic(api_key="your-key-here")

def develop_prompt(task_description):
    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=4000,
        messages=[{
            "role": "user",
            "content": f"""You are helping develop prompts for the Crowlands occult folklore app.

ARCHITECTURE:
- DeepSeek: Research/facts (strict JSON, sources required)
- Claude: Creative writing (guide voices, beautiful prose)
- Four personas: Shigg, Cathleen, Katherine, Theresa

TASK:
{task_description}

PROVIDE:
1. JSON schema (input and output)
2. DeepSeek prompt (research stage)
3. Claude prompt (writing stage)
4. Example with real content

Format all JSON in code blocks."""
        }]
    )
    return response.content[0].text

# Example usage
result = develop_prompt("""
I want to create a "moon_phase" block that adjusts spell timing 
recommendations based on lunar cycles and the guide's tradition.
""")
print(result)
```

---

## OPTION 3: Anthropic Workbench

Best for: Visual prompt testing, comparing outputs

1. Go to https://console.anthropic.com/workbench
2. Create a new prompt
3. Use the system prompt below
4. Test with different user inputs

### System Prompt for Development Work

```
You are a prompt engineer for the Crowlands occult folklore app.

## APP ARCHITECTURE
The app uses a dual-AI system:
- DEEPSEEK: Factual research, source citation, verification (outputs JSON)
- CLAUDE: Creative writing, guide voices, storytelling (outputs prose or JSON)

## THE FOUR GUIDES
1. Shigg - Kitchen witch, warm, cozy, British folk magic
2. Cathleen - Fierce protector, Irish, voice/song magic
3. Katherine - Victorian spiritualist, academic, precise
4. Theresa - Appalachian grandmother, family tradition, practical

## YOUR ROLE
Help design prompts and JSON schemas for new features.
Always provide:
1. Clear JSON schemas with comments
2. Separate prompts for DeepSeek (research) and Claude (writing)
3. Real examples, not placeholders
4. Consideration of all four guides where applicable

## OUTPUT FORMAT
Use markdown with code blocks for all JSON and prompts.
```

---

## TEMPLATES FOR COMMON TASKS

### Template 1: New Spell Block Type

```
TASK: Design a new spell block

BLOCK NAME: [name]
PURPOSE: [what it does]
WHICH GUIDES: [all / specific ones]

USER INPUT:
- [what the user provides]

DESIRED OUTPUT:
- [what the block should contain]

SPECIAL REQUIREMENTS:
- [any constraints or rules]
```

### Template 2: Improve Existing Prompt

```
TASK: Improve a prompt

CURRENT PROMPT:
[paste the current prompt]

CURRENT OUTPUT PROBLEM:
[what's wrong with current outputs]

DESIRED IMPROVEMENT:
[what you want instead]

EXAMPLE OF BAD OUTPUT:
[paste an actual bad output]

EXAMPLE OF GOOD OUTPUT:
[describe or paste what you want]
```

### Template 3: New Timeline Content

```
TASK: Design timeline event structure

EVENT TYPE: [spiritualism / folk magic / ceremonial / etc]
ERA: [Victorian / Modern / etc]
GUIDE RELEVANCE: [which guides care about this]

RESEARCH NEEDS (DeepSeek):
- [what facts to find]
- [what sources to cite]

NARRATIVE NEEDS (Claude):
- [what tone/voice]
- [what emotions to evoke]

EXAMPLE EVENT:
[provide a sample event to base it on]
```

### Template 4: JSON Schema Design

```
TASK: Design JSON schema

FEATURE: [name]
USED BY: [which part of the app]

INPUT DATA:
- field1: type, description
- field2: type, description

OUTPUT DATA:
- field1: type, description
- field2: type, description

VALIDATION RULES:
- [required fields]
- [value constraints]
- [relationships between fields]

EXAMPLE:
[show a filled-in example]
```

---

## COST COMPARISON

| Method | Cost | Speed | Best For |
|--------|------|-------|----------|
| Claude.ai (free tier) | $0 | Fast | Quick ideas, testing |
| Claude.ai (Pro $20/mo) | Fixed | Fast | Regular development |
| Claude API (Sonnet) | ~$0.01/task | Fast | Automation, batch |
| Claude API (Opus) | ~$0.05/task | Slower | Complex reasoning |
| Emergent Agent | Higher | Full session | Implementation |

### Recommended Workflow

1. **Ideation** → Claude.ai free tier
2. **Schema Design** → Claude.ai or Workbench
3. **Prompt Testing** → Claude API with test script
4. **Implementation** → Emergent Agent
5. **Refinement** → Claude API or Workbench

---

## EXAMPLE: FULL DEVELOPMENT CYCLE

### Step 1: Idea (Claude.ai)

**You:** "I want a spell block that shows the user what birds might appear as omens after their working, based on Shigg's bird oracle tradition."

**Claude:** Provides initial schema and prompts

### Step 2: Refine Schema (Workbench)

Test the schema with different inputs:
- Protection spell → what birds?
- Love spell → what birds?
- Grief spell → what birds?

### Step 3: Test Prompts (API Script)

```python
# Test DeepSeek prompt with real queries
test_cases = [
    {"intention": "protection", "guide": "shigg"},
    {"intention": "finding love", "guide": "shigg"},
    {"intention": "honoring grief", "guide": "shigg"},
]

for case in test_cases:
    result = test_deepseek_prompt(case)
    print(f"Input: {case}")
    print(f"Output birds: {result.get('birds', [])}")
    print(f"Sources: {len(result.get('sources', []))}")
    print("---")
```

### Step 4: Implement (Emergent)

"I've designed a bird oracle block. Here's the JSON schema and prompts I tested. Please implement this in the spell generation pipeline."

### Step 5: Iterate (Claude API)

If outputs aren't quite right, refine prompts using Claude directly, then update in codebase.

---

## QUICK REFERENCE: WHAT TO SEND CLAUDE

When asking Claude to help with Crowlands development, always include:

✅ Which AI handles this (DeepSeek or Claude)
✅ Which guide(s) are involved
✅ Input data structure
✅ Desired output structure
✅ Example with real content
✅ Any constraints or rules

❌ Don't ask vague questions like "make it better"
❌ Don't forget to specify the guide voice
❌ Don't mix research and creative tasks

---

## SAVING YOUR WORK

After a Claude session produces good prompts:

1. **Save to `/app/backend/prompts/` directory**
2. **Name clearly**: `block_ancestral_offering.py`
3. **Include metadata**:
   ```python
   # Ancestral Offering Block Prompts
   # Created: 2025-02-08
   # Tested with: [test cases]
   # Used by: Deep tier spells, Theresa and Katherine
   ```

4. **Tell Emergent to integrate**: "I created new prompts at /app/backend/prompts/block_ancestral_offering.py. Please integrate this into the spell pipeline."

---

*This guide helps you iterate faster and cheaper while maintaining quality.*
