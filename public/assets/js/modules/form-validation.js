/**
 * ========================================
 * O.N.Precision - Form Validation Module
 * ========================================
 * Module quản lý validation cho các form
 */

// Validation patterns
const ValidationPatterns = {
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    phone: /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,4}[-\s\.]?[0-9]{1,9}$/,
    url: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/
};

// Error messages (bilingual)
const ErrorMessages = {
    ja: {
        email_invalid: 'メールアドレスの形式が正しくありません',
        phone_invalid: '電話番号の形式が正しくありません（例: 090-1234-5678）',
        required: 'この項目は必須です',
        min_length: '文字以上入力してください',
        max_length: '文字以内で入力してください'
    },
    vi: {
        email_invalid: 'Email không đúng định dạng',
        phone_invalid: 'Số điện thoại không đúng định dạng (VD: 0907692367)',
        required: 'Trường này là bắt buộc',
        min_length: 'Vui lòng nhập ít nhất',
        max_length: 'Vui lòng nhập tối đa'
    }
};

/**
 * Get current language
 */
function getLang() {
    return localStorage.getItem('preferred_language') || 'ja';
}

/**
 * Show error message
 */
function showError(input, message) {
    clearError(input);
    input.classList.add('error');
    input.classList.remove('valid');

    const errorSpan = document.createElement('span');
    errorSpan.className = 'error-message';
    errorSpan.textContent = message;
    input.parentElement.appendChild(errorSpan);
}

/**
 * Clear error message
 */
function clearError(input) {
    const existingError = input.parentElement.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    input.classList.remove('error');
}

/**
 * Validate email
 */
function validateEmail(input) {
    const value = input.value.trim();
    const lang = getLang();

    clearError(input);
    input.classList.remove('valid', 'error');

    if (value === '') {
        if (input.hasAttribute('required')) {
            showError(input, ErrorMessages[lang].required);
            return false;
        }
        return true;
    }

    if (!ValidationPatterns.email.test(value)) {
        showError(input, ErrorMessages[lang].email_invalid);
        return false;
    }

    input.classList.add('valid');
    return true;
}

/**
 * Validate phone
 */
function validatePhone(input) {
    const value = input.value.trim();
    const cleanValue = value.replace(/[\s\-\.\(\)]/g, '');
    const lang = getLang();

    clearError(input);
    input.classList.remove('valid', 'error');

    if (value === '') {
        if (input.hasAttribute('required')) {
            showError(input, ErrorMessages[lang].required);
            return false;
        }
        return true;
    }

    if (!ValidationPatterns.phone.test(value) || cleanValue.length < 9) {
        showError(input, ErrorMessages[lang].phone_invalid);
        return false;
    }

    input.classList.add('valid');
    return true;
}

/**
 * Validate required field
 */
function validateRequired(input) {
    const value = input.value.trim();
    const lang = getLang();

    clearError(input);

    if (value === '' && input.hasAttribute('required')) {
        showError(input, ErrorMessages[lang].required);
        return false;
    }

    return true;
}

/**
 * Initialize form validation
 */
function initFormValidation() {
    // Email inputs
    document.querySelectorAll('input[type="email"]').forEach(input => {
        input.addEventListener('blur', () => validateEmail(input));
        input.addEventListener('input', () => {
            if (input.classList.contains('error')) {
                validateEmail(input);
            }
        });
    });

    // Phone inputs
    document.querySelectorAll('input[type="tel"]').forEach(input => {
        input.addEventListener('blur', () => validatePhone(input));
        input.addEventListener('input', () => {
            if (input.classList.contains('error')) {
                validatePhone(input);
            }
        });
    });
}

/**
 * Validate entire form
 */
function validateForm(form) {
    let isValid = true;

    form.querySelectorAll('input[type="email"]').forEach(input => {
        if (!validateEmail(input)) isValid = false;
    });

    form.querySelectorAll('input[type="tel"]').forEach(input => {
        if (!validatePhone(input)) isValid = false;
    });

    form.querySelectorAll('[required]').forEach(input => {
        if (!validateRequired(input)) isValid = false;
    });

    if (!isValid) {
        const firstError = form.querySelector('.error');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            firstError.focus();
        }
    }

    return isValid;
}

// Export functions
window.FormValidation = {
    init: initFormValidation,
    validate: validateForm,
    validateEmail,
    validatePhone,
    validateRequired,
    showError,
    clearError
};
