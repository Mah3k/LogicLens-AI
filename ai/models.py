from pydantic import BaseModel
from typing import List


class AnalyzeRequest(BaseModel):
    code: str
    language: str
    options: List[str]


class BugDto(BaseModel):
    severity: str
    title: str
    detail: str


class AnalyzeResponse(BaseModel):
    score: int
    performance: str
    security: str
    explanation: List[str]
    bugs: List[BugDto]
    optimizedCode: str
    tests: str