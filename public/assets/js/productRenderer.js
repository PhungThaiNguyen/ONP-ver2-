/**
 * Product Renderer - Render sản phẩm từ API (Full version)
 */

const ProductRenderer = {
    getCurrentLang() {
        return localStorage.getItem('language') || 'ja';
    },

    getText(item, field) {
        const lang = this.getCurrentLang();
        return item[`${field}_${lang}`] || item[`${field}_ja`] || item[field] || '';
    },

    getMaterialBadge(material) {
        const labels = {
            brass: { ja: '真鍮', en: 'Brass', vi: 'Đồng thau' },
            stainless: { ja: 'ステンレス', en: 'Stainless', vi: 'Inox' },
            aluminum: { ja: 'アルミ', en: 'Aluminum', vi: 'Nhôm' },
            steel: { ja: '鋼鉄', en: 'Steel', vi: 'Thép' },
            plastic: { ja: 'プラスチック', en: 'Plastic', vi: 'Nhựa' }
        };
        const lang = this.getCurrentLang();
        return labels[material]?.[lang] || material;
    },

    renderCard(product) {
        const name = this.getText(product, 'name');
        const badge = this.getMaterialBadge(product.material);

        return `
            <article class="product-card" data-material="${product.material}">
                <a href="/product/${product.id}" class="product-link">
                    <div class="product-image">
                        <span class="product-badge ${product.material}">${badge}</span>
                        <img src="${product.image}" alt="${name}" loading="lazy">
                    </div>
                    <div class="product-info">
                        <h3 class="product-name">${name}</h3>
                    </div>
                </a>
            </article>
        `;
    },

    // Render cho trang products.html với cấu trúc cụ thể
    renderCardForProductsPage(product) {
        const name = this.getText(product, 'name');
        const badge = this.getMaterialBadge(product.material);

        return `
            <a href="./product-detail.html?id=${product.id}" class="product-card" data-material="${product.material}">
                <div class="product-image">
                   <span class="product-badge ${product.material}">${badge}</span>
                    <img src="${product.image}" alt="${name}">
                </div>
                <div class="product-info">
                    <p class="product-name">${name}</p>
                </div>
            </a>
        `;
    },

    async renderList(containerId, options = {}) {
        const container = document.getElementById(containerId);
        if (!container) return;

        try {
            container.innerHTML = '<div class="loading">Loading...</div>';
            const result = await API.products.getAll(options);

            if (result.success && result.data.length > 0) {
                container.innerHTML = result.data.map(p => this.renderCard(p)).join('');
            } else {
                container.innerHTML = '<p class="no-data">No products found</p>';
            }
            return result;
        } catch (error) {
            container.innerHTML = '<p class="error">Error loading products</p>';
        }
    },

    async renderFeatured(containerId, limit = 6) {
        const container = document.getElementById(containerId);
        if (!container) return;

        try {
            const result = await API.products.getFeatured(limit);
            if (result.success && result.data.length > 0) {
                container.innerHTML = result.data.map(p => this.renderCard(p)).join('');
            }
        } catch (error) {
            console.error('Error loading featured products:', error);
        }
    },

    async renderDetail(productId) {
        try {
            const result = await API.products.getById(productId);
            if (!result.success) return null;

            const p = result.data;
            const lang = this.getCurrentLang();

            // Update title
            const titleEl = document.getElementById('productTitle');
            if (titleEl) titleEl.textContent = this.getText(p, 'name');

            // Update breadcrumb
            const breadcrumbEl = document.getElementById('breadcrumbProductName');
            if (breadcrumbEl) breadcrumbEl.textContent = this.getText(p, 'name');

            // Update image
            const imgEl = document.getElementById('mainProductImage');
            if (imgEl) imgEl.src = p.image;

            // Update specs
            const specMaterial = document.getElementById('specMaterial');
            if (specMaterial) specMaterial.textContent = this.getText(p, 'material') || p.material_ja || '-';

            const specSize = document.getElementById('specSize');
            if (specSize) specSize.textContent = p.size || '-';

            const specTolerance = document.getElementById('specTolerance');
            if (specTolerance) specTolerance.textContent = p.tolerance || '-';

            const specSurface = document.getElementById('specSurface');
            if (specSurface) specSurface.textContent = this.getText(p, 'surface') || '-';

            const specProcess = document.getElementById('specProcess');
            if (specProcess) specProcess.textContent = this.getText(p, 'process') || '-';

            // Update badge
            const badge = document.getElementById('productBadge');
            if (badge) {
                badge.className = `product-badge-large ${p.material}`;
                badge.textContent = this.getMaterialBadge(p.material);
            }

            // Render related products
            if (result.related && result.related.length > 0) {
                const relatedContainer = document.querySelector('.related-grid');
                if (relatedContainer) {
                    relatedContainer.innerHTML = result.related.map(r => `
                        <a href="/product/${r.id}" class="related-card">
                            <img src="${r.image}" alt="${this.getText(r, 'name')}">
                            <div class="related-card-info">
                                <span class="related-card-name">${this.getText(r, 'name')}</span>
                            </div>
                        </a>
                    `).join('');
                }
            }

            return p;
        } catch (error) {
            console.error('Error loading product detail:', error);
            return null;
        }
    }
};

if (typeof window !== 'undefined') {
    window.ProductRenderer = ProductRenderer;
}
