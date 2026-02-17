# EMERGENT: Replace Mocked Archivist with Real DeepSeek Research
## Where The Crowlands - February 16, 2026

**PRIORITY: P1 — This is the single biggest quality improvement remaining.**

**WHY THIS MATTERS:** Every spell generated right now gets the same two hardcoded research facts about "family patterns" and "Murray Bowen." It doesn't matter if the user asks for protection, comfort, ancestral work, or baneful justice — the AI writer gets the same stale research. This directly degrades spell quality because the writer prompts ask for historical anecdotes and tradition references, but only have generic data to draw from.

---

# THE FIX

## File: `backend/prompts/pipeline_blocks.py`

### Find the `_run_archivist` method (around line 1044)

The current code looks like this:

```python
    async def _run_archivist(self, spell_spec: dict, guide_id: str) -> dict:
        """Stage 1: Run Archivist research - returns research packet"""
        import time
        start = time.time()

        # For now, return a basic research packet
        # Full Archivist integration would use deepseek_client
        research_packet = {
            "query_understood": spell_spec.get("user_query", ""),
            "research_mode": "spell_origins",
            "facts": [
                {
                    "claim": "Family patterns often repeat across generations until consciously addressed",
                    ...
                },
                ...
            ],
            "sources": [...],
            "tradition_context": {...}
        }

        self.timing_log["archivist_ms"] = int((time.time() - start) * 1000)
        return research_packet
```

### Replace the ENTIRE method body with:

```python
    async def _run_archivist(self, spell_spec: dict, guide_id: str) -> dict:
        """Stage 1: Run Archivist research via DeepSeek"""
        import time
        start = time.time()

        user_query = spell_spec.get("user_query", "")
        anchor_object = spell_spec.get("anchor_object", None)
        materials_raw = spell_spec.get("materials", [])
        # materials might be a list of strings or dicts
        materials = []
        if isinstance(materials_raw, list):
            for m in materials_raw:
                if isinstance(m, str):
                    materials.append(m)
                elif isinstance(m, dict):
                    materials.append(m.get("name", str(m)))

        context = spell_spec.get("context", None)
        if not context:
            feeling = spell_spec.get("desired_feeling", "")
            alchemize = spell_spec.get("alchemize_category", "")
            setting = spell_spec.get("setting", "")
            context = f"Feeling/Category: {feeling or alchemize}. Setting: {setting}. Guide: {guide_id}."

        try:
            from research_service import research_query_v2

            research_result = await research_query_v2(
                query=user_query,
                persona_id=guide_id,
                anchor_object=anchor_object,
                materials=materials if materials else None,
                context=context
            )

            # Transform ResearchResponseV2 into the pipeline's expected format.
            # The pipeline reads: research_packet["facts"], research_packet["sources"],
            # research_packet["tradition_context"]
            # ResearchResponseV2 has: .why_this_works_facts, .sources, .practice_context

            # Convert why_this_works_facts to the "facts" format the pipeline expects
            facts = []
            if hasattr(research_result, 'why_this_works_facts') and research_result.why_this_works_facts:
                for fact in research_result.why_this_works_facts:
                    if isinstance(fact, dict):
                        facts.append({
                            "claim": fact.get("claim", fact.get("text", str(fact))),
                            "claim_type": fact.get("claim_type", "folklore"),
                            "confidence": fact.get("confidence", "medium"),
                            "source_refs": fact.get("source_refs", []),
                            "why_it_works": fact.get("why_it_works", fact.get("explanation", "")),
                            "hedging_required": fact.get("hedging_required", False)
                        })
                    elif isinstance(fact, str):
                        facts.append({
                            "claim": fact,
                            "claim_type": "folklore",
                            "confidence": "medium",
                            "source_refs": [],
                            "why_it_works": "",
                            "hedging_required": False
                        })

            # Also pull from key_takeaways if we need more facts
            if hasattr(research_result, 'key_takeaways') and research_result.key_takeaways and len(facts) < 3:
                for takeaway in research_result.key_takeaways:
                    text = takeaway if isinstance(takeaway, str) else takeaway.get("text", str(takeaway))
                    facts.append({
                        "claim": text,
                        "claim_type": "academic",
                        "confidence": "medium",
                        "source_refs": [],
                        "why_it_works": text,
                        "hedging_required": False
                    })

            # Convert sources
            sources = []
            if hasattr(research_result, 'sources') and research_result.sources:
                for src in research_result.sources:
                    if isinstance(src, dict):
                        sources.append({
                            "source_id": src.get("source_id", src.get("title", "unknown")),
                            "author": src.get("author", ""),
                            "work": src.get("work", src.get("title", "")),
                            "year": src.get("year", None),
                            "quality_tier": src.get("quality_tier", "community_tradition"),
                            "relevance": src.get("relevance", ""),
                            "learn_more_url": src.get("url", src.get("learn_more_url", None))
                        })
                    elif isinstance(src, str):
                        sources.append({
                            "source_id": src,
                            "author": "",
                            "work": src,
                            "year": None,
                            "quality_tier": "community_tradition",
                            "relevance": ""
                        })

            # Convert practice_context to tradition_context
            practice = {}
            if hasattr(research_result, 'practice_context') and research_result.practice_context:
                practice = research_result.practice_context if isinstance(research_result.practice_context, dict) else {}

            tradition_context = {
                "primary_tradition": practice.get("primary_tradition", practice.get("tradition", "british_folk_magic")),
                "related_traditions": practice.get("related_traditions", practice.get("related", [])),
                "geographic_origin": practice.get("geographic_origin", practice.get("origin", "British Isles")),
                "time_period": practice.get("time_period", "Traditional to Modern")
            }

            research_packet = {
                "query_understood": user_query,
                "research_mode": getattr(research_result, 'research_mode', 'spell_origins'),
                "summary": getattr(research_result, 'summary', ''),
                "facts": facts,
                "sources": sources,
                "tradition_context": tradition_context
            }

            logger.info(f"[ARCHIVIST] DeepSeek research complete: {len(facts)} facts, {len(sources)} sources")

        except Exception as e:
            logger.error(f"[ARCHIVIST] DeepSeek research failed, using fallback: {e}")

            # Fallback: return minimal research packet so the pipeline doesn't break
            research_packet = {
                "query_understood": user_query,
                "research_mode": "spell_origins",
                "facts": [
                    {
                        "claim": f"Traditional practices addressing '{user_query[:80]}' draw from folk wisdom passed through generations",
                        "claim_type": "folklore",
                        "confidence": "medium",
                        "source_refs": ["folk_traditions"],
                        "why_it_works": "Ritual creates a psychological container for intentional change",
                        "hedging_required": False
                    }
                ],
                "sources": [
                    {
                        "source_id": "folk_traditions",
                        "author": "Various",
                        "work": "Folk Traditions of the British Isles",
                        "year": None,
                        "quality_tier": "community_tradition",
                        "relevance": "General folk approaches"
                    }
                ],
                "tradition_context": {
                    "primary_tradition": "british_folk_magic",
                    "related_traditions": ["ancestral_work"],
                    "geographic_origin": "British Isles",
                    "time_period": "Traditional to Modern"
                }
            }

        self.timing_log["archivist_ms"] = int((time.time() - start) * 1000)
        return research_packet
```

### Key Design Decisions:

1. **Graceful fallback**: If DeepSeek fails (missing API key, network error, timeout), the pipeline still works with a minimal research packet. The spell still generates — it just won't have rich research.

2. **Format translation**: `research_query_v2()` returns a `ResearchResponseV2` object with V2 field names (`why_this_works_facts`, `practice_context`). The pipeline expects a dict with V1 field names (`facts`, `tradition_context`). The code maps between them.

3. **Type safety**: Both dicts and strings are handled for facts, sources, and takeaways — because DeepSeek sometimes returns inconsistent JSON.

4. **Imports**: Uses `from research_service import research_query_v2` which already exists and works (it's the same function the standalone `/api/combined` research endpoint calls).

---

# ALSO CHECK: DeepSeek Client Availability

The `research_query_v2()` function calls `get_deepseek_client()` which reads `DEEPSEEK_API_KEY` from environment.

**Verify the key is set:**

```bash
# Check if DEEPSEEK_API_KEY is in the environment
env | grep DEEPSEEK_API_KEY
# Should return a line like DEEPSEEK_API_KEY=sk-...

# If not set, add it to the backend .env file or environment config
```

If there's no DeepSeek key available, the fallback will kick in and spells will still generate — they just won't have real research. This is the same as the current behavior, so nothing breaks.

---

# ALSO CHECK: The `pipeline.py` Legacy File

There's a second `_run_archivist` method in `/backend/prompts/pipeline.py` (around line 111). This is the **legacy pipeline** (non-blocks). If it's still being called anywhere, apply the same fix. Otherwise ignore it.

```bash
# Check if legacy pipeline is still used
grep -rn "from prompts.pipeline import" backend/server.py
grep -rn "from prompts.pipeline import" backend/prompts/
```

If nothing imports from `pipeline.py`, you can ignore it.

---

# VERIFICATION

```bash
# Restart backend
sudo supervisorctl restart backend

# Verify backend is running
sudo supervisorctl status

# Check logs for archivist calls
tail -100 /var/log/supervisor/backend.err.log | grep ARCHIVIST
```

## Test Spell Generation

1. Generate a spell requesting "protection from a toxic workplace"
2. Check the spell output — it should reference specific traditions, historical practices, and sources relevant to protection magic, NOT generic "family patterns" content
3. The sources section should have real book titles and authors from DeepSeek's research
4. Click "Show Research & Origins" — this should also work independently (it calls `/api/combined`, not the archivist)

## Test Fallback

1. Temporarily unset `DEEPSEEK_API_KEY`
2. Generate a spell
3. It should still work — just with the minimal fallback research
4. Re-set the key and restart

---

# DEPLOYMENT REMINDER

**After implementing this fix:**

1. Merge `Emergent-New-Changes` into `main`
2. Rebuild frontend: `cd frontend && npm run build`
3. Restart backend: `sudo supervisorctl restart backend`
4. Verify the live site is running the latest code

The Phases 0-7 code, the bug fixes, AND this archivist fix all need to be in the deployed build. Every round we've had the same issue: code exists in the branch but the live site is behind. Please confirm the merge + rebuild happens.

---

**END OF DOCUMENT**
