import json
import random
import re

# Simple Dutch vowel patterns (simplified for categorization)
VOWELS = "aeiouyäëïöüáéíóú"
DIPHTHONGS = ["au", "ee", "ei", "eu", "ie", "ij", "oe", "ou", "ui", "uu", "oo", "aa"]

def count_syllables(word):
    word = word.lower()
    # Count vowel groups as one syllable-ish approximation
    count = 0
    i = 0
    while i < len(word):
        if word[i] in VOWELS:
            count += 1
            while i < len(word) and word[i] in VOWELS:
                i += 1
        else:
            i += 1
    return count

def has_complex_cluster(word):
    # Common Dutch complex clusters
    clusters = ["scht", "cht", "nk", "ng", "st", "str", "spr", "sch", "kr", "tr", "pr", "gr"]
    for c in clusters:
        if c in word.lower():
            return True
    return False

# Top words from frequency list (manually added some for quality)
word_pool = [
    "ik", "je", "het", "de", "dat", "is", "een", "niet", "en", "van", "wat", "we", "in", "ze", "hij", "te", "zijn", "op", "maar", "er", "met", "voor", "die", "heb", "me", "als", "was", "ben", "om", "dit", "mijn", "aan", "u", "dan", "naar", "weet", "hier", "zo", "jij", "kan", "geen", "nog", "ja", "hem", "heeft", "wel", "moet", "wil", "hebben", "goed", "haar", "nee", "hoe", "nu", "waar", "over", "ook", "doen", "uit", "zou", "ga", "of", "gaan", "bent", "mij", "bij", "al", "ons", "had", "iets", "daar", "jullie", "gaat", "zal", "hebt", "kom", "waarom", "meer", "deze", "moeten", "laat", "kunnen", "dus", "jou", "denk", "wie", "alles", "echt", "doe", "door", "alleen", "toch", "zien", "weg", "eens", "man", "misschien", "laten", "nooit", "nou", "zei", "terug", "oke", "mee", "niets", "iemand", "komt", "toen", "veel", "even", "onze", "gewoon", "weten", "komen", "nodig", "mensen", "tot", "worden", "zeggen", "tijd", "weer", "leven", "twee", "net", "tegen", "maken", "uw", "zeg", "omdat", "zit", "wordt", "hou", "kijk", "heel", "wij", "altijd", "mag", "gedaan", "dood", "zeker", "af", "jaar", "hun", "wilde", "dag", "huis", "dacht", "doet", "vader", "kunt", "wacht", "zie", "vrouw", "keer", "andere", "zoals", "zij", "dank", "anders", "geef", "waren", "willen", "zich", "bedankt", "erg", "wilt", "praten", "spijt", "geld", "kon", "werk", "oh", "iedereen", "beter", "werd", "moeder", "niemand", "vinden", "staat", "gezien", "niks", "binnen", "zitten", "zullen", "na", "helpen", "wist", "vind", "genoeg", "sorry", "vast", "elkaar", "ging", "uur", "klaar", "hele", "neem", "leuk", "natuurlijk", "alle", "god", "maak", "lang", "kwam", "graag", "he", "toe", "drie", "zegt", "bedoel", "deed", "dingen", "maakt", "alsjeblieft", "eerste", "krijgen", "zonder", "steeds", "hallo", "houden", "vertellen", "ziet", "idee"
]

# Adding more Level 1 specific words based on research
level1_pool = ["oog", "zee", "lui", "vak", "was", "kip", "pop", "beer", "bos", "kam", "mat", "nek", "pen", "rok", "sap", "tas", "vis", "weg", "zak", "bel", "dol", "fel", "gal", "hol", "kil", "lol", "mol", "nul", "pal", "ral", "uul", "vel", "wil", "zal"]
level2_pool = ["stoel", "sneeuw", "vlaai", "storm", "jurk", "grond", "korst", "vrucht", "brand", "dwerg", "gracht", "kracht", "plant", "slang", "trein", "vlag", "zwart", "blauw", "groen", "rood", "geel"]
level3_pool = ["bankstel", "familie", "wandelingen", "banden", "aarzelen", "dromen", "keukentafel", "computer", "olifant", "vliegtuig", "telefoon", "middag", "avond", "morgen", "vandaag", "gisteren"]

# Extend pools from long frequency data
for w in word_pool:
    syl = count_syllables(w)
    if syl == 1:
        if has_complex_cluster(w) or len(w) > 4:
            level2_pool.append(w)
        else:
            level1_pool.append(w)
    else:
        level3_pool.append(w)

def generate_sheets():
    tests = []
    for test_id in range(1, 201):
        sheet1 = random.sample(level1_pool, min(120, len(level1_pool)))
        sheet2 = random.sample(level2_pool, min(120, len(level2_pool)))
        sheet3 = random.sample(level3_pool, min(120, len(level3_pool)))
        
        # Shuffle sheets to ensure variety even if pools are small
        random.shuffle(sheet1)
        random.shuffle(sheet2)
        random.shuffle(sheet3)
        
        tests.append({
            "test_id": test_id,
            "sheets": {
                "1": sheet1,
                "2": sheet2,
                "3": sheet3
            }
        })
    return tests

if __name__ == "__main__":
    dmt_data = generate_sheets()
    with open("c:/repo/dmt-app/backend/dmt_tests.json", "w", encoding="utf-8") as f:
        json.dump(dmt_data, f, indent=2, ensure_ascii=False)
    print(f"Generated 200 tests in c:/repo/dmt-app/backend/dmt_tests.json")
