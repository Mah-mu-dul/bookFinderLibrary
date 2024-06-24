import json
import random
import string

# Helper function to generate random strings
def random_string(length):
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=length))

# Generate the data
books = []
for i in range(1, 501):
    book = {
        "id": i,
        "bookName": f"Book Title {i}",
        "author": f"Author {random_string(8)}",
        "shelfNo": [f"{random.randint(10000, 99999)}-{random.randint(10, 99)}", f"{random.randint(1000, 9999)}-{random.randint(100, 999)}"]
    }
    books.append(book)

# Write to a JSON file
file_path = './books.json'
with open(file_path, 'w') as f:
    json.dump(books, f, indent=4)

file_path