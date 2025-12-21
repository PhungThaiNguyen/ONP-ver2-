/**
 * Products Page Pagination Logic
 */

let allProducts = [];
let filteredProducts = [];
let currentPage = 1;
const productsPerPage = 8;

// Render products for current page
function renderProducts() {
    const productsGrid = document.getElementById('productsGrid');
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const productsToShow = filteredProducts.slice(startIndex, endIndex);

    console.log('🔍 Rendering:', {
        currentPage,
        totalFiltered: filteredProducts.length,
        startIndex,
        endIndex,
        showingCount: productsToShow.length,
        materials: productsToShow.map(p => p.material)
    });

    if (productsToShow.length > 0) {
        const productsHTML = productsToShow.map(product =>
            ProductRenderer.renderCardForProductsPage(product)
        ).join('');

        productsGrid.innerHTML = productsHTML;
    } else {
        productsGrid.innerHTML = '<p style="text-align:center;grid-column:1/-1;">No products found</p>';
    }
}

// Render pagination
function renderPagination() {
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    const paginationContainer = document.querySelector('.pagination');

    if (!paginationContainer) return;

    if (totalPages <= 1) {
        paginationContainer.style.display = 'none';
        return;
    }

    paginationContainer.style.display = 'flex';

    let paginationHTML = '';

    // Previous button
    paginationHTML += `
        <button class="pagination-btn ${currentPage === 1 ? 'disabled' : ''}" 
                onclick="changePage(${currentPage - 1})" 
                ${currentPage === 1 ? 'disabled' : ''} 
                aria-label="Previous">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M15 18l-6-6 6-6"/>
            </svg>
        </button>
    `;

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            paginationHTML += `
                <button class="pagination-btn ${i === currentPage ? 'active' : ''}" 
                        onclick="changePage(${i})">
                    ${i}
                </button>
            `;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            paginationHTML += `<span style="padding:0 0.5rem;color:#999;">...</span>`;
        }
    }

    // Next button
    paginationHTML += `
        <button class="pagination-btn ${currentPage === totalPages ? 'disabled' : ''}" 
                onclick="changePage(${currentPage + 1})" 
                ${currentPage === totalPages ? 'disabled' : ''} 
                aria-label="Next">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 18l6-6-6-6"/>
            </svg>
        </button>
    `;

    paginationContainer.innerHTML = paginationHTML;
}

// Change page (global function for onclick)
window.changePage = function (page) {
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    if (page < 1 || page > totalPages) return;

    currentPage = page;
    renderProducts();
    renderPagination();

    // Scroll to top of products
    const filterSection = document.querySelector('.material-filter');
    if (filterSection) {
        filterSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    console.log('Changed to page:', page, 'Total items:', filteredProducts.length);
};


// Initialize products from API
async function initProducts() {
    const productsGrid = document.getElementById('productsGrid');

    try {
        const result = await API.products.getAll();

        if (result.success && result.data.length > 0) {
            allProducts = result.data;
            filteredProducts = [...allProducts];

            renderProducts();
            renderPagination();
            initializeFilters();
        } else {
            productsGrid.innerHTML = '<p style="text-align:center;grid-column:1/-1;">No products found</p>';
        }
    } catch (error) {
        console.error('Error loading products:', error);
        productsGrid.innerHTML = '<p style="text-align:center;grid-column:1/-1;color:red;">Error loading products</p>';
    }
}

// Initialize filter functionality
function initializeFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');

    if (filterButtons.length === 0) {
        console.warn('No filter buttons found');
        return;
    }

    // Count products by material
    function countProducts() {
        const counts = {
            all: allProducts.length,
            brass: 0,
            stainless: 0,
            aluminum: 0,
            steel: 0,
            plastic: 0
        };

        allProducts.forEach(product => {
            const material = product.material;
            if (counts[material] !== undefined) {
                counts[material]++;
            }
        });

        const countEl = {
            all: document.getElementById('countAll'),
            brass: document.getElementById('countBrass'),
            stainless: document.getElementById('countStainless'),
            aluminum: document.getElementById('countAluminum'),
            steel: document.getElementById('countSteel'),
            plastic: document.getElementById('countPlastic')
        };

        Object.keys(countEl).forEach(key => {
            if (countEl[key]) {
                countEl[key].textContent = counts[key];
            }
        });
    }

    // Filter products
    window.filterProducts = function (material) {
        console.log('Filtering by:', material);

        if (material === 'all') {
            filteredProducts = [...allProducts];
        } else {
            filteredProducts = allProducts.filter(p => p.material === material);
        }

        console.log('Filtered products:', filteredProducts.length);

        currentPage = 1;
        renderProducts();
        renderPagination();
    };

    // Bind filter buttons
    filterButtons.forEach(btn => {
        // Remove old listeners
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
    });

    // Re-query after replacing
    const newFilterButtons = document.querySelectorAll('.filter-btn');

    newFilterButtons.forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            const filter = this.getAttribute('data-filter');

            console.log('Filter clicked:', filter);

            newFilterButtons.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-pressed', 'false');
            });
            this.classList.add('active');
            this.setAttribute('aria-pressed', 'true');

            window.filterProducts(filter);
        });
    });

    countProducts();

    // Check URL for filter parameter
    const urlParams = new URLSearchParams(window.location.search);
    const materialParam = urlParams.get('material');
    if (materialParam && ['brass', 'stainless', 'aluminum', 'steel', 'plastic'].includes(materialParam)) {
        const targetBtn = document.querySelector(`.filter-btn[data-filter="${materialParam}"]`);
        if (targetBtn) {
            targetBtn.click();
        }
    }

    console.log('Filters initialized');
}

// Auto-init on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProducts);
} else {
    initProducts();
}
