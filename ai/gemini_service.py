import os
import json
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")

if not API_KEY:
    raise Exception("GEMINI_API_KEY not found in .env")

genai.configure(api_key=API_KEY)

model = genai.GenerativeModel("gemini-2.5-flash")


PROMPT = """
You are a senior software engineer and code reviewer.

Analyze the submitted code.

Return ONLY valid JSON.

The JSON must exactly follow this schema:

{
  "score": 90,
  "performance": "A",
  "security": "Good",
  "explanation": [
      "...",
      "...",
      "..."
  ],
  "bugs": [
      {
          "severity":"High",
          "title":"...",
          "detail":"..."
      }
  ],
  "optimizedCode":"...",
  "tests":"..."
}

Rules:

- score must be integer between 0 and 100.
- performance must be A,B,C,D or F.
- security must be Good, Moderate or Poor.
- explanation should contain 5-10 detailed points.
- bugs should contain every bug you find.
- optimizedCode must be complete runnable improved code.
- tests should contain unit tests.
- Return JSON ONLY.
"""


def analyze_code(code, language, options):

    user_prompt = f"""
Language:
{language}

Options:
{options}

Code:

{code}
"""

    response = model.generate_content(
        PROMPT + "\n\n" + user_prompt
    )

    text = response.text.strip()

    if text.startswith("```json"):
        text = text.replace("```json", "")

    if text.startswith("```"):
        text = text.replace("```", "")

    if text.endswith("```"):
        text = text[:-3]

    text = text.strip()

    return json.loads(text)