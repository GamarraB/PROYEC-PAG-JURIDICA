 let isLoggedIn = false;
let editingArticleId = null;

        // Handle file selection
        function handleFileSelect(inputId) {
            const input = document.getElementById(inputId);
            const fileName = document.getElementById(inputId + 'Name');
            
            if (input.files && input.files[0]) {
                fileName.textContent = '📎 ' + input.files[0].name;
                fileName.classList.add('show');
            }
        }

        // Login function
        function login() {
            const password = document.getElementById('password').value;
            if (password === 'Círculo_Inteligente#24') {
                isLoggedIn = true;
                console.log('Login successful, isLoggedIn set to true');
                document.getElementById('loginForm').style.display = 'none';
                document.getElementById('uploadForm').style.display = 'block';
                loadManagementArticles();
            } else {
                alert('❌ Contraseña incorrecta. Intenta nuevamente.');
            }
        }

        // Read file as Data URL
        function readFileAsDataURL(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
        }

        // Save article
        async function saveArticle(article) {
            try {
                const docRef = await addDoc(collection(window.db, 'articles'), article);
                console.log('Article saved with ID:', docRef.id);
            } catch (error) {
                console.error('Error saving article:', error);
                throw error;
            }
        }

        // Load articles for management
        async function loadManagementArticles() {
            const container = document.getElementById('articlesManagement');
            container.innerHTML = '';

            if (!window.db) {
                container.innerHTML = '<p>Firebase no está listo. Recarga la página.</p>';
                return;
            }

            try {
                const articlesQuery = query(collection(window.db, 'articles'), orderBy('timestamp', 'desc'));
                const querySnapshot = await getDocs(articlesQuery);
                const articles = [];
                querySnapshot.forEach((doc) => {
                    articles.push({ id: doc.id, ...doc.data() });
                });

                articles.forEach((article) => {
                    const articleDiv = document.createElement('div');
                    articleDiv.className = 'col-md-6 mb-4';
                    articleDiv.innerHTML = `
                        <div class="card">
                            <div class="card-body">
                                <h5 class="card-title">${article.title}</h5>
                                <p class="card-text">${article.content.substring(0, 100)}...</p>
                                <p class="card-text"><small class="text-muted">${article.date}</small></p>
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="featured-${article.id}" ${article.featured ? 'checked' : ''} onchange="toggleFeatured('${article.id}', this.checked)">
                                    <label class="form-check-label" for="featured-${article.id}">Destacado</label>
                                </div>
                                <button class="btn btn-warning btn-sm me-2" onclick="editArticle('${article.id}')">Editar</button>
                                <button class="btn btn-danger btn-sm" onclick="deleteArticle('${article.id}')">Eliminar</button>
                            </div>
                        </div>
                    `;
                    container.appendChild(articleDiv);
                });
            } catch (error) {
                console.error('Error loading management articles:', error);
            }
        }

        // Toggle featured
        async function toggleFeatured(id, featured) {
            try {
                const articleRef = doc(window.db, 'articles', id);
                await updateDoc(articleRef, { featured });
                console.log('Featured updated');
                loadManagementArticles();
            } catch (error) {
                console.error('Error updating featured:', error);
            }
        }

        // Edit article
        async function editArticle(id) {
            try {
                const docSnap = await getDoc(doc(window.db, 'articles', id));
                if (docSnap.exists()) {
                    const article = docSnap.data();
                    document.getElementById('title').value = article.title;
                    document.getElementById('content').value = article.content;
                    // No se puede prellenar files, pero usuario puede seleccionar nuevos
                    editingArticleId = id;
                    document.getElementById('submitBtn').textContent = '🔄 Actualizar Artículo';
                    document.getElementById('cancelBtn').style.display = 'inline-block';
                    document.getElementById('editMode').style.display = 'block';
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            } catch (error) {
                console.error('Error loading article for edit:', error);
            }
        }

        // Cancel edit
        function cancelEdit() {
            editingArticleId = null;
            document.getElementById('articleForm').reset();
            document.getElementById('submitBtn').textContent = '📤 Publicar Artículo';
            document.getElementById('cancelBtn').style.display = 'none';
            document.getElementById('editMode').style.display = 'none';
            document.getElementById('imageName').classList.remove('show');
            document.getElementById('pdfName').classList.remove('show');
        }

        // Delete article
        async function deleteArticle(id) {
            if (confirm('¿Estás seguro de eliminar este artículo?')) {
                try {
                    await deleteDoc(doc(window.db, 'articles', id));
                    console.log('Article deleted');
                    loadManagementArticles();
                } catch (error) {
                    console.error('Error deleting article:', error);
                }
            }
        }

        // Wait for Firebase to be ready
        function waitForFirebase() {
            return new Promise((resolve) => {
                if (window.firebaseReady && window.db) {
                    resolve();
                } else {
                    const checkFirebase = setInterval(() => {
                        if (window.firebaseReady && window.db) {
                            clearInterval(checkFirebase);
                            resolve();
                        }
                    }, 100);
                }
            });
        }

        // Form submission
        document.addEventListener('DOMContentLoaded', function() {
            // Initialize when Firebase is ready
            waitForFirebase().then(() => {
                console.log('Upload page ready with Firebase');

                const articleForm = document.getElementById('articleForm');

                articleForm.addEventListener('submit', async function(e) {
                    e.preventDefault();
                    console.log('Form submitted, isLoggedIn:', isLoggedIn);

                    if (!isLoggedIn) {
                        alert('❌ Debes iniciar sesión como administrador.');
                        return;
                    }

            // Show loading state
            const submitBtn = document.getElementById('submitBtn');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = editingArticleId ? '⏳ Actualizando...' : '⏳ Publicando...';
            submitBtn.disabled = true;

            try {
            const title = document.getElementById('title').value;
            const content = document.getElementById('content').value;
            const date = new Date().toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
            });
            const timestamp = new Date();

            const imageFile = document.getElementById('image').files[0];
            const pdfFile = document.getElementById('pdf').files[0];

            let imageData = null;
            let pdfData = null;

            if (imageFile) {
            imageData = await readFileAsDataURL(imageFile);
            }

            if (pdfFile) {
            pdfData = await readFileAsDataURL(pdfFile);
            }

            if (editingArticleId) {
            // Update existing
            const updateData = { title, content };
            if (imageData) updateData.image = imageData;
            if (pdfData) updateData.pdf = pdfData;
            const articleRef = doc(window.db, 'articles', editingArticleId);
            await updateDoc(articleRef, updateData);
            alert('✅ Artículo actualizado');
                editingArticleId = null;
                        document.getElementById('editMode').style.display = 'none';
            } else {
                // Create new
                        const article = {
                    title,
                    content,
                    date,
                    timestamp,
                    image: imageData,
                    pdf: pdfData,
                    featured: false
                };
                        await saveArticle(article);
                console.log('Article saved:', article);

                        // Show success message
                const successMessage = document.getElementById('successMessage');
                successMessage.classList.add('show');
            setTimeout(() => {
                    successMessage.classList.remove('show');
                        }, 5000);
            }

                    // Reset form
                articleForm.reset();
            document.getElementById('imageName').classList.remove('show');
            document.getElementById('pdfName').classList.remove('show');
                submitBtn.textContent = '📤 Publicar Artículo';
                document.getElementById('cancelBtn').style.display = 'none';

            // Scroll to top
                window.scrollTo({ top: 0, behavior: 'smooth' });

                        // Reload management articles
                        loadManagementArticles();

                    } catch (error) {
                        alert('❌ Error. Por favor intenta nuevamente.');
                        console.error(error);
                    } finally {
                        submitBtn.textContent = originalText;
                        submitBtn.disabled = false;
                    }
                });
            });
        });