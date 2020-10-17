from typing import List, TypedDict
import csv

class User(TypedDict):
    studentno: str
    name: str
    email: str
    major: str
    degree: str
    did: str
    publickey: str

    
csv_path = "test.csv"

def get_data() -> List[User]:
    with open(csv_path, "r") as f:
        reader = csv.DictReader(f)
        return list(reader)

def add_or_update(user: User):
    data = [d for d in get_data() if d["studentno"] != user["studentno"]]
    data.append(user)
    with open(csv_path, "w+") as f:
        writer = csv.DictWriter(f, User.__annotations__.keys())
        writer.writeheader()
        writer.writerows(data)
