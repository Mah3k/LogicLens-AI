from fastapi import FastAPI, HTTPException
from models import AnalyzeRequest, AnalyzeResponse, BugDto
from gemini_service import analyze_code

app = FastAPI(
    title="LogicLens AI Service",
    version="1.0.0"
)


@app.get("/")
def home():
    return {
        "message": "LogicLens AI Service is running."
    }


@app.post("/api/ai/analyze", response_model=AnalyzeResponse)
def analyze(request: AnalyzeRequest):

    try:

        result = analyze_code(
            request.code,
            request.language,
            request.options
        )

        bugs = []

        for bug in result.get("bugs", []):
            bugs.append(
                BugDto(
                    severity=bug.get("severity", "Low"),
                    title=bug.get("title", ""),
                    detail=bug.get("detail", "")
                )
            )

        return AnalyzeResponse(
            score=result.get("score", 80),
            performance=result.get("performance", "B"),
            security=result.get("security", "Good"),
            explanation=result.get("explanation", []),
            bugs=bugs,
            optimizedCode=result.get("optimizedCode", ""),
            tests=result.get("tests", "")
        )

    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )