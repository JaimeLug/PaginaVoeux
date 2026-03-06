/**
 * contacto.js
 * Formulario de contacto — envío real vía Fetch API → procesar_correo.php
 */

(function () {
    'use strict';

    // Ruta al backend PHP (relativa a la raíz del proyecto)
    const BACKEND_URL = 'procesar_correo.php';

    // ──────────────────────────────────────────
    // Helpers de UI
    // ──────────────────────────────────────────

    function mostrarFeedback(wrapper, tipo, mensaje) {
        // Eliminar feedbacks previos
        limpiarFeedback(wrapper);

        const div = document.createElement('div');
        div.className = tipo === 'success' ? 'form-feedback form-feedback--success' : 'form-feedback form-feedback--error';
        div.setAttribute('role', 'alert');
        div.setAttribute('aria-live', 'assertive');

        const icono = tipo === 'success' ? '✓' : '✕';
        div.innerHTML = `<span class="form-feedback__icon">${icono}</span><span class="form-feedback__msg">${mensaje}</span>`;

        wrapper.appendChild(div);

        // Auto-ocultar tras 7 segundos si es éxito
        if (tipo === 'success') {
            setTimeout(function () {
                div.classList.add('form-feedback--hiding');
                setTimeout(function () { div.remove(); }, 500);
            }, 7000);
        }
    }

    function limpiarFeedback(wrapper) {
        const prev = wrapper.querySelectorAll('.form-feedback');
        prev.forEach(function (el) { el.remove(); });
    }

    function setBtnLoading(btn, loading) {
        const btnText = btn.querySelector('.btn-text');
        const btnArrow = btn.querySelector('.btn-arrow');

        if (loading) {
            btn.disabled = true;
            btn.classList.add('form-submit--loading');
            if (btnText) btnText.textContent = 'ENVIANDO...';
            if (btnArrow) btnArrow.style.opacity = '0';
        } else {
            btn.disabled = false;
            btn.classList.remove('form-submit--loading');
            if (btnText) btnText.textContent = 'ENVIAR MENSAJE';
            if (btnArrow) btnArrow.style.opacity = '1';
        }
    }

    // ──────────────────────────────────────────
    // Inicialización del formulario
    // ──────────────────────────────────────────

    function initContacto() {
        const form = document.getElementById('contacto-form');
        const submitBtn = document.getElementById('btn-submit-contacto');

        if (!form || !submitBtn) return;

        // Contenedor donde se insertan los mensajes de feedback
        const feedbackWrapper = form.querySelector('.form-submit-wrapper');

        form.addEventListener('submit', async function (e) {
            e.preventDefault();

            // Validación nativa HTML5
            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }

            // Limpiar feedback anterior
            limpiarFeedback(feedbackWrapper);

            // Estado de carga
            setBtnLoading(submitBtn, true);

            try {
                const formData = new FormData(form);

                const response = await fetch(BACKEND_URL, {
                    method: 'POST',
                    body: formData
                });

                // Intentar parsear JSON (aunque el servidor devuelva error HTTP)
                let data;
                try {
                    data = await response.json();
                } catch (_) {
                    data = { status: 'error', message: 'Respuesta inesperada del servidor. Intenta de nuevo.' };
                }

                if (data.status === 'success') {
                    mostrarFeedback(feedbackWrapper, 'success', data.message);
                    form.reset();
                } else {
                    mostrarFeedback(feedbackWrapper, 'error', data.message || 'Ocurrió un error inesperado.');
                }

            } catch (fetchError) {
                // Error de red (offline, CORS, etc.)
                mostrarFeedback(feedbackWrapper, 'error', 'No se pudo conectar con el servidor. Verifica tu conexión e inténtalo de nuevo.');
                console.error('[Contacto] fetch error:', fetchError);
            } finally {
                setBtnLoading(submitBtn, false);
            }
        });

        // Limpiar estado al navegar fuera de la sección
        window.addEventListener('section-unload', function () {
            if (form) {
                form.reset();
                limpiarFeedback(form.querySelector('.form-submit-wrapper') || form);
            }
        }, { once: true });
    }

    // Esperar a que el router inyecte la sección
    window.addEventListener('section-loaded', function handler(e) {
        if (e.detail && e.detail.section === 'contacto') {
            initContacto();
            window.removeEventListener('section-loaded', handler);
        }
    });

})();
