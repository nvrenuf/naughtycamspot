import os
import markdown
from datetime import datetime

BLOG_DIR = 'blog'
OUTPUT_DIR = 'blog_html'
TEMPLATE_FILE = 'blog_template.html'

# Ensure output directory exists
os.makedirs(OUTPUT_DIR, exist_ok=True)

def get_post_metadata(md_content):
    lines = md_content.split('\n')
    title, date = "Untitled", ""
    if lines[0].strip() == '---':
        for i, line in enumerate(lines[1:], 1):
            if line.strip() == '---':
                break
            if line.startswith('title:'):
                title = line.split(':', 1)[1].strip().strip('"')
            if line.startswith('date:'):
                date = line.split(':', 1)[1].strip().strip('"')
    return title, date

def convert_posts():
    posts = []
    for filename in os.listdir(BLOG_DIR):
        if filename.endswith('.md'):
            with open(os.path.join(BLOG_DIR, filename), 'r') as f:
                md_content = f.read()
            title, date = get_post_metadata(md_content)
            html_content = markdown.markdown(md_content.split('---',2)[-1])
            with open(TEMPLATE_FILE, 'r') as tf:
                template = tf.read()
            post_html = template.replace('{{content}}', html_content).replace('{{title}}', title)
            output_filename = filename.replace('.md', '.html')
            with open(os.path.join(OUTPUT_DIR, output_filename), 'w') as outf:
                outf.write(post_html)
            posts.append({'title': title, 'date': date, 'filename': output_filename})
    # Sort posts by date descending
    posts.sort(key=lambda x: x['date'], reverse=True)
    # Generate index
    with open('blog_index.html', 'w') as idx:
        idx.write('<h1>Blog</h1>\n<ul>')
        for post in posts:
            idx.write(f'<li><a href="{OUTPUT_DIR}/{post["filename"]}">{post["title"]} ({post["date"]})</a></li>')
        idx.write('</ul>')

if __name__ == '__main__':
    convert_posts()
