# naughtycamspot
Naughty Cam Spot Website

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
