import sys
from typing import List

if sys.version_info >= (3, 8):
    from typing import TypedDict
else:
    from typing_extensions import TypedDict
import csv

class User(TypedDict):
    name: str
    email: str
    major: str
    degree: str
    date: str
    did: str
    public_key: str

    
csv_path = "../blockchain-certificates/example/graduates.csv"

def get_data() -> List[User]:
    with open(csv_path, "r") as f:
        reader = csv.DictReader(f)
        return list(reader)

def add_or_update(user: User):
    data = [d for d in get_data() if d["did"] != user["did"]]
    data.append(user)
    with open(csv_path, "w+") as f:
        writer = csv.DictWriter(f, User.__annotations__.keys())
        writer.writeheader()
        writer.writerows(data)
