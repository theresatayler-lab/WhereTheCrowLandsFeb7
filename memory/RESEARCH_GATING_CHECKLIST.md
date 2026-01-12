# Research Pipeline Gating Checklist
## Validation Tests for DeepSeek→OpenAI Separation

> **Status:** CHECKLIST ONLY — For use when pipeline is implemented

---

## Pre-Implementation Verification

Before implementing, verify these fixtures pass manual inspection:

- [ ] All 3 fixture research_briefs contain NO persona voice
- [ ] All 3 fixture research_objects contain NO emotional language
- [ ] All sources in fixtures are real (spot-check 3 links)
- [ ] Expected inspired_by formats match research_object sources exactly

---

## DeepSeek Output Validation

### Content Rules
| Check | Pass Criteria | Failure Indicator |
|-------|---------------|-------------------|
| No persona voice | Output contains none of: "dear", "seeker", "my child", "warmth", "gentle" | Any match = FAIL |
| No emotional reassurance | Output contains none of: "don't worry", "you'll be okay", "I understand" | Any match = FAIL |
| Structured JSON only | Output parses as valid JSON | Parse error = FAIL |
| Schema compliance | All required fields present | Missing field = FAIL |

### Source Rules
| Check | Pass Criteria | Failure Indicator |
|-------|---------------|-------------------|
| Source IDs valid | All source_ids exist in SOURCE_ENCYCLOPEDIA or fixture allowlist | Unknown source_id = FAIL |
| Links from allowlist | All URLs match allowed domains | Unknown domain = FAIL |
| Confidence stated | confidence_level field present and valid | Missing/invalid = FAIL |
| No fabricated sources | Spot-check: source exists (Google title + author) | Not found = INVESTIGATE |

### Automated Checks (Future)
```python
def validate_deepseek_output(output: dict) -> list[str]:
    errors = []
    
    # Persona voice detection
    forbidden_words = ["dear", "seeker", "my child", "warmth", "gentle", "beloved"]
    text = json.dumps(output).lower()
    for word in forbidden_words:
        if word in text:
            errors.append(f"PERSONA_LEAK: Found '{word}' in DeepSeek output")
    
    # Schema validation
    required_fields = ["core_explanation", "historical_examples", "sources", "confidence_level"]
    for field in required_fields:
        if field not in output:
            errors.append(f"SCHEMA_ERROR: Missing required field '{field}'")
    
    # Source validation
    allowed_domains = ["archive.org", "wikipedia.org", "goodreads.com", "jstor.org", 
                       "sacred-texts.com", "british-history.ac.uk", "worldcat.org"]
    for source in output.get("sources", []):
        for link in source.get("public_links", []):
            url = link.get("url", "")
            if not any(domain in url for domain in allowed_domains):
                errors.append(f"DOMAIN_ERROR: URL '{url}' not in allowlist")
    
    return errors
```

---

## OpenAI Output Validation

### Content Rules
| Check | Pass Criteria | Failure Indicator |
|-------|---------------|-------------------|
| Has persona voice | Output contains warm, teaching language appropriate to persona | Too dry/clinical = FAIL |
| No new sources | Every source in inspired_by has matching source_id in research_object | New source_id = FAIL |
| Connection explained | Each reference has connection_to_spell field | Missing connection = FAIL |
| Links preserved | All learn_more URLs come from research_object | New URL = FAIL |

### Source Tracing
| Check | Pass Criteria | Failure Indicator |
|-------|---------------|-------------------|
| Exact match | inspired_by[n].source_id in research_object.sources | No match = FAIL |
| No additions | len(inspired_by) <= len(research_object.sources) | More sources = FAIL |
| URL pass-through | All URLs in learn_more exist in research_object | New URL = FAIL |

### Automated Checks (Future)
```python
def validate_openai_output(openai_output: dict, research_object: dict) -> list[str]:
    errors = []
    
    # Get allowed source IDs
    allowed_sources = {s["source_id"] for s in research_object.get("sources", [])}
    
    # Get allowed URLs
    allowed_urls = set()
    for source in research_object.get("sources", []):
        for link in source.get("public_links", []):
            allowed_urls.add(link.get("url", ""))
    
    # Check each reference
    for ref in openai_output.get("inspired_by", []):
        source_id = ref.get("source_id")
        if source_id not in allowed_sources:
            errors.append(f"NEW_SOURCE: '{source_id}' not in research_object")
        
        # Check connection exists
        if not ref.get("connection_to_spell"):
            errors.append(f"MISSING_CONNECTION: No connection_to_spell for '{source_id}'")
        
        # Check URLs
        for link in ref.get("learn_more", []):
            url = link.get("url", "")
            if url not in allowed_urls:
                errors.append(f"NEW_URL: '{url}' not in research_object")
    
    return errors
```

---

## Integration Validation

### Pipeline Flow
| Step | Check | Pass Criteria |
|------|-------|---------------|
| 1 | Research brief created | Contains practice_type, tools, tradition_focus |
| 2 | Brief stripped | No persona voice in DeepSeek input |
| 3 | DeepSeek called | Returns valid research_object |
| 4 | Research object passed | Unchanged to OpenAI |
| 5 | OpenAI called | Returns spell with inspired_by |
| 6 | Final validation | All inspired_by sources trace to research_object |

### Logging Requirements (Future)
```python
# Log these at each step for debugging
logger.info(f"RESEARCH_BRIEF: {json.dumps(brief)}")
logger.info(f"DEEPSEEK_OUTPUT: {json.dumps(research_object)}")
logger.info(f"OPENAI_INPUT_SOURCES: {[s['source_id'] for s in research_object['sources']]}")
logger.info(f"OPENAI_OUTPUT_SOURCES: {[r['source_id'] for r in spell['inspired_by']]}")
```

---

## Quality Failure Checklist

If the final spell feels wrong, check in this order:

### "Spell sounds bland/generic"
1. Check if persona voice is present in OpenAI output
2. Check if research_object has specific historical examples
3. Check if tool_rationale was provided to OpenAI

### "Citations feel fake/invented"
1. Verify all source_ids exist in SOURCE_ENCYCLOPEDIA
2. Spot-check URLs manually (do they work?)
3. Check confidence_level — if "speculative", was uncertainty communicated?

### "References don't match spell content"
1. Check connection_to_spell field quality
2. Verify OpenAI received full research_object
3. Check if research_brief was too vague

### "Links are broken/wrong"
1. Check allowed_domains list is up to date
2. Verify URL was in research_object (not invented by OpenAI)
3. Consider adding "suggested_lookup" for hard-to-find sources

---

## Sign-off Criteria

Before considering pipeline complete:

- [ ] All 3 fixtures pass automated validation
- [ ] 5 real spells generated without source errors
- [ ] Manual spot-check of 10 URLs (all valid)
- [ ] No persona voice in any DeepSeek logs
- [ ] No invented sources in any OpenAI output
- [ ] User acceptance of reference quality

---

*Checklist created: Prep-only phase*
*To be used when: Pipeline is implemented after visual polish*
