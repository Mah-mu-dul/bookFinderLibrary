import json
import random

# Load the real_books.json file
with open("real_books.json", "r") as f:
    real_books = json.load(f)

# Create a new list to store the transformed data
books = []

# Iterate over each book in the real_books list
for i, book in enumerate(real_books, start=1):
    # Extract the title from the book
    title = book.get("title", "")

    # Extract the authors from the book
    authors = book.get("author", "")

    # If authors is a string, convert it to a list
    if isinstance(authors, str):
        authors = [authors]

    # Generate a random shelf number
    shelf_no = f"{random.randint(10000, 99999)}-{random.randint(100, 999)}"

    # Create a new book object with the desired structure
    new_book = {
        "_id": i,
        "bookName": title,
        "author": authors,  # Use the authors list
        "shelfNo": [shelf_no],  # Use the generated shelf number
    }

    # Add the new book object to the books list
    books.append(new_book)

# Write the transformed data to a new JSON file called books.json
with open("books.json", "w") as f:
    json.dump(books, f, indent=4)
