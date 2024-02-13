document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('blog-form');
    const blogsContainer = document.getElementById('blogs');


    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const title = form.title.value;
        const body = form.body.value;
        const author = form.author.value;

        try {
            const res = await fetch('/api/blogs', { // Corrected endpoint path
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title, body, author })
            });
            const data = await res.json();
            console.log('Blog post created:', data);

            // Clear form fields
            form.reset();

            // Reload blogs
            loadBlogs();
        } catch (err) {
            console.error('Error creating blog post:', err);
        }
    });


    async function loadBlogs() {
        try {
            const res = await fetch('/api/blogs');
            const data = await res.json();
            console.log('Blogs:', data);

            blogsContainer.innerHTML = '';
            data.forEach(blog => {
                const blogDiv = document.createElement('div');
                blogDiv.innerHTML = `
    <h3>${blog.title}</h3>
    <p>${blog.body}</p>
    <p>Author: ${blog.author}</p>
    <button onclick="editBlog('${blog._id}')">Edit <i class="fa-regular fa-pen-to-square"></i></button>
    <button onclick="deleteBlog('${blog._id}')">Delete <i class="fa-solid fa-trash"></i></button>
    <div id="form-${blog._id}" style="display: none;">
        <form onsubmit="saveBlog(event, '${blog._id}')">
            <label for="edit-title">Title:</label>
            <input type="text" id="edit-title-${blog._id}" value="${blog.title}" required><br>
            <label for="edit-body">Body:</label><br>
            <textarea id="edit-body-${blog._id}" rows="4" required>${blog.body}</textarea><br>
            <label for="edit-author">Author:</label>
            <input type="text" id="edit-author-${blog._id}" value="${blog.author}" required><br>
            <button type="submit">Save <i class="fa-solid fa-check"></i></button>
            <button type="button" onclick="cancelEdit('${blog._id}')">Cancel</button>
        </form>
    </div>
    <hr>
`;
                blogsContainer.appendChild(blogDiv);
            });
        } catch (err) {
            console.error('Error loading blogs:', err);
        }
    }

    async function populateForm(id, title, body, author) {
        // Hide all other forms
        document.querySelectorAll('[id^="form-"]').forEach(form => {
            form.style.display = 'none';
        });

        // Display the form corresponding to the selected blog
        const form = document.getElementById(`form-${id}`);
        form.style.display = 'block';
    }



    loadBlogs();
});

async function saveBlog(event, id) {
    event.preventDefault();

    const updatedTitle = document.getElementById(`edit-title-${id}`).value;
    const updatedBody = document.getElementById(`edit-body-${id}`).value;
    const updatedAuthor = document.getElementById(`edit-author-${id}`).value;

    try {
        const res = await fetch(`/api/blogs/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title: updatedTitle, body: updatedBody, author: updatedAuthor })
        });

        if (res.ok) {
            console.log('Blog updated successfully');
            loadBlogs(); // Reload blogs after successful update
        } else {
            console.error('Failed to update blog');
        }
    } catch (err) {
        console.error('Error updating blog:', err);
    }
}

function cancelEdit(id) {
    const form = document.getElementById(`form-${id}`);
    form.style.display = 'none';
}

function editBlog(id) {
    const form = document.getElementById(`form-${id}`);
    form.style.display = 'block';
}
async function deleteBlog(id) {
    try {
        const res = await fetch(`/api/blogs/${id}`, {
            method: 'DELETE'
        });
        const data = await res.json();
        console.log('Blog deleted:', data);

        // Reload blogs
        loadBlogs();
    } catch (err) {
        console.error('Error deleting blog:', err);
    }
}


/*
async function editBlog(id) {
    try {
        // Fetch the details of the selected blog
        const res = await fetch(`/api/blogs/${id}`);
        const blog = await res.json();

        // Populate the form fields with the blog details for editing
        document.getElementById('title').value = blog.title;
        document.getElementById('body').value = blog.body;
        document.getElementById('author').value = blog.author;

        // Create a new "Save" button dynamically
        const saveButton = document.createElement('button');
        saveButton.textContent = 'Save';
        saveButton.onclick = async () => {
            const updatedTitle = document.getElementById('title').value;
            const updatedBody = document.getElementById('body').value;
            const updatedAuthor = document.getElementById('author').value;

            try {
                const res = await fetch(`/api/blogs/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ title: updatedTitle, body: updatedBody, author: updatedAuthor })
                });

                if (res.ok) {
                    console.log('Blog updated successfully');
                    loadBlogs(); // Reload blogs after successful update
                } else {
                    console.error('Failed to update blog');
                }
            } catch (err) {
                console.error('Error updating blog:', err);
            }
        };

        // Replace the "Edit" button with the "Save" button
        const editButton = document.getElementById(`edit-${id}`);
        editButton.replaceWith(saveButton);
    } catch (err) {
        console.error('Error fetching blog details:', err);
    }
} */





