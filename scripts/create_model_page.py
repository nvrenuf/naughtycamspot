import os

MODEL_DIR = 'models'
TEMPLATE = '''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="NaughtyCamSpot - Model's Exclusive Page">
    <title>{room_name} - Model's Page</title>
    <link rel="stylesheet" href="../styles.css">
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">
</head>
<body>
    <!-- Header Section -->
    <header>
        <div class="logo">
            <img src="../images/logo.webp" alt="NaughtyCamSpot Logo" width="150">
            <h1>NaughtyCamSpot</h1>
            <p class="tagline">You Create, We Elevate</p>
        </div>
        <nav>
            <ul>
                <li><a href="../about.html">About Us</a></li>
                <li><a href="../models.html">For Models</a></li>
                <li><a href="../contact.html">Contact Us</a></li>
                <li><a href="../blog_index.html">Blog</a></li>
            </ul>
        </nav>
    </header>
    <main>
        <section id="hero">
            <div class="hero-content">
                <h2>Welcome to {room_name}'s Page</h2>
                <p>Exclusive content and promotions coming soon!</p>
                <a href="../models.html" class="cta-button">Back to Models</a>
            </div>
        </section>
        <!-- Add more content here -->
    </main>
    <footer>
        <p>&copy; 2025 NaughtyCamSpot</p>
    </footer>
</body>
</html>
'''

def create_model_page(room_name):
    filename = f"{room_name}.html"
    filepath = os.path.join(MODEL_DIR, filename)
    with open(filepath, 'w') as f:
        f.write(TEMPLATE.format(room_name=room_name))
    print(f"Created {filepath}")

if __name__ == "__main__":
    room_name = input("Enter the model's room name (no spaces, use underscores if needed): ")
    create_model_page(room_name)
