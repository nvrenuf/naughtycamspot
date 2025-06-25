# naughtycamspot
Naughty Cam Spot Website

## Project Structure
## This should be real

- `blog/` — Markdown source files for blog posts
- `blog_html/` — Generated HTML files for blog posts
- `docs/` — Documentation and reference HTML/Markdown files
- `images/` — Site images and assets
- `models/` — Individual model pages (generated)
- `scripts/` — Utility scripts (e.g., model page generator)
- `styles.css` — Main site stylesheet

## Blog System

This project includes a simple Markdown-based blog system.

### How to Add a Blog Post
1. **Create a Markdown file** in the `blog/` folder. Use the following format at the top:
   ```markdown
   ---
   title: "Your Post Title"
   date: YYYY-MM-DD
   ---

   Your post content goes here. You can use Markdown formatting.
   ```
2. **Run the blog generator script** to convert Markdown posts to HTML and update the blog index:
   ```sh
   .venv/bin/python generate_blog.py
   ```
   This will create HTML files in the `blog_html/` folder and update `blog_index.html`.

3. **View your blog** by opening `blog_index.html` or any generated post in your browser.

### Automating Blog Posts
You can automate the creation of Markdown files in the `blog/` folder using AI or scripts. Just follow the format above.

### Customizing the Blog
- Edit `blog_template.html` to change the blog post layout or style.
- Edit `styles.css` for site-wide styles.

## Model Page Generation

To create a new model page:
1. Run the script:
   ```sh
   python scripts/create_model_page.py
   ```
2. Enter the model's room name when prompted. The script will generate a new HTML page in the `models/` folder with the correct site look and navigation.

You can automate or extend this script as your workflow grows.
