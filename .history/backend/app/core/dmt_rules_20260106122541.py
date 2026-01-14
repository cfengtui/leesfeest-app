def is_important(word: str) -> bool:
    """Trivial rule: word is important if length > 3"""
    return len(word or "") > 3
