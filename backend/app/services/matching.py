"""
Compatibility scoring algorithm - weighted multi-factor matching.

Designed to be tunable and interpretable for demo/judge feedback.
"""
from __future__ import annotations

import re
from dataclasses import dataclass
from typing import Any


def _normalize_tags(s: str) -> set[str]:
    """Normalize and tokenize comma/space-separated tags into lowercase set."""
    if not s or not isinstance(s, str):
        return set()
    tokens = re.split(r"[\s,;|]+", s.lower())
    return {t.strip() for t in tokens if len(t.strip()) > 1}


def _jaccard(a: set[str], b: set[str]) -> float:
    """Jaccard similarity 0..1. Returns 1 if both empty (neutral)."""
    if not a and not b:
        return 1.0
    if not a or not b:
        return 0.0
    return len(a & b) / len(a | b)


def _overlap_score(a: set[str], b: set[str]) -> float:
    """Overlap: how much of the smaller set is covered. 0..1."""
    if not a or not b:
        return 0.0
    return len(a & b) / min(len(a), len(b)) if min(len(a), len(b)) > 0 else 0.0


# Semantic clusters: related terms get partial credit
SKILL_CLUSTERS = {
    "python": {"python", "py"},
    "machine_learning": {"machine learning", "ml", "deep learning", "neural", "ai", "artificial intelligence"},
    "data_science": {"data science", "statistics", "pandas", "numpy"},
    "nlp": {"nlp", "natural language", "nlp", "text"},
    "computer_vision": {"computer vision", "cv", "image"},
    "hci": {"hci", "human computer", "ux", "usability"},
    "systems": {"systems", "distributed", "networks", "os"},
}


def _expand_cluster(tags: set[str]) -> set[str]:
    """Add cluster members for fuzzy matching."""
    out = set(tags)
    for cluster in SKILL_CLUSTERS.values():
        if tags & cluster:
            out |= cluster
    return out


@dataclass
class MatchBreakdown:
    skill_match: float
    research_match: float
    schedule_penalty: float  # 0 = no penalty, 1 = full penalty
    experience_match: float
    course_bonus: float  # 0..0.2 extra
    total: float
    details: dict[str, Any]


def compute_compatibility(
    professor_skills: str,
    professor_research: str,
    professor_experience: str,
    professor_hours: int,
    student_skills: str,
    student_research: str,
    student_experience: str,
    student_hours: int,
    student_major: str = "",
    professor_majors: str = "",
    professor_course_titles: list[str] | None = None,
    student_took_any: bool = False,
    schedule_conflict: bool = False,
    *,
    w_skill: float = 0.30,
    w_research: float = 0.30,
    w_schedule: float = 0.20,
    w_experience: float = 0.15,
    w_course: float = 0.05,
) -> MatchBreakdown:
    """
    Compute compatibility score 0..100.

    Uses weighted factors with fuzzy skill/research matching.
    """
    # Normalize
    p_skills = _normalize_tags(professor_skills)
    p_research = _normalize_tags(professor_research)
    s_skills = _normalize_tags(student_skills)
    s_research = _normalize_tags(student_research)
    p_majors = _normalize_tags(professor_majors)
    s_major_set = _normalize_tags(student_major)

    # Skills: Jaccard on expanded clusters (Python <-> py)
    p_skills_exp = _expand_cluster(p_skills)
    s_skills_exp = _expand_cluster(s_skills)
    skill_match = _jaccard(p_skills_exp, s_skills_exp)

    # Research: overlap - student preferences vs professor research
    research_match = _overlap_score(s_research, p_research)
    if not p_research and s_research:
        research_match = 0.5  # professor didn't specify, neutral
    elif p_research and not s_research:
        research_match = 0.7  # student open, slight penalty

    # Schedule: penalty if conflict
    schedule_penalty = 1.0 if schedule_conflict else 0.0

    # Experience level alignment
    exp_map = {"none": 0, "undergrad": 1, "some": 1, "masters": 2, "experienced": 2, "phd": 3, "any": -1}
    p_exp = exp_map.get(professor_experience.lower(), -1)
    s_exp = exp_map.get(student_experience.lower(), 0)
    if p_exp == -1:
        experience_match = 1.0  # professor accepts any
    elif s_exp >= p_exp:
        experience_match = 1.0
    elif p_exp - s_exp == 1:
        experience_match = 0.6  # close
    else:
        experience_match = 0.2  # too junior

    # Hours: student must have >= professor need
    hours_ok = student_hours >= professor_hours if professor_hours else True
    if not hours_ok:
        experience_match *= 0.7  # reduce if hours mismatch

    # Course overlap bonus: student took professor's course
    course_bonus = 0.15 if student_took_any else 0.0

    # Major fit
    if p_majors and s_major_set:
        if s_major_set & p_majors:
            course_bonus += 0.05
    elif not p_majors:
        course_bonus += 0.02  # professor didn't restrict

    # Total (0..1 scale, then * 100 for percentage)
    total_raw = (
        w_skill * skill_match
        + w_research * research_match
        + w_schedule * (1.0 - schedule_penalty)
        + w_experience * experience_match
        + min(0.2, course_bonus)
    )
    total = min(1.0, total_raw) * 100

    return MatchBreakdown(
        skill_match=round(skill_match * 100, 1),
        research_match=round(research_match * 100, 1),
        schedule_penalty=round(schedule_penalty * 100, 1),
        experience_match=round(experience_match * 100, 1),
        course_bonus=round(course_bonus * 100, 1),
        total=round(total, 1),
        details={
            "skills_matched": list(p_skills & s_skills),
            "research_matched": list(p_research & s_research),
        },
    )
