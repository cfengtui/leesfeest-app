from app.core.dmt_rules import calculate_dmt_score

def score_session(session):
    words_read = len(session.words_read)
    errors = session.errors
    self_corrections = session.self_corrections
    duration = session.duration_seconds

    return calculate_dmt_score(words_read, errors, self_corrections, duration)
