/**
 * News Renderer - Render tin tức từ API (Full version)
 */

const NewsRenderer = {
    getCurrentLang() {
        return localStorage.getItem('language') || 'ja';
    },

    getText(item, field) {
        const lang = this.getCurrentLang();
        return item[`${field}_${lang}`] || item[`${field}_ja`] || item[field] || '';
    },

    getDate(item) {
        const lang = this.getCurrentLang();
        // Ưu tiên date đã format sẵn trong DB
        if (item[`date_${lang}`]) return item[`date_${lang}`];
        if (item.date_ja) return item.date_ja;

        // Fallback: format từ published_at
        if (!item.published_at) return '';
        const date = new Date(item.published_at);

        if (lang === 'ja') {
            return `${date.getFullYear()}年${String(date.getMonth() + 1).padStart(2, '0')}月${String(date.getDate()).padStart(2, '0')}日`;
        } else if (lang === 'vi') {
            return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
        }
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    },

    renderHomeItem(news) {
        const title = this.getText(news, 'title');
        const date = this.getDate(news);
        return `
            <article class="news-item">
                <time datetime="${news.published_at}" class="news-date">${date}</time>
                <a href="/news/${news.id}" class="news-link">${title}</a>
            </article>
        `;
    },

    renderArticle(news) {
        const title = this.getText(news, 'title');
        const excerpt = this.getText(news, 'excerpt');
        const date = this.getDate(news);
        const readMore = { ja: '続きを読む', en: 'Read more', vi: 'Đọc thêm' }[this.getCurrentLang()];

        return `
            <article class="news-article">
                <div class="news-article-content">
                    <time class="news-date">${date}</time>
                    <h2 class="news-article-title">${title}</h2>
                    <p class="news-article-excerpt">${excerpt || ''}</p>
                    <a href="/news/${news.id}" class="news-read-more">
                        <span>${readMore}</span>
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"/>
                            <path d="M12 8l4 4-4 4M8 12h8"/>
                        </svg>
                    </a>
                </div>
                ${news.image ? `<div class="news-article-image"><img src="${news.image}" alt="${title}"></div>` : ''}
            </article>
        `;
    },

    async renderLatest(containerId, limit = 3) {
        const container = document.getElementById(containerId);
        if (!container) return;

        try {
            const result = await API.news.getLatest(limit);
            if (result.success && result.data.length > 0) {
                container.innerHTML = result.data.map(n => this.renderHomeItem(n)).join('');
            }
        } catch (error) {
            console.error('Error loading latest news:', error);
        }
    },

    async renderList(containerId, options = {}) {
        const container = document.getElementById(containerId);
        if (!container) return;

        try {
            container.innerHTML = '<div class="loading">Loading...</div>';
            const result = await API.news.getAll(options);

            if (result.success && result.data.length > 0) {
                container.innerHTML = result.data.map(n => this.renderArticle(n)).join('');
            } else {
                container.innerHTML = '<p class="no-data">No news found</p>';
            }
            return result;
        } catch (error) {
            container.innerHTML = '<p class="error">Error loading news</p>';
        }
    },

    async renderDetail(newsId) {
        try {
            const result = await API.news.getById(newsId);
            if (!result.success) return null;

            const news = result.data;

            // Update date
            const dateEl = document.getElementById('newsDate');
            if (dateEl) dateEl.textContent = this.getDate(news);

            // Update title
            const titleEl = document.getElementById('newsTitle');
            if (titleEl) titleEl.textContent = this.getText(news, 'title');

            // Update image
            const imgEl = document.getElementById('newsImage');
            if (imgEl && news.image) imgEl.src = news.image;

            // Update content
            const contentEl = document.getElementById('newsContent');
            if (contentEl) contentEl.innerHTML = this.getText(news, 'content');

            // Update navigation
            const prevLink = document.getElementById('prevNews');
            if (prevLink) {
                if (result.prev) {
                    prevLink.href = `/news/${result.prev.id}`;
                    prevLink.style.visibility = 'visible';
                } else {
                    prevLink.style.visibility = 'hidden';
                }
            }

            const nextLink = document.getElementById('nextNews');
            if (nextLink) {
                if (result.next) {
                    nextLink.href = `/news/${result.next.id}`;
                    nextLink.style.visibility = 'visible';
                } else {
                    nextLink.style.visibility = 'hidden';
                }
            }

            // Render related news
            const relatedContainer = document.getElementById('relatedNews');
            if (relatedContainer && result.related && result.related.length > 0) {
                relatedContainer.innerHTML = result.related.map(n => `
                    <a href="/news/${n.id}" class="related-news-card">
                        <div class="related-news-image" style="background-image: url('${n.image || './assets/images/company.png'}'); background-size: cover; background-position: center;"></div>
                        <div class="related-news-content">
                            <span class="related-news-date">${this.getDate(n)}</span>
                            <h3 class="related-news-title">${this.getText(n, 'title')}</h3>
                        </div>
                    </a>
                `).join('');
            }

            return news;
        } catch (error) {
            console.error('Error loading news detail:', error);
            return null;
        }
    }
};

if (typeof window !== 'undefined') {
    window.NewsRenderer = NewsRenderer;
}
