# Spell Personalization Overhaul - Testing

## Testing Protocol
Test the enhanced spell generation system with the following requirements:
1. 2 LLM calls only (Planner + Writer)
2. 6 generated images (header, tarot, sigil, 3 dividers)
3. Static micro-icons (no generation)
4. Strict citations from allowed sources only
5. Variation tokens for uniqueness
6. Tarot constraints to prevent image repetition

## Test Scenarios

### Test 1: Shigg Spell (Kitchen/Tea)
- Persona: shigg
- Anchor: tea
- Setting: kitchen
- Feeling: calm
- Expected scenario: kettle_charm or tea_ring_unknotting

### Test 2: Cathleen Spell (Voice/Protection)
- Persona: cathleen  
- Anchor: song
- Setting: bedroom
- Feeling: protected
- Expected scenario: voice_ward or home_circle_blessing

### Test 3: Katherine Spell (Mirror/Discernment)
- Persona: katherine
- Anchor: mirror
- Setting: desk
- Feeling: clear
- Expected scenario: discernment_protocol or mirror_inquiry_safe

## Incorporate User Feedback
- Test variety by running same request twice and comparing outputs
- Verify citations only come from allowed_sources
- Check that variation_tokens are different between runs
- Verify tarot_constraints are enforced

## Endpoints to Test
- POST /api/ai/generate-personalized-spell

## Notes
- Use `?preview=crowlands` to access the app
- Test credentials: sub_test@test.com / test123
