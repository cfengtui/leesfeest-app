def calculate_dmt_score(words_read, errors, self_corrections, duration_seconds=180):
    effective_errors = max(errors - self_corrections, 0)
    correct_words = max(words_read - effective_errors, 0)

    wpm = round(correct_words / (duration_seconds / 60), 1)
    accuracy = round(correct_words / max(words_read, 1), 3)

    return {
        "correct_words": correct_words,
        "errors": effective_errors,
        "wpm": wpm,
        "accuracy": accuracy
    }
